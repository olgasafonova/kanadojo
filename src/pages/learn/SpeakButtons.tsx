import { colors, font } from "../../styles/tokens";
import { kanjiId } from "../../data/kanji";
import {
  speakChar,
  speakWord,
  speakKanjiReading,
  speakKanjiWord,
} from "../../utils/speech";
import type { KanaChar, KanjiChar, Mode } from "../../data/types";
import type { LearnChar } from "./catalog";

const actionBtn: React.CSSProperties = {
  padding: "10px 18px",
  minHeight: 44,
  borderRadius: 0,
  border: "none",
  borderBottom: `2px solid ${colors.accent}`,
  background: "none",
  color: colors.accent,
  fontFamily: font.japanese,
  fontSize: 17,
  cursor: "pointer",
};

const KanjiSpeakButtons: React.FC<{ char: KanjiChar }> = ({ char }) => (
  <div style={{ display: "flex", gap: 12 }}>
    <button
      onClick={() => speakKanjiReading(kanjiId(char))}
      style={actionBtn}
      aria-label={`Hear the reading of ${char.char}`}
    >
      🔊 {char.char}
    </button>
    <button
      onClick={() => speakKanjiWord(kanjiId(char))}
      style={actionBtn}
      aria-label={`Hear example word ${char.exampleWord}`}
    >
      🔊 {char.exampleWord}
    </button>
  </div>
);

const KanaSpeakButtons: React.FC<{
  char: KanaChar;
  mode: "hiragana" | "katakana";
}> = ({ char, mode }) => (
  <div style={{ display: "flex", gap: 12 }}>
    <button
      onClick={() => speakChar(char.char, char.romaji)}
      style={actionBtn}
      aria-label={`Hear character ${char.romaji}`}
    >
      🔊 {char.char}
    </button>
    <button
      onClick={() => speakWord(char.romaji, mode)}
      style={actionBtn}
      aria-label={`Hear example word ${char.exampleWord}`}
    >
      🔊 {char.exampleWord}
    </button>
  </div>
);

interface SpeakButtonsProps {
  mode: Mode;
  currentChar: LearnChar;
}

/** Audio buttons for the current character and its example word. */
export const SpeakButtons: React.FC<SpeakButtonsProps> = ({
  mode,
  currentChar,
}) =>
  mode === "kanji" ? (
    <KanjiSpeakButtons char={currentChar as KanjiChar} />
  ) : (
    <KanaSpeakButtons char={currentChar as KanaChar} mode={mode} />
  );
