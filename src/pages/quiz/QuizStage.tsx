import { Player } from "@remotion/player";
import { timing } from "../../styles/tokens";
import { KanaQuiz } from "../../compositions/KanaQuiz";
import { KanaResult } from "../../compositions/KanaResult";
import type { KanaChar } from "../../data/types";

interface QuizStageProps {
  current: KanaChar;
  idx: number;
  feedback: { correct: boolean; answer: string } | null;
  input: string;
}

const playerStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "920 / 480",
};

export const QuizStage: React.FC<QuizStageProps> = ({
  current,
  idx,
  feedback,
  input,
}) => {
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 24,
      }}
    >
      {feedback ? (
        <Player
          key={`result-${current.char}-${idx}`}
          component={KanaResult}
          inputProps={{
            kana: current,
            correct: feedback.correct,
            userAnswer: feedback.correct ? undefined : input,
          }}
          compositionWidth={920}
          compositionHeight={480}
          durationInFrames={timing.feedbackFrames}
          fps={timing.fps}
          autoPlay
          loop={false}
          moveToBeginningWhenEnded={false}
          style={playerStyle}
        />
      ) : (
        <Player
          key={`quiz-${current.char}-${idx}`}
          component={KanaQuiz}
          inputProps={{
            char: current.char,
          }}
          compositionWidth={920}
          compositionHeight={480}
          durationInFrames={timing.quizFlashFrames}
          fps={timing.fps}
          autoPlay
          loop={false}
          moveToBeginningWhenEnded={false}
          style={playerStyle}
        />
      )}
    </div>
  );
};
