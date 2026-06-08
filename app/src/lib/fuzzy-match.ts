export interface FuzzyResult {
  score: number;
  indices: number[];
  type: "exact" | "subsequence";
}

export function fuzzyMatch(text: string, query: string): FuzzyResult | null {
  const t = text;
  const q = query.trim();
  if (!q) return null;

  const tLower = t.toLowerCase();
  const qLower = q.toLowerCase();

  // Fast-path for exact substring matches
  const exactIdx = tLower.indexOf(qLower);
  if (exactIdx !== -1) {
    // Prefer matching on a word boundary if possible
    let bestExactIdx = exactIdx;
    let curr = exactIdx;
    while (curr !== -1) {
      const isWordStart = curr === 0 || /[\s\-_/]/.test(t[curr - 1]);
      if (isWordStart) {
        bestExactIdx = curr;
        break;
      }
      curr = tLower.indexOf(qLower, curr + 1);
    }

    const indices = Array.from({ length: q.length }, (_, i) => bestExactIdx + i);
    // High base score for exact matches, slightly penalizing later matches
    const score = 1000 - bestExactIdx;
    return { score, indices, type: "exact" };
  }

  // Memoization key: `${tIdx}_${qIdx}`
  const memo = new Map<string, { score: number; indices: number[] } | null>();

  function match(tIdx: number, qIdx: number): { score: number; indices: number[] } | null {
    if (qIdx === q.length) {
      return { score: 0, indices: [] };
    }
    if (tIdx === t.length) {
      return null;
    }

    const key = `${tIdx}_${qIdx}`;
    if (memo.has(key)) return memo.get(key)!;

    let best: { score: number; indices: number[] } | null = null;

    // Option 1: Skip the current character of text
    const skipResult = match(tIdx + 1, qIdx);
    if (skipResult) {
      best = { ...skipResult };
    }

    // Option 2: Match the current character if they are equal
    if (tLower[tIdx] === qLower[qIdx]) {
      const matchResult = match(tIdx + 1, qIdx + 1);
      if (matchResult) {
        let charScore = 100;

        // Word boundary bonus
        const isStartOfWord = tIdx === 0 || /[\s\-_/]/.test(t[tIdx - 1]);
        if (isStartOfWord) {
          charScore += 120;
        }

        // CamelCase bonus (uppercase following lowercase/number)
        const isCamel = tIdx > 0 && /[a-z0-9]/.test(t[tIdx - 1]) && /[A-Z]/.test(t[tIdx]);
        if (isCamel) {
          charScore += 80;
        }

        // Check if consecutive to previous matched character
        if (matchResult.indices.length > 0) {
          const nextMatchedIdx = matchResult.indices[0];
          if (nextMatchedIdx === tIdx + 1) {
            charScore += 100; // Consecutive bonus
          } else {
            // Gap penalty
            const gap = nextMatchedIdx - tIdx - 1;
            charScore -= Math.min(80, gap * 10);
          }
        }

        const totalScore = charScore + matchResult.score;
        if (best === null || totalScore > best.score) {
          best = {
            score: totalScore,
            indices: [tIdx, ...matchResult.indices],
          };
        }
      }
    }

    memo.set(key, best);
    return best;
  }

  const result = match(0, 0);
  if (!result) return null;

  // Final adjustments to subsequence match score
  let finalScore = result.score;
  if (result.indices[0] === 0) {
    finalScore += 50; // Start of string bonus
  }
  finalScore -= text.length * 0.5; // Slight length penalty

  return {
    score: finalScore,
    indices: result.indices,
    type: "subsequence",
  };
}
