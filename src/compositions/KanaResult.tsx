import { useMemo } from "react";
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
import type { KanaChar } from "../data/types";

interface KanaResultProps {
  kana: KanaChar;
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
 * Feedback composition after answering.
 * Correct: gold pulse + checkmark
 * Wrong: red shake + shows correct romaji + mnemonic image as hero
 */
export const KanaResult: React.FC<KanaResultProps> = ({
  kana,
  correct,
  userAnswer,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reaction = useMemo(() => pickReaction(), []);

  const accentColor = correct ? colors.correct : colors.wrong;

  // Entry spring
  const entry = remotionSpring({
    frame,
    fps,
    config: { stiffness: 160, damping: 14 },
  });

  // (pulse ring removed — using InkSplatter instead)

  // Wrong: horizontal shake
  const shakeX = correct
    ? 0
    : interpolate(frame, [0, 3, 6, 9, 12, 15], [0, -12, 10, -8, 5, 0], {
        extrapolateRight: "clamp",
      });

  // Character scale
  const charScale = interpolate(entry, [0, 1], [0.6, 1]);

  // Mnemonic hint for wrong answers - fades in later
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

      {/* Right column: kaomoji (correct) or mnemonic image (wrong) */}
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
              seed={kana.char.charCodeAt(0) + 99}
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
        ) : (
          kana.mnemonicImage && (
            <InkBrush delay={8}>
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
          )
        )}
      </div>
    </AbsoluteFill>
  );
};
