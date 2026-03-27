import Link from "next/link";
import { Mic } from "lucide-react";

export const metadata = { title: "Terms of Service – VoiceFlow AI" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">{title}</h2>
      <div className="text-white/55 text-sm sm:text-base leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function TermsPage() {
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

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-white/35 text-sm mb-10">Last updated: January 1, 2026</p>

        <Section title="Acceptance of Terms">
          <p>By accessing or using VoiceFlow AI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
        </Section>

        <Section title="Description of Service">
          <p>VoiceFlow AI provides AI-powered voice dictation and text enhancement services, accessible via web application, browser bookmarklet, and mobile PWA. The Service uses browser-based speech recognition and AI language models to transcribe and enhance your spoken words.</p>
        </Section>

        <Section title="Account Registration">
          <p>You must provide accurate, complete information when creating an account. You are responsible for:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activity that occurs under your account</li>
            <li>Notifying us immediately of any unauthorized access</li>
          </ul>
          <p>You must be at least 13 years old to use the Service. If you are under 18, you confirm that you have parental consent.</p>
        </Section>

        <Section title="Acceptable Use">
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Create content that is illegal, harmful, threatening, or abusive</li>
            <li>Infringe on any intellectual property rights</li>
            <li>Attempt to reverse-engineer, disassemble, or hack the Service</li>
            <li>Use automated bots or scripts to access the Service</li>
            <li>Share account credentials with others outside your household</li>
          </ul>
        </Section>

        <Section title="Subscription and Billing">
          <p><strong className="text-white/80">Free plan:</strong> Available indefinitely with usage limits as described on our pricing page.</p>
          <p><strong className="text-white/80">Pro plan:</strong> Billed monthly. You may cancel at any time. Cancellation takes effect at the end of the current billing period. No refunds for partial months.</p>
          <p><strong className="text-white/80">Lifetime plan:</strong> A one-time payment grants perpetual access to all current Pro features. Future features may require separate purchase.</p>
          <p><strong className="text-white/80">Free trial:</strong> The 7-day free trial for the Pro plan requires a valid payment method. You will not be charged until the trial ends unless you choose to continue.</p>
        </Section>

        <Section title="Intellectual Property">
          <p>All content you dictate and create using VoiceFlow AI belongs to you. You grant us a limited, non-exclusive license to process your content solely to provide the Service.</p>
          <p>The VoiceFlow AI software, interface, and branding are owned by us and protected by applicable intellectual property laws.</p>
        </Section>

        <Section title="Limitation of Liability">
          <p>To the maximum extent permitted by law, VoiceFlow AI shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
        </Section>

        <Section title="Service Availability">
          <p>We strive for 99.9% uptime but do not guarantee uninterrupted access. Scheduled maintenance will be communicated in advance. We are not liable for downtime caused by third-party services (including browser speech recognition APIs).</p>
        </Section>

        <Section title="Termination">
          <p>Either party may terminate the agreement at any time. Upon termination, your right to use the Service ceases immediately. We will delete your account data within 30 days of termination.</p>
        </Section>

        <Section title="Governing Law">
          <p>These Terms are governed by the laws of Pakistan. Any disputes shall be resolved through binding arbitration before pursuing litigation.</p>
        </Section>

        <Section title="Contact">
          <p>Questions about these Terms? Email us at <strong className="text-white/70">legal@linkedwin.io</strong>.</p>
        </Section>

        <div className="mt-10 pt-8 border-t border-white/5">
          <Link href="/" className="text-sm text-white/30 hover:text-white transition-colors">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
