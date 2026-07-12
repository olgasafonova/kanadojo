import { useState, useEffect, useCallback, useRef } from "react";
import { Player } from "@remotion/player";
import { hiragana } from "../data/hiragana";
import { katakana } from "../data/katakana";
import { kanji } from "../data/kanji";
import { colors, font, timing } from "../styles/tokens";
import { review, isDue, createRecord } from "../srs/sm2";
import {
  getRecord,
  saveRecord,
  getAllRecords,
  updateStreak,
} from "../store/progress";
import { KanaQuiz } from "../compositions/KanaQuiz";
import { KanaResult } from "../compositions/KanaResult";
import { KanjiResult } from "../compositions/KanjiResult";
import { playCorrectChime } from "../utils/chime";
import type { KanaChar, KanjiChar, Mode, Quality } from "../data/types";

interface Props {
  mode: Mode;
}

type QuizItem = KanaChar | KanjiChar;

function isKanjiItem(item: QuizItem): item is KanjiChar {
  return (item as KanjiChar).meaning !== undefined;
}

/** The accepted answer(s) for an item, lowercased for comparison. */
function acceptedAnswers(item: QuizItem): string[] {
  if (isKanjiItem(item)) {
    return [item.meaning, ...(item.altMeanings ?? [])].map((m) =>
      m.toLowerCase().trim(),
    );
  }
  return [item.romaji.toLowerCase().trim()];
}

/** The canonical answer to reveal after a miss. */
function canonicalAnswer(item: QuizItem): string {
  return isKanjiItem(item) ? item.meaning : item.romaji;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function poolForMode(mode: Mode): QuizItem[] {
  if (mode === "kanji") return kanji;
  return mode === "hiragana" ? hiragana : katakana;
}

function getQuizQueue(mode: Mode): QuizItem[] {
  const chars = poolForMode(mode);
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

export const QuizPage: React.FC<Props> = ({ mode }) => {
  const [queue, setQueue] = useState<QuizItem[]>(() => getQuizQueue(mode));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    answer: string;
    typed: string;
  } | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [announcement, setAnnouncement] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isKanji = mode === "kanji";

  // Reset queue when switching mode
  useEffect(() => {
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
    if (!feedback && inputRef.current) {
      inputRef.current.focus();
    }
  }, [feedback, idx]);

  const submit = useCallback(() => {
    if (!current || feedback) return;

    const typed = input.trim().toLowerCase();
    const correct = acceptedAnswers(current).includes(typed);
    const quality: Quality = correct ? 2 : 0;
    const answer = canonicalAnswer(current);

    const record = getRecord(current.char) || createRecord(current.char);
    const updated = review(record, quality);
    saveRecord(updated);
    updateStreak();

    if (correct) playCorrectChime();

    setAnnouncement(
      correct
        ? `Correct! ${current.char} is ${answer}`
        : `Incorrect. ${current.char} is ${answer}, you typed ${typed}`,
    );
    setFeedback({ correct, answer, typed });
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

  const restart = () => {
    setQueue(getQuizQueue(mode));
    setIdx(0);
    setInput("");
    setFeedback(null);
    setScore({ correct: 0, total: 0 });
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
            Practice again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={container}>
      {/* Remotion Player: quiz character or feedback result */}
      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        {feedback ? (
          isKanji ? (
            <Player
              key={`result-${current.char}-${idx}`}
              component={KanjiResult}
              inputProps={{
                kanji: current as KanjiChar,
                correct: feedback.correct,
                userAnswer: feedback.correct ? undefined : feedback.typed,
              }}
              compositionWidth={920}
              compositionHeight={480}
              durationInFrames={timing.feedbackFrames}
              fps={timing.fps}
              autoPlay
              loop={false}
              moveToBeginningWhenEnded={false}
              style={{ width: "100%", aspectRatio: "920 / 480" }}
            />
          ) : (
            <Player
              key={`result-${current.char}-${idx}`}
              component={KanaResult}
              inputProps={{
                kana: current as KanaChar,
                correct: feedback.correct,
                userAnswer: feedback.correct ? undefined : feedback.typed,
              }}
              compositionWidth={920}
              compositionHeight={480}
              durationInFrames={timing.feedbackFrames}
              fps={timing.fps}
              autoPlay
              loop={false}
              moveToBeginningWhenEnded={false}
              style={{ width: "100%", aspectRatio: "920 / 480" }}
            />
          )
        ) : (
          <Player
            key={`quiz-${current.char}-${idx}`}
            component={KanaQuiz}
            inputProps={{
              char: current.char,
              hint: isKanji ? "type the meaning" : "type the romaji",
            }}
            compositionWidth={920}
            compositionHeight={480}
            durationInFrames={timing.quizFlashFrames}
            fps={timing.fps}
            autoPlay
            loop={false}
            moveToBeginningWhenEnded={false}
            style={{ width: "100%", aspectRatio: "920 / 480" }}
          />
        )}
      </div>

      {/* Input */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
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

const restartBtn: React.CSSProperties = {
  padding: "8px 0",
  minHeight: 44,
  borderRadius: 0,
  border: "none",
  borderBottom: `2px solid ${colors.accent}`,
  background: "none",
  color: colors.accent,
  fontFamily: font.mono,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  letterSpacing: 1,
};
