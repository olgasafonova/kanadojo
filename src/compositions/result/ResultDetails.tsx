import { interpolate } from "remotion";
import { InkSplatter } from "../../components/InkSplatter";
import { colors, font } from "../../styles/tokens";
import type { KanaChar } from "../../data/types";

interface ResultDetailsProps {
  kana: KanaChar;
  correct: boolean;
  userAnswer?: string;
  frame: number;
  entry: number;
  accentColor: string;
  charScale: number;
  shakeX: number;
  hintOpacity: number;
}

export const ResultDetails: React.FC<ResultDetailsProps> = ({
  kana,
  correct,
  userAnswer,
  frame,
  entry,
  accentColor,
  charScale,
  shakeX,
  hintOpacity,
}) => {
  return (
    <div
      style={{
        flex: "0 0 280px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        gap: 12,
        position: "relative",
      }}
    >
      {/* Ink splatter burst (correct only) */}
      {correct && (
        <InkSplatter
          triggerFrame={2}
          count={16}
          seed={kana.char.charCodeAt(0)}
          color={[
            "rgba(232,184,48,0.6)",
            "rgba(232,184,48,0.3)",
            "rgba(245,240,232,0.2)",
          ]}
        />
      )}

      {/* Background flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: accentColor,
          opacity: interpolate(frame, [0, 4, 12], [0, 0.08, 0], {
            extrapolateRight: "clamp",
          }),
          pointerEvents: "none",
        }}
      />

      {/* Character + romaji */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          transform: `scale(${charScale}) translateX(${shakeX}px)`,
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontFamily: font.japanese,
            fontWeight: font.weightBold,
            color: colors.character,
            lineHeight: 1,
          }}
        >
          {kana.char}
        </div>
        <div
          style={{
            fontSize: 28,
            fontFamily: font.mono,
            fontWeight: font.weightBold,
            color: accentColor,
            letterSpacing: 3,
          }}
        >
          {kana.romaji}
        </div>
      </div>

      {/* Result label */}
      <div
        style={{
          marginTop: 12,
          fontFamily: font.mono,
          fontSize: 16,
          fontWeight: 700,
          color: accentColor,
          letterSpacing: 1,
          opacity: interpolate(entry, [0.5, 1], [0, 1], {
            extrapolateLeft: "clamp",
          }),
        }}
      >
        {correct ? "Correct!" : `It's ${kana.romaji}`}
      </div>

      {/* Wrong answer: show what user typed */}
      {!correct && userAnswer && (
        <div
          style={{
            marginTop: 6,
            fontFamily: font.mono,
            fontSize: 14,
            color: colors.romaji,
            opacity: hintOpacity,
          }}
        >
          You typed: <span style={{ color: colors.wrong }}>{userAnswer}</span>
        </div>
      )}

      {/* Mnemonic text hint */}
      {!correct && (
        <div
          style={{
            marginTop: 8,
            fontFamily: font.japanese,
            fontSize: 14,
            color: colors.romaji,
            lineHeight: 1.5,
            opacity: hintOpacity,
            textAlign: "center",
            maxWidth: 220,
          }}
        >
          {kana.mnemonic}
        </div>
      )}
    </div>
  );
};
