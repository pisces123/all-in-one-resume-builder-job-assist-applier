"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemePreference = "light" | "dark" | "system";

const themeKey = "aio-resume-theme";

function applyTheme(preference: ThemePreference) {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = preference === "system" ? (systemDark ? "dark" : "light") : preference;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(themeKey) as ThemePreference | null;
    const initial: ThemePreference =
      stored === "light" || stored === "dark" || stored === "system" ? stored : "light";
    setPreference(initial);
    applyTheme(initial);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystem = () => {
      const current = (window.localStorage.getItem(themeKey) as ThemePreference | null) || "light";
      if (current === "system") applyTheme("system");
    };
    media.addEventListener("change", syncSystem);
    return () => media.removeEventListener("change", syncSystem);
  }, []);

  function choose(next: ThemePreference) {
    window.localStorage.setItem(themeKey, next);
    setPreference(next);
    applyTheme(next);
  }

  return (
    <div className="themeToggle" aria-label="Theme">
      <button
        type="button"
        className={preference === "light" ? "active" : ""}
        onClick={() => choose("light")}
        aria-label="Use light mode"
        title="Light"
      >
        <Sun size={15} />
      </button>
      <button
        type="button"
        className={preference === "dark" ? "active" : ""}
        onClick={() => choose("dark")}
        aria-label="Use dark mode"
        title="Dark"
      >
        <Moon size={15} />
      </button>
      <button
        type="button"
        className={preference === "system" ? "active" : ""}
        onClick={() => choose("system")}
        aria-label="Use system theme"
        title="System"
      >
        <Monitor size={15} />
      </button>
    </div>
  );
}
