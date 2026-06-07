import { FORMULA_REGISTRY, FORMULA_SLUGS_LIVE } from "@/engines/formula-visualizer/index";
import { fuzzyMatch } from "@/lib/fuzzy-match";

/* Single brand teal — monochrome palette, no per-category colors */
const BRAND_TEAL = "#2a9d8f";

const CATEGORY_LABELS: Record<string, string> = {
  math: "Math",
  physics: "Physics",
  finance: "Finance",
  chemistry: "Chemistry",
  engineering: "Engineering",
};

export interface SearchItem {
  type: "formula" | "category";
  label: string;
  sub: string;
  path: string;
  catColor: string;
  emoji?: string;
  labelLower: string;
  searchTextLower: string;
}

export interface ScoredItem extends SearchItem {
  score: number;
  matchIndices: number[];
}

let _cachedIndex: SearchItem[] | null = null;

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  const categoryCounts: Record<string, number> = {};

  for (const slug of FORMULA_SLUGS_LIVE) {
    const f = FORMULA_REGISTRY[slug];
    categoryCounts[f.category] = (categoryCounts[f.category] ?? 0) + 1;

    const searchText = [f.name, f.shortForm, f.category, f.tagline, f.beginnerExplanation]
      .filter(Boolean)
      .join(" ");

    items.push({
      type: "formula",
      label: f.name,
      sub: f.tagline,
      path: `/tools/${slug}`,
      catColor: BRAND_TEAL,
      emoji: f.emoji,
      labelLower: f.name.toLowerCase(),
      searchTextLower: searchText.toLowerCase(),
    });
  }

  const seenCategories = new Set<string>();
  for (const slug of FORMULA_SLUGS_LIVE) {
    const cat = FORMULA_REGISTRY[slug].category;
    if (seenCategories.has(cat)) continue;
    seenCategories.add(cat);

    const count = categoryCounts[cat] ?? 0;
    const label = CATEGORY_LABELS[cat] ?? cat;

    items.push({
      type: "category",
      label,
      sub: `${count} formula${count !== 1 ? "s" : ""}`,
      path: `/formulas/${cat}`,
      catColor: BRAND_TEAL,
      labelLower: label.toLowerCase(),
      searchTextLower: label.toLowerCase(),
    });
  }

  return items;
}

function getIndex(): SearchItem[] {
  if (!_cachedIndex) _cachedIndex = buildIndex();
  return _cachedIndex;
}

const MAX_RESULTS = 20;
const MAX_CANDIDATES = 50;

export function searchItems(query: string, limit = MAX_RESULTS): ScoredItem[] {
  const q = query.trim();
  if (!q) return [];
  const qLower = q.toLowerCase();
  const tokens = qLower.split(/\s+/).filter(Boolean);
  const index = getIndex();

  const candidates = index.filter((item) => {
    if (item.labelLower.includes(qLower)) return true;
    if (item.searchTextLower.includes(qLower)) return true;
    return tokens.every((t) => item.searchTextLower.includes(t));
  });

  const source = candidates.length > 0 ? candidates.slice(0, MAX_CANDIDATES) : index;

  return source
    .map((item): ScoredItem | null => {
      const labelMatch = fuzzyMatch(item.label, q);
      const textMatch = fuzzyMatch(item.searchTextLower, q);
      const best = [labelMatch, textMatch]
        .filter((r): r is NonNullable<typeof r> => r !== null)
        .sort((a, b) => b.score - a.score)[0];
      if (!best) return null;
      const typeBonus = item.type === "formula" ? 50 : 0;
      return {
        ...item,
        score: best.score + typeBonus,
        matchIndices: labelMatch?.indices ?? best.indices,
      };
    })
    .filter((x): x is ScoredItem => x !== null)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.type === "formula" ? -1 : 1;
    })
    .slice(0, limit);
}
