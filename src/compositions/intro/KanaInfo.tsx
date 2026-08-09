import { useCurrentFrame, interpolate } from "remotion";
import { FadeUp } from "../../components/FadeUp";
import { colors, font } from "../../styles/tokens";
import type { KanaChar } from "../../data/types";

/** Romaji, mnemonic text, and example word for a kana character. */
export const KanaInfo: React.FC<{ kana: KanaChar }> = ({ kana }) => {
  const frame = useCurrentFrame();
  const romajiOpacity = interpolate(frame, [10, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const romajiY = interpolate(frame, [10, 18], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      {/* Romaji */}
      <div
        style={{
          fontSize: 24,
          fontFamily: font.mono,
          color: colors.romaji,
          letterSpacing: 3,
          opacity: romajiOpacity,
          transform: `translateY(${romajiY}px)`,
        }}
      >
        {kana.romaji}
      </div>

      {/* Mnemonic text */}
      <FadeUp delay={18}>
        <div
          style={{
            fontFamily: font.japanese,
            fontSize: 14,
            color: colors.character,
            lineHeight: 1.6,
            opacity: 0.85,
            textAlign: "left",
          }}
        >
          {kana.mnemonic}
        </div>
      </FadeUp>

      {/* Example word */}
      <FadeUp delay={28}>
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 8,
            padding: "8px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <span
            style={{
              fontFamily: font.japanese,
              fontSize: 20,
              color: colors.character,
              whiteSpace: "nowrap",
            }}
          >
            {kana.exampleWord}
          </span>
          <span
            style={{
              fontFamily: font.mono,
              fontSize: 12,
              color: colors.romaji,
            }}
          >
            {kana.exampleMeaning}
          </span>
        </div>
      </FadeUp>
    </>
  );
};
