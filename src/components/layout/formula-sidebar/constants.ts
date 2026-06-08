export interface SidebarFormula {
  slug: string;
  name: string;
  category: string;
  shortForm: string;
  difficulty: string;
}

export const CATEGORY_META: Record<string, { label: string; short: string }> = {
  math: { label: "Mathematics", short: "Math" },
  physics: { label: "Physics", short: "Physics" },
  finance: { label: "Finance", short: "Finance" },
  chemistry: { label: "Chemistry", short: "Chem" },
  engineering: { label: "Engineering", short: "Eng" },
};

export const DIFFICULTY_META: Record<string, { label: string; tone: string }> = {
  beginner: { label: "Beginner", tone: "var(--success)" },
  intermediate: { label: "Intermediate", tone: "var(--warning)" },
  advanced: { label: "Advanced", tone: "var(--destructive)" },
};
