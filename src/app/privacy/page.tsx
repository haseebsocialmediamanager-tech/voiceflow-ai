import Link from "next/link";
import { Mic } from "lucide-react";

export const metadata = { title: "Privacy Policy – VoiceFlow AI" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">{title}</h2>
      <div className="text-white/55 text-sm sm:text-base leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-4 sm:px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-10">
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Mic size={13} />
            </div>
            <span className="text-sm font-semibold">VoiceFlow AI</span>
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-white/35 text-sm mb-10">Last updated: January 1, 2026</p>

        <Section title="Our Commitment to Privacy">
          <p>VoiceFlow AI was built privacy-first from day one. We believe your voice, your words, and your ideas belong to you — not to us, not to advertisers, and not to any third party.</p>
          <p>This policy explains exactly what data we collect, why we collect it, and how you can control it.</p>
        </Section>

        <Section title="Data We Collect">
          <p><strong className="text-white/80">Account information:</strong> When you sign up, we collect your name, email address, and phone number to create and secure your account.</p>
          <p><strong className="text-white/80">Voice data:</strong> Audio is processed locally in your browser using the Web Speech API. We do not record, store, or transmit your raw audio to our servers. Ever.</p>
          <p><strong className="text-white/80">Transcripts (optional):</strong> If you enable history, text transcripts are stored locally in your browser's localStorage. They are not uploaded to our servers unless you explicitly export them.</p>
          <p><strong className="text-white/80">Usage analytics:</strong> We collect anonymous, aggregated usage statistics (e.g., "X users clicked Enhance today") with no personal identifiers. You can opt out in Settings.</p>
        </Section>

        <Section title="AI Enhancement">
          <p>When you use the AI enhancement feature, your text is sent to our API, which uses Google Gemini or Anthropic Claude to process it. This text is:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Sent over HTTPS encrypted connections</li>
            <li>Processed in real-time — not stored by us</li>
            <li>Subject to Google's and Anthropic's data policies for API usage</li>
          </ul>
          <p>If you are uncomfortable with this, use "Raw" mode (level 0), which performs all processing locally with no API calls.</p>
        </Section>

        <Section title="No Screenshots. No Background Access.">
          <p>Unlike some competitors, VoiceFlow AI never takes screenshots of your screen, never reads your clipboard without permission, and never runs in the background without your knowledge. We have no access to your file system, camera, or other apps.</p>
        </Section>

        <Section title="Data Retention">
          <p>Account data is retained until you delete your account. You can delete your account at any time from Settings, which permanently removes all associated data within 30 days.</p>
          <p>Local browser storage (history, preferences) is entirely under your control and can be cleared at any time from Settings → Clear Data.</p>
        </Section>

        <Section title="Third-Party Services">
          <p>We use the following third-party services:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong className="text-white/70">Google Gemini API</strong> — AI text enhancement</li>
            <li><strong className="text-white/70">Anthropic Claude API</strong> — AI text enhancement (fallback)</li>
            <li><strong className="text-white/70">Vercel</strong> — Hosting and serverless functions</li>
          </ul>
          <p>We do not use advertising networks, data brokers, or social tracking pixels.</p>
        </Section>

        <Section title="Your Rights">
          <p>You have the right to access, correct, or delete any personal data we hold about you. Contact us at <strong className="text-white/70">privacy@linkedwin.io</strong> and we will respond within 30 days.</p>
        </Section>

        <Section title="Changes to This Policy">
          <p>We will notify you by email of any material changes to this policy at least 14 days before they take effect.</p>
        </Section>

        <Section title="Contact">
          <p>Questions? Reach us at <strong className="text-white/70">privacy@linkedwin.io</strong> or via the <Link href="/support" className="text-brand-400 hover:underline">Support page</Link>.</p>
        </Section>

        <div className="mt-10 pt-8 border-t border-white/5">
          <Link href="/" className="text-sm text-white/30 hover:text-white transition-colors">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
