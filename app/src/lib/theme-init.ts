export const THEME_STORAGE_KEY = "fv-theme";

export function resolveIsDark(stored: string | null, prefersDark: boolean, prefersLight: boolean): boolean {
  if (stored === "dark") return true;
  if (stored === "light") return false;
  if (prefersDark) return true;
  if (prefersLight) return false;
  return true;
}

export function applyFvTheme(doc: Document = document): void {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  const prefersDark = doc.defaultView?.matchMedia("(prefers-color-scheme: dark)").matches ?? false;
  const prefersLight = doc.defaultView?.matchMedia("(prefers-color-scheme: light)").matches ?? false;
  const isDark = resolveIsDark(stored, prefersDark, prefersLight);
  doc.documentElement.classList.toggle("dark", isDark);
  doc.documentElement.classList.toggle("light", !isDark);
  const meta = doc.getElementById("theme-color-meta");
  if (meta) meta.setAttribute("content", isDark ? "#2b2f36" : "#E7E5E4");
}
