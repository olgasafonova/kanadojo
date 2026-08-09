import { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  spring as remotionSpring,
} from "remotion";
import { colors } from "../styles/tokens";
import { pickReaction } from "./result/reactions";
import { ResultDetails } from "./result/ResultDetails";
import { ResultReaction } from "./result/ResultReaction";
import type { KanaChar } from "../data/types";

interface KanaResultProps {
  kana: KanaChar;
  correct: boolean;
  userAnswer?: string;
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
      <ResultDetails
        kana={kana}
        correct={correct}
        userAnswer={userAnswer}
        frame={frame}
        entry={entry}
        accentColor={accentColor}
        charScale={charScale}
        shakeX={shakeX}
        hintOpacity={hintOpacity}
      />
      <ResultReaction
        kana={kana}
        correct={correct}
        entry={entry}
        reaction={reaction}
      />
    </AbsoluteFill>
  );
};
