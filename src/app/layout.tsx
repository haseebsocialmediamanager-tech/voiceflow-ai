import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VoiceFlow AI — Speak. Enhance. Done.",
  description:
    "Privacy-first AI dictation. Local processing, per-app context switching, developer mode, and smart text enhancement. The voice tool that actually works.",
  keywords: ["voice dictation", "AI transcription", "speech to text", "voice typing", "Whisper AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-surface-900 text-white antialiased`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#16161f",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
