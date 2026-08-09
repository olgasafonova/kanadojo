import { Player } from "@remotion/player";
import { colors, font, timing } from "../../styles/tokens";
import { KanaQuiz } from "../../compositions/KanaQuiz";
import { KanaResult } from "../../compositions/KanaResult";
import { KanjiResult } from "../../compositions/KanjiResult";
import { isKanjiItem, type QuizItem } from "./queue";

export interface Feedback {
  correct: boolean;
  answer: string;
  typed: string;
}

interface QuizStageProps {
  current: QuizItem;
  idx: number;
  queueLength: number;
  feedback: Feedback | null;
  input: string;
  announcement: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}

const playerDefaults = {
  compositionWidth: 920,
  compositionHeight: 480,
  fps: timing.fps,
  autoPlay: true,
  loop: false,
  moveToBeginningWhenEnded: false,
  style: { width: "100%", aspectRatio: "920 / 480" } as React.CSSProperties,
};

const ResultPlayer: React.FC<{
  current: QuizItem;
  idx: number;
  feedback: Feedback;
}> = ({ current, idx, feedback }) => {
  const userAnswer = feedback.correct ? undefined : feedback.typed;
  const key = `result-${current.char}-${idx}`;
  if (isKanjiItem(current)) {
    return (
      <Player
        key={key}
        component={KanjiResult}
        inputProps={{ kanji: current, correct: feedback.correct, userAnswer }}
        durationInFrames={timing.feedbackFrames}
        {...playerDefaults}
      />
    );
  }
  return (
    <Player
      key={key}
      component={KanaResult}
      inputProps={{ kana: current, correct: feedback.correct, userAnswer }}
      durationInFrames={timing.feedbackFrames}
      {...playerDefaults}
    />
  );
};

const PromptPlayer: React.FC<{ current: QuizItem; idx: number }> = ({
  current,
  idx,
}) => (
  <Player
    key={`quiz-${current.char}-${idx}`}
    component={KanaQuiz}
    inputProps={{
      char: current.char,
      hint: isKanjiItem(current) ? "type the meaning" : "type the romaji",
    }}
    durationInFrames={timing.quizFlashFrames}
    {...playerDefaults}
  />
);

function inputBorderColor(feedback: Feedback | null): string {
  if (!feedback) return colors.romaji;
  return feedback.correct ? colors.correct : colors.wrong;
}

const AnswerInput: React.FC<{
  isKanji: boolean;
  input: string;
  feedback: Feedback | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}> = ({ isKanji, input, feedback, inputRef, onInputChange, onSubmit }) => (
  <div style={{ textAlign: "center", marginBottom: 20 }}>
    <input
      ref={inputRef}
      type="text"
      value={input}
      onChange={(e) => onInputChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onSubmit();
        }
      }}
      placeholder={isKanji ? "type meaning..." : "type romaji..."}
      aria-label={
        isKanji
          ? "Type the English meaning for this kanji"
          : "Type the romaji reading for this character"
      }
      disabled={!!feedback}
      autoComplete="off"
      autoCapitalize="off"
      style={{
        padding: "12px 24px",
        fontSize: 20,
        fontFamily: font.mono,
        background: "none",
        border: "none",
        borderBottom: `2px solid ${inputBorderColor(feedback)}`,
        borderRadius: 0,
        color: colors.character,
        textAlign: "center",
        outline: "none",
        width: "100%",
        maxWidth: 280,
      }}
    />
  </div>
);

export const QuizStage: React.FC<QuizStageProps> = ({
  current,
  idx,
  queueLength,
  feedback,
  input,
  announcement,
  inputRef,
  onInputChange,
  onSubmit,
}) => (
  <>
    <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 24 }}>
      {feedback ? (
        <ResultPlayer current={current} idx={idx} feedback={feedback} />
      ) : (
        <PromptPlayer current={current} idx={idx} />
      )}
    </div>

    <AnswerInput
      isKanji={isKanjiItem(current)}
      input={input}
      feedback={feedback}
      inputRef={inputRef}
      onInputChange={onInputChange}
      onSubmit={onSubmit}
    />

    {/* Live region for screen readers */}
    <div aria-live="polite" className="sr-only">
      {announcement}
    </div>

    {/* Progress */}
    <div
      style={{
        fontFamily: font.mono,
        fontSize: 16,
        color: colors.romaji,
        textAlign: "center",
      }}
    >
      {idx + 1} / {queueLength}
    </div>
  </>
);
