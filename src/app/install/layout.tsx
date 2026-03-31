import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Install VoiceFlow AI — Chrome Extension + Mobile Guide",
  description:
    "Install VoiceFlow AI on Chrome, Brave, Edge in 2 minutes with Developer Mode. Press F2 to start/stop voice dictation on any website. Also works on mobile via PWA and Kiwi Browser.",
  keywords: [
    "install voice dictation extension", "chrome voice typing extension", "f2 voice dictation",
    "developer mode chrome extension install", "voiceflow ai install", "speech to text chrome extension",
  ],
  alternates: { canonical: "https://www.linkedwin.io/install" },
  openGraph: {
    title: "Install VoiceFlow AI — Works on any website",
    description: "Chrome extension for voice dictation on Gmail, WhatsApp Web, Facebook, LinkedIn. Press F2 anywhere to start. Free download.",
    url: "https://www.linkedwin.io/install",
    type: "website",
  },
};

export default function InstallLayout({ children }: { children: React.ReactNode }) {
  return children;
}
