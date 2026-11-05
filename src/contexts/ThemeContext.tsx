"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("booknook-theme") as Theme | null;
    if (saved === "dark" || saved === "light") {
      setThemeState(saved);
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setThemeState(initial);
      applyTheme(initial);
    }
  }, []);

  function applyTheme(t: Theme) {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", t);
      document.documentElement.classList.toggle("dark", t === "dark");
      let meta = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "color-scheme";
        document.head.appendChild(meta);
      }
      meta.content = t;
    }
  }

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setThemeState(nextTheme);
    localStorage.setItem("booknook-theme", nextTheme);
    applyTheme(nextTheme);
  }

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("booknook-theme", t);
    applyTheme(t);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
