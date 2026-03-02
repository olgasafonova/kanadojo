import { useState } from "react";
import { LearnPage } from "./pages/LearnPage";
import { QuizPage } from "./pages/QuizPage";
import { ProgressPage } from "./pages/ProgressPage";
import { BeltBadge, getCurrentBelt } from "./components/BeltBadge";
import { getMasteredCount } from "./store/progress";
import { colors, font } from "./styles/tokens";
import type { KanaMode, Page } from "./data/types";

const App: React.FC = () => {
  const [page, setPage] = useState<Page>("learn");
  const [kanaMode, setKanaMode] = useState<KanaMode>("hiragana");
  const mastered = getMasteredCount();
  const belt = getCurrentBelt(mastered);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        color: colors.character,
        fontFamily: font.japanese,
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: `1px solid rgba(255,255,255,0.06)`,
        }}
      >
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 22,
            fontWeight: 700,
            cursor: "pointer",
          }}
          onClick={() => setPage("learn")}
        >
          Kana<span style={{ color: colors.accentDecor }}>Dojo</span>
        </div>

        {/* Kana mode toggle */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 8,
            padding: 3,
          }}
        >
          {(["hiragana", "katakana"] as KanaMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setKanaMode(mode)}
              style={{
                padding: "6px 16px",
                borderRadius: 6,
                border: "none",
                background:
                  kanaMode === mode ? "rgba(232,184,48,0.2)" : "transparent",
                color: kanaMode === mode ? colors.accent : colors.romaji,
                fontFamily: font.mono,
                fontSize: 13,
                fontWeight: kanaMode === mode ? 700 : 400,
                cursor: "pointer",
              }}
            >
              {mode === "hiragana" ? "あ Hiragana" : "ア Katakana"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BeltBadge belt={belt.id} size="sm" />
          <span
            style={{
              fontFamily: font.mono,
              fontSize: 13,
              color: colors.romaji,
            }}
          >
            {mastered} mastered
          </span>
        </div>
      </header>

      {/* Nav */}
      <nav
        style={{
          display: "flex",
          gap: 24,
          padding: "0 24px",
          borderBottom: `1px solid rgba(255,255,255,0.06)`,
        }}
      >
        {(["learn", "quiz", "progress"] as Page[]).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              padding: "12px 0",
              background: "none",
              border: "none",
              borderBottom: `2px solid ${page === p ? colors.accentDecor : "transparent"}`,
              color: page === p ? colors.character : colors.romaji,
              fontFamily: font.mono,
              fontSize: 16,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {p}
          </button>
        ))}
      </nav>

      {/* Page content */}
      {page === "learn" && <LearnPage kanaMode={kanaMode} />}
      {page === "quiz" && <QuizPage kanaMode={kanaMode} />}
      {page === "progress" && <ProgressPage />}
    </div>
  );
};

export default App;
