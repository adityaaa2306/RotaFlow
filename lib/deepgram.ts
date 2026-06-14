export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey) {
    throw new Error("DEEPGRAM_API_KEY is not configured");
  }

  const response = await fetch(
    "https://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&smart_format=true",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": audioBlob.type || "audio/webm",
      },
      body: audioBlob,
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Deepgram transcription failed (${response.status}): ${errorBody || response.statusText}`
    );
  }

  const data = (await response.json()) as {
    results?: {
      channels?: Array<{
        alternatives?: Array<{ transcript?: string }>;
      }>;
    };
  };

  const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript;

  if (!transcript || typeof transcript !== "string" || transcript.trim() === "") {
    throw new Error("Deepgram returned an empty transcript");
  }

  return transcript.trim();
}
