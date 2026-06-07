export interface FuzzyResult {
  score: number;
  indices: number[];
  type: "exact" | "words" | "subsequence";
}

export function fuzzyMatch(text: string, query: string): FuzzyResult | null {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return null;

  const exactIdx = t.indexOf(q);
  if (exactIdx !== -1) {
    const indices = Array.from({ length: q.length }, (_, i) => exactIdx + i);
    return { score: 1000 - exactIdx, indices, type: "exact" };
  }

  const queryWords = q.split(/\s+/).filter(Boolean);
  if (queryWords.length > 1) {
    const allIndices: number[] = [];
    let searchFrom = 0;
    let allFound = true;
    for (const word of queryWords) {
      const wordIdx = t.indexOf(word, searchFrom);
      if (wordIdx === -1) {
        allFound = false;
        break;
      }
      for (let i = 0; i < word.length; i++) allIndices.push(wordIdx + i);
      searchFrom = wordIdx + word.length;
    }
    if (allFound) {
      return { score: 800 - allIndices[0], indices: allIndices, type: "words" };
    }
  }

  let qi = 0;
  const indices: number[] = [];
  let lastMatchIdx = -1;
  let gapPenalty = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      indices.push(i);
      if (lastMatchIdx !== -1) gapPenalty += i - lastMatchIdx - 1;
      lastMatchIdx = i;
      qi++;
    }
  }
  if (qi === q.length) {
    let boundaryBonus = 0;
    for (const idx of indices) {
      if (idx === 0 || /[\s\-_]/.test(t[idx - 1])) boundaryBonus += 50;
    }
    const score = Math.max(1, 500 - gapPenalty * 5 + boundaryBonus);
    return { score, indices, type: "subsequence" };
  }

  return null;
}
