import { useState, useEffect, useCallback, useRef } from "react";
import { getQuizQueue, type QuizItem } from "./quiz/queue";
import {
  gradeAnswer,
  persistAnswer,
  announcementFor,
  feedbackDelayMs,
} from "./quiz/grading";
import { QuizFinished } from "./quiz/QuizFinished";
import { QuizStage, type Feedback } from "./quiz/QuizStage";
import type { Mode } from "../data/types";

interface Props {
  mode: Mode;
}

export const QuizPage: React.FC<Props> = ({ mode }) => {
  const [queue, setQueue] = useState<QuizItem[]>(() => getQuizQueue(mode));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [announcement, setAnnouncement] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Mode changes remount the page via key={mode} in App, so no reset effect.
  const reset = useCallback(() => {
    setQueue(getQuizQueue(mode));
    setIdx(0);
    setInput("");
    setFeedback(null);
    setScore({ correct: 0, total: 0 });
    setAnnouncement("");
  }, [mode]);

  const current = queue[idx];
  const isFinished = idx >= queue.length;

  // Auto-focus input
  useEffect(() => {
    if (!feedback) inputRef.current?.focus();
  }, [feedback, idx]);

  const advance = useCallback(() => {
    setFeedback(null);
    setInput("");
    setIdx((i) => i + 1);
  }, []);

  const submit = useCallback(() => {
    if (!current || feedback) return;

    const graded = gradeAnswer(current, input);
    persistAnswer(current.char, graded.correct);

    setAnnouncement(announcementFor(current.char, graded));
    setFeedback(graded);
    setScore((s) => ({
      correct: s.correct + (graded.correct ? 1 : 0),
      total: s.total + 1,
    }));

    setTimeout(advance, feedbackDelayMs(graded.correct));
  }, [current, input, feedback, advance]);

  if (isFinished) {
    return (
      <QuizFinished
        correct={score.correct}
        total={score.total}
        onRestart={reset}
      />
    );
  }

  return (
    <div style={container}>
      <QuizStage
        current={current}
        idx={idx}
        queueLength={queue.length}
        feedback={feedback}
        input={input}
        announcement={announcement}
        inputRef={inputRef}
        onInputChange={setInput}
        onSubmit={submit}
      />
    </div>
  );
};

const container: React.CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "24px 16px",
};
