export type EnhanceMode =
  | "professional"
  | "casual"
  | "formal"
  | "email"
  | "slack"
  | "code"
  | "raw";

const PROMPTS: Record<EnhanceMode, string> = {
  raw: "Clean up the transcription only — fix obvious speech-to-text errors and filler words (um, uh, like). Do NOT rephrase or restructure. Return only the cleaned text.",

  professional:
    "Polish this dictation into professional, clear prose. Fix grammar and structure while preserving the speaker's intended meaning. Remove filler words. Keep it concise.",

  casual:
    "Clean up this dictation into a natural, conversational tone. Fix obvious errors but keep it sounding human and relaxed. Remove filler words.",

  formal:
    "Transform this dictation into formal, professional language suitable for legal documents, executive communications, or academic writing. Use complete sentences and proper grammar.",

  email:
    "Format this dictation as a professional email body. Add appropriate structure (greeting if needed, clear paragraphs, sign-off suggestion). Keep it concise and action-oriented.",

  slack:
    "Format this dictation as a Slack message. Keep it short, direct, and conversational. Use line breaks for readability. No formal greetings needed.",

  code:
    "This is a developer speaking. Clean up the dictation. Preserve technical terms, variable names, framework names, and code-related vocabulary exactly. Output code syntax correctly (==, =>, {}, [], etc.). If a code comment is being dictated, format it correctly.",
};

export async function enhanceText(
  text: string,
  mode: EnhanceMode,
  level: number,
  language = "en-US"
): Promise<string> {
  if (mode === "raw" || level === 0) {
    return cleanFillers(text);
  }

  try {
    const response = await fetch("/api/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, mode, level, language }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.enhanced || text;
  } catch (err) {
    console.error("Enhancement API failed, falling back to client-side:", err);
    return cleanFillers(text);
  }
}

function cleanFillers(text: string): string {
  return text
    .replace(/\b(um|uh|er|ah|like|you know|i mean|basically|literally|actually|sort of|kind of)\b,?\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}
