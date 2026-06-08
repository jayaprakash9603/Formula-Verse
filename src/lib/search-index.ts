import { FORMULA_REGISTRY, FORMULA_SLUGS_LIVE } from "@/engines/formula-visualizer/index";
import { fuzzyMatch } from "@/lib/fuzzy-match";

/* Single brand teal — monochrome palette, no per-category colors */
const BRAND_TEAL = "#006666";

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
  subIndices?: number[];
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

export function searchItems(query: string, limit = MAX_RESULTS): ScoredItem[] {
  const q = query.trim();
  if (!q) return [];
  const qLower = q.toLowerCase();
  const tokens = qLower.split(/\s+/).filter(Boolean);
  const index = getIndex();

  return index
    .map((item): ScoredItem | null => {
      const labelMatch = fuzzyMatch(item.label, q);
      const subMatch = fuzzyMatch(item.sub, q);

      // Evaluate full-text keyword matching (exact or token-based, NOT subsequence)
      let fullTextScore: number | null = null;
      if (item.searchTextLower.includes(qLower)) {
        fullTextScore = 200; // Direct substring match in prose
      } else if (tokens.length > 0 && tokens.every((token) => item.searchTextLower.includes(token))) {
        fullTextScore = 100; // All search tokens matched in prose
      }

      // If nothing matched, filter out
      if (!labelMatch && !subMatch && fullTextScore === null) {
        return null;
      }

      // Calculate score and select matching indices
      let score = 0;
      let matchIndices: number[] = [];
      let subIndices: number[] = [];

      if (labelMatch) {
        score = labelMatch.score;
        matchIndices = labelMatch.indices;
        if (subMatch) {
          subIndices = subMatch.indices;
        }
      } else if (subMatch) {
        score = subMatch.score - 150; // Tagline match is lower priority than title match
        subIndices = subMatch.indices;
      } else if (fullTextScore !== null) {
        score = fullTextScore;
      }

      const typeBonus = item.type === "formula" ? 50 : 0;

      return {
        ...item,
        score: score + typeBonus,
        matchIndices,
        subIndices,
      };
    })
    .filter((x): x is ScoredItem => x !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
