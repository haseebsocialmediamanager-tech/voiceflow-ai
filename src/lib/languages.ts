export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const LANGUAGES: Language[] = [
  { code: "en-US", name: "English (US)", nativeName: "English", flag: "🇺🇸" },
  { code: "en-GB", name: "English (UK)", nativeName: "English", flag: "🇬🇧" },
  { code: "ur-PK", name: "Urdu", nativeName: "اردو", flag: "🇵🇰", rtl: true },
  { code: "ar-SA", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true },
  { code: "hi-IN", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "es-ES", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr-FR", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de-DE", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "pt-BR", name: "Portuguese (BR)", nativeName: "Português", flag: "🇧🇷" },
  { code: "zh-CN", name: "Chinese (Simplified)", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja-JP", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko-KR", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "ru-RU", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "tr-TR", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "it-IT", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "nl-NL", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "pl-PL", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "sv-SE", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "id-ID", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms-MY", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "th-TH", name: "Thai", nativeName: "ภาษาไทย", flag: "🇹🇭" },
  { code: "vi-VN", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "fa-IR", name: "Persian", nativeName: "فارسی", flag: "🇮🇷", rtl: true },
  { code: "bn-BD", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "ta-IN", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
];

export function getLang(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
