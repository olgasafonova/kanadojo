import { AbsoluteFill } from "remotion";
import { colors } from "../styles/tokens";
import { CharGlyph } from "./intro/CharGlyph";
import { KanjiInfo } from "./intro/KanjiInfo";
import { MnemonicImage } from "./intro/MnemonicImage";
import type { KanjiChar } from "../data/types";

interface KanjiIntroProps {
  kanji: KanjiChar;
}

export const KanjiIntro: React.FC<KanjiIntroProps> = ({ kanji }) => (
  <AbsoluteFill
    style={{
      background: colors.bgCard,
      display: "flex",
      flexDirection: "row",
      alignItems: "stretch",
      borderRadius: 16,
      overflow: "hidden",
    }}
  >
    {/* Left column: character + text info */}
    <div
      style={{
        flex: "0 0 300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "28px 26px",
        gap: 14,
      }}
    >
      <CharGlyph char={kanji.char} />
      <KanjiInfo kanji={kanji} />
    </div>

    {/* Right column: mnemonic image — the hero */}
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <MnemonicImage kanji={kanji} />
    </div>
  </AbsoluteFill>
);
