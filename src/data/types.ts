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

export interface KanjiChar {
  char: string;
  meaning: string; // primary English meaning, e.g. "rest"
  altMeanings?: string[]; // other accepted answers in the quiz
  onyomi: string[]; // Chinese-derived readings, katakana e.g. ["キュウ"]
  kunyomi: string[]; // Japanese readings, hiragana e.g. ["やす.む"]
  romaji: string; // primary reading in romaji — image/audio key
  group: string; // theme: numbers, time, nature, people, body, position, size, verbs, everyday
  components: string; // radical breakdown, e.g. "person 亻 + tree 木"
  mnemonic: string; // radical/component story that builds the meaning
  mnemonicImage?: string; // path to nano-banana generated image
  exampleWord: string; // e.g. "休み"
  exampleReading: string; // kana reading of the example, e.g. "やすみ"
  exampleMeaning: string; // e.g. "rest / holiday"
  strokes?: number;
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

export type Mode = "hiragana" | "katakana" | "kanji";

export type Page = "learn" | "quiz" | "progress" | "about";
