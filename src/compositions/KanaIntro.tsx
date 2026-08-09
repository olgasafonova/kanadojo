import { AbsoluteFill } from "remotion";
import { InkBrush } from "../components/InkBrush";
import { colors } from "../styles/tokens";
import { CharGlyph } from "./intro/CharGlyph";
import { KanaInfo } from "./intro/KanaInfo";
import type { KanaChar } from "../data/types";

interface KanaIntroProps {
  kana: KanaChar;
}

export const KanaIntro: React.FC<KanaIntroProps> = ({ kana }) => (
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
        flex: "0 0 240px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "32px 28px",
        gap: 20,
      }}
    >
      <CharGlyph char={kana.char} fontSize={110} glowSize={140} />
      <KanaInfo kana={kana} />
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
      {kana.mnemonicImage && (
        <InkBrush delay={6}>
          <img
            src={`${import.meta.env.BASE_URL}${kana.mnemonicImage}`}
            alt={`Mnemonic for ${kana.char}`}
            style={{
              width: "100%",
              height: "100%",
              maxWidth: 420,
              maxHeight: 420,
              objectFit: "contain",
              borderRadius: 14,
            }}
          />
        </InkBrush>
      )}
    </div>
  </AbsoluteFill>
);
