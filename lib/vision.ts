import {
  getNimVisionApiKey,
  NIM_BASE_URL,
  NIM_VISION_MODEL,
  parseJsonFromResponse,
} from "@/lib/nim";
import { VISION_SYSTEM_PROMPT, VISION_USER_PROMPT } from "@/lib/prompts";

export interface VisionResult {
  activity_description: string;
  caption: string;
  is_highlight: boolean;
  tags: string[];
}

export const EMPTY_VISION_RESULT: VisionResult = {
  activity_description: "",
  caption: "",
  is_highlight: false,
  tags: [],
};

const STRICT_JSON_SUFFIX =
  "\n\nReturn ONLY valid JSON. No preamble. No explanation. No markdown fences.";

function extractJsonObject(raw: string): string | null {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch?.[1]) {
    return fenceMatch[1].trim();
  }

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end > start) {
    return raw.slice(start, end + 1);
  }

  return null;
}

function parseVisionResult(raw: string): VisionResult {
  try {
    return parseJsonFromResponse<VisionResult>(raw);
  } catch {
    const jsonChunk = extractJsonObject(raw);
    if (jsonChunk) {
      return parseJsonFromResponse<VisionResult>(jsonChunk);
    }
    throw new Error("Vision model did not return valid JSON");
  }
}

function fallbackVisionResult(raw: string): VisionResult {
  const cleaned = raw.trim();
  if (!cleaned) {
    return EMPTY_VISION_RESULT;
  }

  const firstSentence =
    cleaned.split(/(?<=[.!?])\s+/)[0]?.trim() || cleaned.slice(0, 120);

  return {
    activity_description: cleaned.slice(0, 500),
    caption: firstSentence.slice(0, 100),
    is_highlight: false,
    tags: [],
  };
}

async function callVisionModel(
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  const apiKey = getNimVisionApiKey();

  const response = await fetch(NIM_BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: NIM_VISION_MODEL,
      messages: [
        { role: "system", content: VISION_SYSTEM_PROMPT },
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
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 1024,
      temperature: 0.2,
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

  return content;
}

export async function analyzeImage(
  imageBase64: string,
  mimeType: string
): Promise<VisionResult> {
  let content = await callVisionModel(imageBase64, mimeType, VISION_USER_PROMPT);

  try {
    return parseVisionResult(content);
  } catch {
    content = await callVisionModel(
      imageBase64,
      mimeType,
      `${VISION_USER_PROMPT}${STRICT_JSON_SUFFIX}`
    );

    try {
      return parseVisionResult(content);
    } catch {
      return fallbackVisionResult(content);
    }
  }
}

export async function analyzeImageSafe(
  imageBase64: string,
  mimeType = "image/jpeg"
): Promise<VisionResult> {
  try {
    return await analyzeImage(imageBase64, mimeType);
  } catch {
    return EMPTY_VISION_RESULT;
  }
}
