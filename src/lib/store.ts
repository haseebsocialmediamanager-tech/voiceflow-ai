import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EnhanceMode =
  | "professional"
  | "casual"
  | "formal"
  | "email"
  | "slack"
  | "code"
  | "raw";

export interface HistoryItem {
  id: string;
  transcript: string;
  enhanced: string;
  mode: EnhanceMode;
  language: string;
  createdAt: string;
}

interface VoiceState {
  isRecording: boolean;
  transcript: string;
  enhanced: string;
  enhanceMode: EnhanceMode;
  enhanceLevel: number; // 0-100
  language: string;
  history: HistoryItem[];
  privacyMode: boolean;

  setRecording: (v: boolean) => void;
  setTranscript: (v: string) => void;
  setEnhanced: (v: string) => void;
  setEnhanceMode: (v: EnhanceMode) => void;
  setEnhanceLevel: (v: number) => void;
  setLanguage: (v: string) => void;
  addToHistory: (item: HistoryItem) => void;
  clearCurrent: () => void;
  removeFromHistory: (id: string) => void;
  setPrivacyMode: (v: boolean) => void;
}

export const useVoiceStore = create<VoiceState>()(
  persist(
    (set) => ({
      isRecording: false,
      transcript: "",
      enhanced: "",
      enhanceMode: "professional",
      enhanceLevel: 60,
      language: "en-US",
      history: [],
      privacyMode: false,

      setRecording: (v) => set({ isRecording: v }),
      setTranscript: (v) => set({ transcript: v }),
      setEnhanced: (v) => set({ enhanced: v }),
      setEnhanceMode: (v) => set({ enhanceMode: v }),
      setEnhanceLevel: (v) => set({ enhanceLevel: v }),
      setLanguage: (v) => set({ language: v }),

      addToHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 100),
        })),

      clearCurrent: () => set({ transcript: "", enhanced: "" }),

      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((h) => h.id !== id),
        })),

      setPrivacyMode: (v) => set({ privacyMode: v }),
    }),
    {
      name: "voiceflow-storage",
      partialize: (state) => ({
        enhanceMode: state.enhanceMode,
        enhanceLevel: state.enhanceLevel,
        language: state.language,
        history: state.history,
        privacyMode: state.privacyMode,
      }),
    }
  )
);
