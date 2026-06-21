import { hiragana } from "../../data/hiragana";
import { katakana } from "../../data/katakana";
import { isDue } from "../../srs/sm2";
import { getAllRecords } from "../../store/progress";
import type { KanaChar, KanaMode } from "../../data/types";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getQuizQueue(mode: KanaMode): KanaChar[] {
  const chars = mode === "hiragana" ? hiragana : katakana;
  const records = getAllRecords();

  // Priority 1: due for review
  const due = chars.filter((k) => {
    const rec = records[k.char];
    return rec && isDue(rec);
  });

  // Priority 2: never seen
  const unseen = chars.filter((k) => !records[k.char]);

  // Priority 3: everything else (shuffled)
  const rest = chars.filter((k) => {
    const rec = records[k.char];
    return rec && !isDue(rec);
  });

  return [
    ...shuffleArray(due),
    ...shuffleArray(unseen).slice(0, 5),
    ...shuffleArray(rest).slice(0, 5),
  ];
}
