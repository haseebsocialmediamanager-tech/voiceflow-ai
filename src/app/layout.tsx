import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0a0f",
};

export const metadata: Metadata = {
  title: "VoiceFlow AI — Speak. Enhance. Done.",
  description:
    "Privacy-first AI dictation for 25+ languages. Works on Windows, Mac, Android. Smart AI enhancement, developer mode, Urdu, Arabic, Hindi support.",
  keywords: ["voice dictation", "AI transcription", "speech to text", "urdu dictation", "arabic voice typing", "hindi voice", "multilingual dictation"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VoiceFlow AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Arabic / Urdu font support */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans bg-surface-900 text-white antialiased`}
        style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#16161f",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "14px",
              maxWidth: "90vw",
            },
          }}
        />
      </body>
    </html>
  );
}
