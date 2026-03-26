"use client";

/**
 * Injects text into whatever element is currently focused on the page.
 * Works for <input>, <textarea>, and contenteditable elements.
 * Falls back to clipboard if no editable element is focused.
 */
export function injectTextAtCursor(text: string): "injected" | "clipboard" {
  if (typeof window === "undefined") return "clipboard";

  const el = document.activeElement as HTMLInputElement | HTMLTextAreaElement | HTMLElement | null;

  if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
    const input = el as HTMLInputElement | HTMLTextAreaElement;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const before = input.value.slice(0, start);
    const after = input.value.slice(end);
    const newValue = before + text + after;

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      el.tagName === "INPUT" ? window.HTMLInputElement.prototype : window.HTMLTextAreaElement.prototype,
      "value"
    )?.set;

    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, newValue);
    } else {
      input.value = newValue;
    }

    input.selectionStart = input.selectionEnd = start + text.length;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return "injected";
  }

  // ContentEditable (Notion, Gmail compose, etc.)
  if (el && (el as HTMLElement).isContentEditable) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      return "injected";
    }
  }

  // Fallback: clipboard
  navigator.clipboard.writeText(text).catch(() => {});
  return "clipboard";
}
