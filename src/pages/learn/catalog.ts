import { hiragana, hiraganaGroups } from "../../data/hiragana";
import { katakana, katakanaGroups } from "../../data/katakana";
import { kanji, kanjiGroups } from "../../data/kanji";
import type { KanaChar, KanjiChar, Mode } from "../../data/types";

export type LearnChar = KanaChar | KanjiChar;

export interface LearnGroup {
  id: string;
  label: string;
}

export interface LearnCatalog {
  chars: LearnChar[];
  groups: LearnGroup[];
}

const CATALOGS: Record<Mode, LearnCatalog> = {
  hiragana: { chars: hiragana, groups: hiraganaGroups },
  katakana: { chars: katakana, groups: katakanaGroups },
  kanji: { chars: kanji, groups: kanjiGroups },
};

export function catalogForMode(mode: Mode): LearnCatalog {
  return CATALOGS[mode];
}
