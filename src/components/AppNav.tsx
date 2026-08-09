import { colors, font } from "../styles/tokens";
import type { Page } from "../data/types";

const PAGES: Page[] = ["learn", "quiz", "progress", "about"];

interface AppNavProps {
  page: Page;
  onNavigate: (p: Page) => void;
}

export const AppNav: React.FC<AppNavProps> = ({ page, onNavigate }) => (
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
    {PAGES.map((p) => (
      <button
        key={p}
        onClick={() => onNavigate(p)}
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
);
