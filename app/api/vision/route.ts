export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  NIM_BASE_URL,
  NIM_VISION_MODEL,
  parseJsonFromResponse,
} from "@/lib/nim";
import { VISION_USER_PROMPT } from "@/lib/prompts";

interface VisionResult {
  activity_description: string;
  caption: string;
  is_highlight: boolean;
  tags: string[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType } = body as {
      imageBase64?: string;
      mimeType?: string;
    };

    const apiKey = process.env.NVIDIA_NIM_API_KEY;
    if (!apiKey) {
      throw new Error("NVIDIA_NIM_API_KEY is not configured");
    }

    const response = await fetch(NIM_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: NIM_VISION_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${imageBase64}`,
                },
              },
              {
                type: "text",
                text: VISION_USER_PROMPT,
              },
            ],
          },
        ],
        max_tokens: 1024,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NIM API error (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("NIM API returned an empty response");
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[NIM vision raw response]", content);
    }

    const result = parseJsonFromResponse<VisionResult>(content);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
