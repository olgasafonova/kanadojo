import { useState, useEffect, useCallback, useRef } from "react";
import { hiragana } from "../data/hiragana";
import { katakana } from "../data/katakana";
import { colors, font } from "../styles/tokens";
import { review, isDue, createRecord } from "../srs/sm2";
import {
  getRecord,
  saveRecord,
  getAllRecords,
  updateStreak,
} from "../store/progress";
import type { KanaChar, KanaMode, Quality } from "../data/types";

interface Props {
  kanaMode: KanaMode;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getQuizQueue(mode: KanaMode): KanaChar[] {
  const chars = mode === "hiragana" ? hiragana : katakana;
  const records = getAllRecords();

  // Priority 1: due for review
  const due = chars.filter((k) => {
    const rec = records[k.char];
    return rec && isDue(rec);
  });

  // Priority 2: never seen
  const unseen = chars.filter((k) => !records[k.char]);

  // Priority 3: everything else (shuffled)
  const rest = chars.filter((k) => {
    const rec = records[k.char];
    return rec && !isDue(rec);
  });

  return [
    ...shuffleArray(due),
    ...shuffleArray(unseen).slice(0, 5),
    ...shuffleArray(rest).slice(0, 5),
  ];
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
  const [timer, setTimer] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  // Reset queue when switching kana mode
  useEffect(() => {
    setQueue(getQuizQueue(kanaMode));
    setIdx(0);
    setInput("");
    setFeedback(null);
    setScore({ correct: 0, total: 0 });
    setTimer(0);
  }, [kanaMode]);

  const current = queue[idx];
  const isFinished = idx >= queue.length;

  // Start timer
  useEffect(() => {
    if (isFinished) return;
    const start = Date.now();
    timerRef.current = window.setInterval(() => {
      setTimer((Date.now() - start) / 1000);
    }, 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [idx, isFinished]);

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
        setTimer(0);
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

  const restart = () => {
    setQueue(getQuizQueue(kanaMode));
    setIdx(0);
    setInput("");
    setFeedback(null);
    setScore({ correct: 0, total: 0 });
    setTimer(0);
  };

  if (isFinished) {
    const pct =
      score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    return (
      <div style={container}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 48,
              fontFamily: font.mono,
              fontWeight: 700,
              color: colors.accent,
              marginBottom: 16,
            }}
          >
            {pct}%
          </div>
          <div
            style={{
              fontSize: 20,
              color: colors.character,
              marginBottom: 8,
            }}
          >
            {score.correct} / {score.total} correct
          </div>
          <div
            style={{
              fontSize: 15,
              color: colors.romaji,
              marginBottom: 32,
            }}
          >
            {pct >= 80
              ? "Great work! Keep drilling."
              : "Practice makes perfect. Try again!"}
          </div>
          <button onClick={restart} style={restartBtn}>
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={container}>
      {/* Timer */}
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 24,
          color: colors.romaji,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        {timer.toFixed(1)}s
      </div>

      {/* Character */}
      <div
        style={{
          fontSize: 140,
          fontFamily: font.japanese,
          fontWeight: 700,
          color: colors.character,
          textAlign: "center",
          lineHeight: 1,
          marginBottom: 24,
        }}
      >
        {current.char}
      </div>

      {/* Input */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type romaji..."
          disabled={!!feedback}
          autoComplete="off"
          autoCapitalize="off"
          style={{
            padding: "12px 24px",
            fontSize: 20,
            fontFamily: font.mono,
            background: "rgba(255,255,255,0.06)",
            border: `2px solid ${
              feedback
                ? feedback.correct
                  ? colors.correct
                  : colors.wrong
                : "rgba(255,255,255,0.15)"
            }`,
            borderRadius: 12,
            color: colors.character,
            textAlign: "center",
            outline: "none",
            width: 200,
          }}
        />
      </div>

      {/* Feedback */}
      {feedback && (
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span
            style={{
              display: "inline-block",
              padding: "8px 20px",
              borderRadius: 20,
              fontFamily: font.mono,
              fontSize: 15,
              background: feedback.correct
                ? "rgba(232,184,48,0.15)"
                : "rgba(224,112,96,0.15)",
              color: feedback.correct ? colors.correct : colors.wrong,
              border: `1px solid ${feedback.correct ? colors.correct : colors.wrong}`,
            }}
          >
            {feedback.correct ? "Correct!" : `${feedback.answer}`}
          </span>
        </div>
      )}

      {/* Progress */}
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 13,
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
  maxWidth: 500,
  margin: "0 auto",
  padding: "48px 16px",
};

const restartBtn: React.CSSProperties = {
  padding: "12px 32px",
  borderRadius: 10,
  border: `1px solid ${colors.accent}`,
  background: "rgba(232,184,48,0.15)",
  color: colors.accent,
  fontFamily: font.mono,
  fontSize: 16,
  cursor: "pointer",
};
