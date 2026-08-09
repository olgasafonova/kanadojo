import { colors, font } from "../../styles/tokens";

interface QuizFinishedProps {
  correct: number;
  total: number;
  onRestart: () => void;
}

export const QuizFinished: React.FC<QuizFinishedProps> = ({
  correct,
  total,
  onRestart,
}) => {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
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
          {correct} / {total} correct
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
        <button onClick={onRestart} style={restartBtn}>
          Practice again
        </button>
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
