export interface KanaChar {
  char: string;
  romaji: string;
  type: "hiragana" | "katakana";
  group: string; // vowel, k, s, t, n, h, m, y, r, w
  mnemonic: string;
  mnemonicImage?: string; // path to nano-banana generated image
  exampleWord: string;
  exampleMeaning: string;
}

export interface ReviewRecord {
  char: string;
  easeFactor: number; // 1.3 - 2.5 (starts at 2.5)
  interval: number; // days until next review
  nextReview: string; // ISO date string
  repetitions: number;
  lastQuality: number;
}

export type Quality = 0 | 1 | 2; // 0 = wrong, 1 = hard, 2 = easy

export type Belt = "white" | "yellow" | "green" | "blue" | "brown" | "black";

export interface BeltInfo {
  id: Belt;
  kanji: string;
  name: string;
  min: number;
  max: number | null;
  color: string;
}

export type KanaMode = "hiragana" | "katakana";

export type Page = "learn" | "quiz" | "progress";
