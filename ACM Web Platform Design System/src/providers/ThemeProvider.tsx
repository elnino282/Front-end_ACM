import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = "acm_theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }

  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
};

const getStoredTheme = (defaultTheme: Theme): Theme => {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }

  return defaultTheme;
};

const resolveTheme = (theme: Theme): ResolvedTheme => {
  return theme === "system" ? getSystemTheme() : theme;
};

const applyThemeClass = (resolvedTheme: ResolvedTheme) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.classList.toggle("dark", resolvedTheme === "dark");
  root.style.colorScheme = resolvedTheme;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme(defaultTheme));
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(theme),
  );

  const applyResolvedTheme = useCallback((nextResolved: ResolvedTheme) => {
    setResolvedTheme(nextResolved);
    applyThemeClass(nextResolved);
  }, []);

  useEffect(() => {
    const nextResolved = resolveTheme(theme);
    applyResolvedTheme(nextResolved);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme, applyResolvedTheme]);

  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia(MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      applyResolvedTheme(event.matches ? "dark" : "light");
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleChange);
    } else {
      media.addListener(handleChange);
    }

    return () => {
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", handleChange);
      } else {
        media.removeListener(handleChange);
      }
    };
  }, [theme, applyResolvedTheme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
