import { useState } from "react";
import { LearnPage } from "./pages/LearnPage";
import { QuizPage } from "./pages/QuizPage";
import { ProgressPage } from "./pages/ProgressPage";
import { AboutPage } from "./pages/AboutPage";
import { AppHeader } from "./components/AppHeader";
import { AppNav } from "./components/AppNav";
import { getCurrentBelt } from "./data/belts";
import { getMasteredCount } from "./store/progress";
import { colors, font } from "./styles/tokens";
import type { Mode, Page } from "./data/types";

const App: React.FC = () => {
  const [page, setPage] = useState<Page>("learn");
  const [mode, setMode] = useState<Mode>("hiragana");
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

      <AppHeader
        mode={mode}
        belt={belt.id}
        mastered={mastered}
        onModeChange={setMode}
        onLogoClick={() => setPage("learn")}
      />

      <AppNav page={page} onNavigate={setPage} />

      {/* Page content */}
      <main id="main-content">
        {page === "learn" && <LearnPage key={mode} mode={mode} />}
        {page === "quiz" && <QuizPage key={mode} mode={mode} />}
        {page === "progress" && <ProgressPage />}
        {page === "about" && <AboutPage />}
      </main>

      <footer
        style={{
          padding: "16px",
          textAlign: "center",
          fontSize: 12,
          color: colors.romaji,
          fontFamily: font.mono,
        }}
      >
        KanaDojo - Japanese Character Training
      </footer>
    </div>
  );
};

export default App;
