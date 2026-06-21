import { useState, useEffect, useCallback, useRef } from "react";
import { colors, font } from "../styles/tokens";
import { review, createRecord } from "../srs/sm2";
import { getRecord, saveRecord, updateStreak } from "../store/progress";
import { playCorrectChime } from "../utils/chime";
import { getQuizQueue } from "./quiz/queue";
import { QuizFinished } from "./quiz/QuizFinished";
import { QuizStage } from "./quiz/QuizStage";
import type { KanaChar, KanaMode, Quality } from "../data/types";

interface Props {
  kanaMode: KanaMode;
}

export const QuizPage: React.FC<Props> = ({ kanaMode }) => {
  const [queue, setQueue] = useState<KanaChar[]>(() => getQuizQueue(kanaMode));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    answer: string;
  } | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [announcement, setAnnouncement] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback((mode: KanaMode) => {
    setQueue(getQuizQueue(mode));
    setIdx(0);
    setInput("");
    setFeedback(null);
    setScore({ correct: 0, total: 0 });
    setAnnouncement("");
  }, []);

  // Reset queue when switching kana mode
  useEffect(() => {
    reset(kanaMode);
  }, [kanaMode, reset]);

  const current = queue[idx];
  const isFinished = idx >= queue.length;

  // Auto-focus input
  useEffect(() => {
    if (!feedback && inputRef.current) {
      inputRef.current.focus();
    }
  }, [feedback, idx]);

  const submit = useCallback(() => {
    if (!current || feedback) return;

    const answer = input.trim().toLowerCase();
    const correct = answer === current.romaji;
    const quality: Quality = correct ? 2 : 0;

    const record = getRecord(current.char) || createRecord(current.char);
    const updated = review(record, quality);
    saveRecord(updated);
    updateStreak();

    if (correct) playCorrectChime();

    setAnnouncement(
      correct
        ? `Correct! ${current.char} is ${current.romaji}`
        : `Incorrect. ${current.char} is ${current.romaji}, you typed ${answer}`,
    );
    setFeedback({ correct, answer: current.romaji });
    setScore((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
    }));

    // Auto-advance after feedback
    setTimeout(
      () => {
        setFeedback(null);
        setInput("");
        setIdx((i) => i + 1);
      },
      correct ? 1500 : 3000,
    );
  }, [current, input, feedback]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  if (isFinished) {
    return (
      <QuizFinished
        correct={score.correct}
        total={score.total}
        onRestart={() => reset(kanaMode)}
      />
    );
  }

  return (
    <div style={container}>
      <QuizStage current={current} idx={idx} feedback={feedback} input={input} />

      {/* Input */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type romaji..."
          aria-label="Type the romaji reading for this character"
          disabled={!!feedback}
          autoComplete="off"
          autoCapitalize="off"
          style={{
            padding: "12px 24px",
            fontSize: 20,
            fontFamily: font.mono,
            background: "none",
            border: "none",
            borderBottom: `2px solid ${
              feedback
                ? feedback.correct
                  ? colors.correct
                  : colors.wrong
                : colors.romaji
            }`,
            borderRadius: 0,
            color: colors.character,
            textAlign: "center",
            outline: "none",
            width: "100%",
            maxWidth: 280,
          }}
        />
      </div>

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
        {idx + 1} / {queue.length}
      </div>
    </div>
  );
};

const container: React.CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "24px 16px",
};
