import { hiragana } from "../../data/hiragana";
import { katakana } from "../../data/katakana";
import { kanji } from "../../data/kanji";
import { isDue } from "../../srs/sm2";
import { getAllRecords } from "../../store/progress";
import type { KanaChar, KanjiChar, Mode } from "../../data/types";

export type QuizItem = KanaChar | KanjiChar;

export function isKanjiItem(item: QuizItem): item is KanjiChar {
  return (item as KanjiChar).meaning !== undefined;
}

/** The accepted answer(s) for an item, lowercased for comparison. */
export function acceptedAnswers(item: QuizItem): string[] {
  if (isKanjiItem(item)) {
    return [item.meaning, ...(item.altMeanings ?? [])].map((m) =>
      m.toLowerCase().trim(),
    );
  }
  return [item.romaji.toLowerCase().trim()];
}

/** The canonical answer to reveal after a miss. */
export function canonicalAnswer(item: QuizItem): string {
  return isKanjiItem(item) ? item.meaning : item.romaji;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function poolForMode(mode: Mode): QuizItem[] {
  if (mode === "kanji") return kanji;
  return mode === "hiragana" ? hiragana : katakana;
}

export function getQuizQueue(mode: Mode): QuizItem[] {
  const chars = poolForMode(mode);
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
