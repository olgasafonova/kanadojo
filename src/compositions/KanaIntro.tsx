import { AbsoluteFill } from "remotion";
import { FadeUp } from "../components/FadeUp";
import { KanaCharacter } from "../components/KanaCharacter";
import { TypewriterText } from "../components/TypewriterText";
import { colors, font } from "../styles/tokens";
import type { KanaChar } from "../data/types";

interface KanaIntroProps {
  kana: KanaChar;
}

export const KanaIntro: React.FC<KanaIntroProps> = ({ kana }) => {
  return (
    <AbsoluteFill
      style={{
        background: colors.bgCard,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        gap: 48,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* Left: character */}
      <div
        style={{
          flex: "0 0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <KanaCharacter char={kana.char} romaji={kana.romaji} size={120} />
      </div>

      {/* Right: mnemonic + example */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxWidth: 400,
        }}
      >
        {kana.mnemonicImage && (
          <FadeUp delay={10}>
            <img
              src={kana.mnemonicImage}
              alt={`Mnemonic for ${kana.char} (${kana.romaji})`}
              style={{
                width: 180,
                height: 180,
                objectFit: "cover",
                borderRadius: 12,
                border: `1px solid rgba(255,255,255,0.1)`,
              }}
            />
          </FadeUp>
        )}

        <FadeUp delay={15}>
          <div
            style={{
              fontFamily: font.japanese,
              fontSize: 16,
              color: colors.character,
              lineHeight: 1.5,
            }}
          >
            {kana.mnemonic}
          </div>
        </FadeUp>

        <FadeUp delay={25}>
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "10px 16px",
              display: "flex",
              gap: 12,
              alignItems: "baseline",
            }}
          >
            <TypewriterText
              text={kana.exampleWord}
              startFrame={30}
              style={{
                fontFamily: font.japanese,
                fontSize: 22,
                color: colors.character,
              }}
            />
            <span
              style={{
                fontFamily: font.mono,
                fontSize: 14,
                color: colors.romaji,
              }}
            >
              {kana.exampleMeaning}
            </span>
          </div>
        </FadeUp>
      </div>
    </AbsoluteFill>
  );
};
