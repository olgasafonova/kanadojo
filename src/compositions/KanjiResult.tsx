import { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring as remotionSpring,
} from "remotion";
import { colors } from "../styles/tokens";
import { pickReaction } from "./result/reactions";
import { KanjiVerdict } from "./result/KanjiVerdict";
import { KanjiReaction } from "./result/KanjiReaction";
import type { KanjiChar } from "../data/types";

interface KanjiResultProps {
  kanji: KanjiChar;
  correct: boolean;
  userAnswer?: string;
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

  const entry = remotionSpring({
    frame,
    fps,
    config: { stiffness: 160, damping: 14 },
  });

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
      <KanjiVerdict
        kanji={kanji}
        correct={correct}
        userAnswer={userAnswer}
        entry={entry}
        frame={frame}
      />
      <KanjiReaction
        kanji={kanji}
        correct={correct}
        entry={entry}
        reaction={reaction}
      />
    </AbsoluteFill>
  );
};
