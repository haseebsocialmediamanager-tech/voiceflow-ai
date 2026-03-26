import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PROMPTS: Record<string, string> = {
  raw: "Clean up only — fix speech-to-text errors and remove filler words (um, uh, like, you know). Do NOT rephrase. Return only the cleaned text.",
  professional: "Polish this dictation into professional, clear prose. Fix grammar and structure. Remove filler words. Keep the speaker's meaning.",
  casual: "Clean this into natural conversational text. Fix errors but keep it human and relaxed. Remove filler words.",
  formal: "Transform into formal language suitable for legal documents, executive communication, or academic writing.",
  email: "Format as a professional email body. Add structure, clear paragraphs. Keep it concise and action-oriented.",
  slack: "Format as a Slack message. Short, direct, conversational. No formal greetings needed.",
  code: "Developer speaking. Preserve technical terms, variable names, framework names exactly. Output code syntax correctly: ==, =>, {}, [], etc.",
  fix: "Fix ALL spelling mistakes, grammar errors, and typos in this text. Keep the original meaning and style exactly. Only fix errors, nothing else. Return only the corrected text.",
};

const INTENSITY: Record<string, string> = {
  light: "Make minimal changes — only fix clear errors.",
  balanced: "Make moderate improvements — fix errors and improve flow.",
  strong: "Thoroughly polish — fix everything and make it shine.",
};

function cleanFillers(text: string): string {
  return text
    .replace(/\b(um|uh|er|ah|like|you know|i mean|basically|literally|actually|sort of|kind of)\b,?\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getIntensityLabel(level: number): string {
  if (level < 30) return "light";
  if (level < 75) return "balanced";
  return "strong";
}

export async function POST(request: NextRequest) {
  try {
    const { text, mode, level, language } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Raw / level 0 — just clean locally
    if (mode === "raw" || level === 0) {
      return NextResponse.json({ enhanced: cleanFillers(text), provider: "local" });
    }

    const modePrompt = PROMPTS[mode] ?? PROMPTS.professional;
    const intensityPrompt = INTENSITY[getIntensityLabel(level)];
    const langNote =
      language && language !== "en-US"
        ? `The input is in language "${language}". Enhance in the same language — do NOT translate.`
        : "";

    const fullPrompt = [
      modePrompt,
      intensityPrompt,
      langNote,
      "Return ONLY the enhanced text. No explanations, no quotes, no extra formatting.",
      `\nInput:\n${text}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    // ── Try Gemini first ─────────────────────────────────────
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey !== "your_gemini_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(fullPrompt);
        const enhanced = result.response.text().trim();
        return NextResponse.json({ enhanced, provider: "gemini" });
      } catch (geminiErr) {
        console.error("Gemini failed, trying fallback:", geminiErr);
      }
    }

    // ── Fallback: Anthropic Claude ───────────────────────────
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey && anthropicKey !== "your_anthropic_key_here") {
      try {
        const { default: Anthropic } = await import("@anthropic-ai/sdk");
        const client = new Anthropic({ apiKey: anthropicKey });
        const message = await client.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          messages: [{ role: "user", content: fullPrompt }],
        });
        const enhanced =
          message.content[0].type === "text" ? message.content[0].text.trim() : text;
        return NextResponse.json({ enhanced, provider: "claude" });
      } catch (claudeErr) {
        console.error("Claude fallback failed:", claudeErr);
      }
    }

    // ── Last resort: local cleanup ───────────────────────────
    return NextResponse.json({ enhanced: cleanFillers(text), provider: "local" });

  } catch (error) {
    console.error("Enhance route error:", error);
    return NextResponse.json({ enhanced: null, error: "Enhancement failed" }, { status: 500 });
  }
}
