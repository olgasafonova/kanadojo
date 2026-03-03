import { useState } from "react";
import { LearnPage } from "./pages/LearnPage";
import { QuizPage } from "./pages/QuizPage";
import { ProgressPage } from "./pages/ProgressPage";
import { AboutPage } from "./pages/AboutPage";
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
      {/* Skip link */}
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      {/* Header */}
      <header
        className="app-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: `1px solid rgba(255,255,255,0.04)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: font.mono,
            fontSize: 22,
            fontWeight: 700,
            cursor: "pointer",
          }}
          role="button"
          tabIndex={0}
          onClick={() => setPage("learn")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setPage("learn");
            }
          }}
        >
          <img
            src="/logo-enso-k.png"
            alt=""
            aria-hidden="true"
            style={{ width: 28, height: 28, borderRadius: 4 }}
          />
          Kana<span style={{ color: colors.accentDecor }}>Dojo</span>
        </div>

        {/* Kana mode toggle */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {(["hiragana", "katakana"] as KanaMode[]).map((mode, i) => (
            <span key={mode} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && (
                <span
                  style={{
                    color: colors.romaji,
                    opacity: 0.4,
                    margin: "0 8px",
                    fontSize: 14,
                  }}
                >
                  /
                </span>
              )}
              <button
                onClick={() => setKanaMode(mode)}
                aria-pressed={kanaMode === mode}
                style={{
                  padding: "4px 0",
                  border: "none",
                  background: "none",
                  color: kanaMode === mode ? colors.accent : colors.romaji,
                  fontFamily: font.mono,
                  fontSize: 15,
                  fontWeight: kanaMode === mode ? 700 : 400,
                  cursor: "pointer",
                }}
              >
                {mode === "hiragana" ? "あ Hiragana" : "ア Katakana"}
              </button>
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BeltBadge belt={belt.id} size="sm" />
          <span
            style={{
              fontFamily: font.mono,
              fontSize: 15,
              color: colors.romaji,
            }}
          >
            {mastered} mastered
          </span>
        </div>
      </header>

      {/* Nav */}
      <nav
        className="app-nav"
        role="navigation"
        aria-label="Main navigation"
        style={{
          display: "flex",
          gap: 24,
          padding: "0 24px",
          borderBottom: `1px solid rgba(255,255,255,0.04)`,
        }}
      >
        {(["learn", "quiz", "progress", "about"] as Page[]).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            aria-current={page === p ? "page" : undefined}
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
      <main id="main-content">
        {page === "learn" && <LearnPage kanaMode={kanaMode} />}
        {page === "quiz" && <QuizPage kanaMode={kanaMode} />}
        {page === "progress" && <ProgressPage />}
        {page === "about" && <AboutPage />}
      </main>
    </div>
  );
};

export default App;
