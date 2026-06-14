export const NIM_BASE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
export const NIM_TEXT_MODEL = "meta/llama-3.3-70b-instruct";
export const NIM_VISION_MODEL = "meta/llama-3.2-11b-vision-instruct";

export interface NimMessage {
  role: "system" | "user" | "assistant";
  content: string | NimContentPart[];
}

export interface NimContentPart {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

export interface CallNimOptions {
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  messages?: NimMessage[];
}

function stripMarkdownFences(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

export function parseJsonFromResponse<T>(raw: string): T {
  const cleaned = stripMarkdownFences(raw);
  return JSON.parse(cleaned) as T;
}

function normalizeNimApiKey(raw: string | undefined, envName: string): string {
  if (!raw?.trim()) {
    throw new Error(`${envName} is not configured`);
  }

  return raw.trim().replace(/^Bearer\s+/i, "").split(/\s+/)[0] ?? "";
}

export function getNimTextApiKey(): string {
  return normalizeNimApiKey(
    process.env.NVIDIA_NIM_TEXT_API_KEY,
    "NVIDIA_NIM_TEXT_API_KEY"
  );
}

export function getNimVisionApiKey(): string {
  return normalizeNimApiKey(
    process.env.NVIDIA_NIM_VISION_API_KEY,
    "NVIDIA_NIM_VISION_API_KEY"
  );
}

export async function callNim(
  prompt: string,
  options: CallNimOptions = {}
): Promise<string> {
  const apiKey = getNimTextApiKey();

  const messages: NimMessage[] = options.messages ?? [];
  if (options.systemPrompt) {
    messages.unshift({ role: "system", content: options.systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const response = await fetch(NIM_BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model ?? NIM_TEXT_MODEL,
      messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: 4096,
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
    console.log("[NIM raw response]", content);
  }

  return content;
}

export async function callNimJson<T>(
  prompt: string,
  options: CallNimOptions = {}
): Promise<T> {
  const strictSuffix =
    "\n\nReturn ONLY valid JSON. No preamble. No explanation. No markdown fences.";

  try {
    const raw = await callNim(prompt, options);
    return parseJsonFromResponse<T>(raw);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[NIM JSON parse failed, retrying]", error);
    }

    const raw = await callNim(`${prompt}${strictSuffix}`, {
      ...options,
      temperature: 0.1,
    });
    return parseJsonFromResponse<T>(raw);
  }
}
