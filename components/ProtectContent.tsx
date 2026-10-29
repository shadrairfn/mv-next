"use client";

import { useEffect } from "react";

const fieldSelector = "input, textarea, select, [contenteditable='true']";
const blockedShortcuts = ["c", "u", "s", "p", "x"];
const fieldShortcuts = ["c", "x"];

function inField(target: EventTarget | null) {
  const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
  return element?.closest(fieldSelector) != null;
}

/** Keeps the original site's copy/context-menu/drag protection, except inside form fields. */
export function ProtectContent() {
  useEffect(() => {
    const block = (event: Event) => {
      if (!inField(event.target)) event.preventDefault();
    };
    const blockKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!(event.ctrlKey || event.metaKey) || !blockedShortcuts.includes(key)) return;
      if (fieldShortcuts.includes(key) && inField(event.target)) return;
      event.preventDefault();
    };

    const events = ["contextmenu", "dragstart", "selectstart", "copy", "cut"] as const;
    events.forEach((name) => document.addEventListener(name, block));
    document.addEventListener("keydown", blockKey);
    return () => {
      events.forEach((name) => document.removeEventListener(name, block));
      document.removeEventListener("keydown", blockKey);
    };
  }, []);

  return null;
}
