import { colors, font } from "../styles/tokens";
import { BeltBadge } from "./BeltBadge";
import type { Belt, Mode } from "../data/types";

const MODE_LABELS: Record<Mode, string> = {
  hiragana: "あ Hiragana",
  katakana: "ア Katakana",
  kanji: "漢 Kanji",
};

const Logo: React.FC<{ onClick: () => void }> = ({ onClick }) => (
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
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }}
  >
    <img
      src={`${import.meta.env.BASE_URL}logo-enso-k.png`}
      alt=""
      aria-hidden="true"
      style={{ width: 28, height: 28, borderRadius: 4 }}
    />
    <h1
      style={{
        margin: 0,
        fontSize: "inherit",
        fontWeight: "inherit",
        fontFamily: "inherit",
      }}
    >
      Kana<span style={{ color: colors.accentDecor }}>Dojo</span>
    </h1>
  </div>
);

const ModeToggle: React.FC<{
  mode: Mode;
  onModeChange: (m: Mode) => void;
}> = ({ mode, onModeChange }) => (
  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
    {(Object.keys(MODE_LABELS) as Mode[]).map((m, i) => (
      <span key={m} style={{ display: "flex", alignItems: "center" }}>
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
          onClick={() => onModeChange(m)}
          aria-pressed={mode === m}
          style={{
            padding: "8px 12px",
            minHeight: 44,
            border: "none",
            background: "none",
            color: mode === m ? colors.accent : colors.romaji,
            fontFamily: font.mono,
            fontSize: 15,
            display: "flex",
            alignItems: "center",
            fontWeight: mode === m ? 700 : 400,
            cursor: "pointer",
          }}
        >
          {MODE_LABELS[m]}
        </button>
      </span>
    ))}
  </div>
);

interface AppHeaderProps {
  mode: Mode;
  belt: Belt;
  mastered: number;
  onModeChange: (m: Mode) => void;
  onLogoClick: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  mode,
  belt,
  mastered,
  onModeChange,
  onLogoClick,
}) => (
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
    <Logo onClick={onLogoClick} />
    <ModeToggle mode={mode} onModeChange={onModeChange} />
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <BeltBadge belt={belt} size="sm" />
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
);
