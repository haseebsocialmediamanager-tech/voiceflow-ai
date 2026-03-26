"use client";
import { useEffect, useRef } from "react";

/**
 * Fires callback when the given key is pressed twice within `delay` ms.
 * e.g. useDoubleKey("s", 400, toggleRecording)
 */
export function useDoubleKey(key: string, delay: number, callback: () => void) {
  const lastPressRef = useRef<number>(0);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger inside inputs / textareas
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;

      if (e.key.toLowerCase() !== key.toLowerCase()) return;

      const now = Date.now();
      if (now - lastPressRef.current < delay) {
        callback();
        lastPressRef.current = 0;
      } else {
        lastPressRef.current = now;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, delay, callback]);
}
