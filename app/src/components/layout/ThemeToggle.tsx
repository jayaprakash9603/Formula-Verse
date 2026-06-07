import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { neuVariants } from "@/lib/neu";

const STORAGE_KEY = "fv-theme";

function getIsDark(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(getIsDark);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  React.useEffect(() => {
    const onStorage = () => setIsDark(getIsDark());
    window.addEventListener("storage", onStorage);
    document.addEventListener("astro:after-swap", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("astro:after-swap", onStorage);
    };
  }, []);

  return (
    <button
      onClick={() => setIsDark((d) => !d)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn(
        neuVariants({ elevation: "inset", shape: "pill" }),
        "relative flex h-8 w-16 items-center p-0.5 shrink-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      <span className="absolute left-1.5 flex items-center justify-center text-[10px] opacity-50" aria-hidden>
        <Moon className="h-3.5 w-3.5 text-muted-foreground" />
      </span>
      <span className="absolute right-1.5 flex items-center justify-center text-[10px] opacity-50" aria-hidden>
        <Sun className="h-3.5 w-3.5 text-muted-foreground" />
      </span>

      <span
        className={cn(
          neuVariants({ elevation: "raised", shape: "pill" }),
          "relative z-10 flex h-6 w-6 items-center justify-center transition-all duration-200",
        )}
        style={{
          transform: isDark ? "translateX(0)" : "translateX(32px)",
          background: "var(--brand)",
          color: "#ffffff",
        }}
      >
        {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}
