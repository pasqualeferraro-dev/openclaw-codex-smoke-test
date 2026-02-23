"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { applyTheme, getInitialTheme, type Theme } from "./ThemeProvider";

export default function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>("light");
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  function onToggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);

    // Tailwind dark: selector supports data-theme, but set class too for compatibility.
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <motion.button
      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
      type="button"
      onClick={onToggle}
      className="inline-flex items-center justify-center rounded-xl border border-slate-200/70 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
      aria-label="Change theme"
    >
      Change theme
      <span className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        ({theme})
      </span>
    </motion.button>
  );
}
