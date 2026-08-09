import { interpolate } from "remotion";
import { InkSplatter } from "../../components/InkSplatter";
import { colors, font } from "../../styles/tokens";
import type { KanjiChar } from "../../data/types";

/** Typed answer and readings, revealed only on a miss. */
const MissDetails: React.FC<{
  kanji: KanjiChar;
  userAnswer?: string;
  opacity: number;
}> = ({ kanji, userAnswer, opacity }) => (
  <>
    {userAnswer && (
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 14,
          color: colors.romaji,
          opacity,
        }}
      >
        You typed: <span style={{ color: colors.wrong }}>{userAnswer}</span>
      </div>
    )}
    <div
      style={{
        fontFamily: font.japanese,
        fontSize: 13,
        color: colors.romaji,
        opacity,
        textAlign: "center",
      }}
    >
      {kanji.kunyomi.length > 0 && (
        <span style={{ marginRight: 16 }}>kun {kanji.kunyomi.join("、")}</span>
      )}
      {kanji.onyomi.length > 0 && <span>on {kanji.onyomi.join("、")}</span>}
    </div>
  </>
);

interface KanjiVerdictProps {
  kanji: KanjiChar;
  correct: boolean;
  userAnswer?: string;
  entry: number;
  frame: number;
}

/** Left column: the kanji, its meaning, and the verdict details. */
export const KanjiVerdict: React.FC<KanjiVerdictProps> = ({
  kanji,
  correct,
  userAnswer,
  entry,
  frame,
}) => {
  const accentColor = correct ? colors.correct : colors.wrong;
  const charScale = interpolate(entry, [0, 1], [0.6, 1]);
  const shakeX = correct
    ? 0
    : interpolate(frame, [0, 3, 6, 9, 12, 15], [0, -12, 10, -8, 5, 0], {
        extrapolateRight: "clamp",
      });
  const hintOpacity = correct
    ? 0
    : interpolate(frame, [15, 25], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  return (
    <div
      style={{
        flex: "0 0 300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        gap: 10,
        position: "relative",
      }}
    >
      {correct && (
        <InkSplatter
          triggerFrame={2}
          count={16}
          seed={kanji.char.charCodeAt(0)}
          color={[
            "rgba(232,184,48,0.6)",
            "rgba(232,184,48,0.3)",
            "rgba(245,240,232,0.2)",
          ]}
        />
      )}

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

      {/* Character + meaning */}
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
            fontSize: 104,
            fontFamily: font.japanese,
            fontWeight: font.weightBold,
            color: colors.character,
            lineHeight: 1,
          }}
        >
          {kanji.char}
        </div>
        <div
          style={{
            fontSize: 26,
            fontFamily: font.mono,
            fontWeight: font.weightBold,
            color: accentColor,
            letterSpacing: 1,
            textTransform: "lowercase",
          }}
        >
          {kanji.meaning}
        </div>
      </div>

      {/* Result label */}
      <div
        style={{
          marginTop: 8,
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
        {correct ? "Correct!" : `It means "${kanji.meaning}"`}
      </div>

      {!correct && (
        <MissDetails
          kanji={kanji}
          userAnswer={userAnswer}
          opacity={hintOpacity}
        />
      )}
    </div>
  );
};
