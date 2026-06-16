export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ response: Response; data: T }> {
  const response = await fetch(input, init);
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const preview = (await response.text()).slice(0, 120);
    throw new Error(
      `Server returned non-JSON (${response.status}). ${
        preview.startsWith("<!DOCTYPE") || preview.startsWith("<html")
          ? "The API route may be blocked or unavailable on this deployment."
          : preview || "Unexpected response format."
      }`
    );
  }

  const data = (await response.json()) as T;
  return { response, data };
}
