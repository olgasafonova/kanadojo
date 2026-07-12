import { useMemo, useState } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  spring as remotionSpring,
} from "remotion";
import { InkBrush } from "../components/InkBrush";
import { InkSplatter } from "../components/InkSplatter";
import { colors, font } from "../styles/tokens";
import type { KanjiChar } from "../data/types";

interface KanjiResultProps {
  kanji: KanjiChar;
  correct: boolean;
  userAnswer?: string;
}

const CORRECT_REACTIONS = [
  { kaomoji: "(＾▽＾)", text: "よし！" },
  { kaomoji: "＼(＾o＾)／", text: "すごい！" },
  { kaomoji: "(ノ´ヮ`)ノ*:・゚✧", text: "やった！" },
  { kaomoji: "(*≧▽≦)", text: "いいね！" },
] as const;

function pickReaction() {
  return CORRECT_REACTIONS[
    Math.floor(Math.random() * CORRECT_REACTIONS.length)
  ];
}

/**
 * Feedback composition after answering a kanji.
 * Correct: gold pulse + kaomoji celebration.
 * Wrong: red shake + reveals the meaning, readings, mnemonic and hero art.
 */
export const KanjiResult: React.FC<KanjiResultProps> = ({
  kanji,
  correct,
  userAnswer,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reaction = useMemo(() => pickReaction(), []);
  const [imageOk, setImageOk] = useState(true);

  const accentColor = correct ? colors.correct : colors.wrong;

  const entry = remotionSpring({
    frame,
    fps,
    config: { stiffness: 160, damping: 14 },
  });

  const shakeX = correct
    ? 0
    : interpolate(frame, [0, 3, 6, 9, 12, 15], [0, -12, 10, -8, 5, 0], {
        extrapolateRight: "clamp",
      });

  const charScale = interpolate(entry, [0, 1], [0.6, 1]);

  const hintOpacity = !correct
    ? interpolate(frame, [15, 25], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill
      style={{
        background: colors.bgCard,
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        overflow: "hidden",
        borderRadius: 16,
      }}
    >
      {/* Left column: character + result info */}
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

        {!correct && userAnswer && (
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 14,
              color: colors.romaji,
              opacity: hintOpacity,
            }}
          >
            You typed: <span style={{ color: colors.wrong }}>{userAnswer}</span>
          </div>
        )}

        {/* Readings revealed on a miss */}
        {!correct && (
          <div
            style={{
              fontFamily: font.japanese,
              fontSize: 13,
              color: colors.romaji,
              opacity: hintOpacity,
              textAlign: "center",
            }}
          >
            {kanji.kunyomi.length > 0 && (
              <span style={{ marginRight: 16 }}>
                kun {kanji.kunyomi.join("、")}
              </span>
            )}
            {kanji.onyomi.length > 0 && (
              <span>on {kanji.onyomi.join("、")}</span>
            )}
          </div>
        )}
      </div>

      {/* Right column: kaomoji (correct) or mnemonic art (wrong) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        {correct ? (
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              transform: `scale(${interpolate(entry, [0, 1], [0.3, 1])})`,
              opacity: interpolate(entry, [0.3, 1], [0, 1], {
                extrapolateLeft: "clamp",
              }),
            }}
          >
            <InkSplatter
              triggerFrame={3}
              count={28}
              seed={kanji.char.charCodeAt(0) + 99}
              color={[
                "rgba(232,184,48,0.5)",
                "rgba(224,112,96,0.35)",
                "rgba(232,184,48,0.25)",
                "rgba(245,240,232,0.2)",
              ]}
            />
            <div
              style={{
                fontSize: 72,
                color: colors.accent,
                fontFamily: font.japanese,
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {reaction.kaomoji}
            </div>
            <div
              style={{
                fontSize: 32,
                fontFamily: font.japanese,
                fontWeight: 700,
                color: colors.accent,
                letterSpacing: 4,
              }}
            >
              {reaction.text}
            </div>
          </div>
        ) : kanji.mnemonicImage && imageOk ? (
          <InkBrush delay={8}>
            <img
              src={`${import.meta.env.BASE_URL}${kanji.mnemonicImage}`}
              alt={`Mnemonic for ${kanji.char} (${kanji.meaning})`}
              onError={() => setImageOk(false)}
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
        ) : (
          // Fallback while art is pending: show the mnemonic story instead.
          <div
            style={{
              fontFamily: font.japanese,
              fontSize: 16,
              color: colors.character,
              lineHeight: 1.6,
              opacity: 0.85,
              maxWidth: 340,
              textAlign: "center",
            }}
          >
            {kanji.mnemonic}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
