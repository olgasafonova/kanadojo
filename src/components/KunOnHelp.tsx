import { useState } from "react";
import { colors, font } from "../styles/tokens";

/**
 * Tap-to-expand explainer for the kun'yomi / on'yomi labels on kanji cards.
 * Collapsed by default; opens on click or touch (no hover, so it works on
 * mobile). Two reading cards sit side by side on desktop and stack on phones
 * via the .kunon-grid media rule in global.css.
 */
export const KunOnHelp: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: 20 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="kunon-panel"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          minHeight: 44,
          padding: "6px 2px",
          background: "none",
          border: "none",
          color: colors.romaji,
          fontFamily: font.mono,
          fontSize: 14,
          letterSpacing: 0.3,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: `1px solid ${colors.romaji}`,
            fontSize: 11,
            fontStyle: "italic",
            lineHeight: 1,
          }}
        >
          i
        </span>
        <span>
          What are <b style={{ color: colors.accent }}>kun</b> and{" "}
          <b style={{ color: colors.accent }}>on</b>?
        </span>
        <span
          aria-hidden="true"
          style={{
            marginLeft: 2,
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            fontSize: 11,
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          id="kunon-panel"
          role="region"
          aria-label="Explanation of kun and on readings"
          style={{ animation: "slideUp 0.25s ease both" }}
        >
          <div
            className="kunon-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 8,
            }}
          >
            <ReadingCard
              label="kun"
              japanese="訓読み"
              blurb="The native Japanese reading. Used when the kanji stands alone or takes a hiragana tail."
              example="休む"
              exampleReading="yasumu"
            />
            <ReadingCard
              label="on"
              japanese="音読み"
              blurb="The Chinese-derived reading. Used mostly inside compound words (two or more kanji together)."
              example="休日"
              exampleReading="kyūjitsu"
            />
          </div>

          <p
            style={{
              marginTop: 10,
              fontFamily: font.mono,
              fontSize: 12.5,
              lineHeight: 1.6,
              color: colors.romaji,
            }}
          >
            The dot in a kun reading (やす
            <span style={{ color: colors.accent }}>.</span>む) marks where the
            kanji&apos;s part ends and the hiragana tail begins — 休 covers{" "}
            <i>yasu</i>, and the む is written in kana.
          </p>
        </div>
      )}
    </div>
  );
};

const ReadingCard: React.FC<{
  label: string;
  japanese: string;
  blurb: string;
  example: string;
  exampleReading: string;
}> = ({ label, japanese, blurb, example, exampleReading }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10,
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}
  >
    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <span
        style={{
          fontFamily: font.mono,
          fontSize: 16,
          fontWeight: 700,
          color: colors.accent,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: font.japanese,
          fontSize: 14,
          color: colors.romaji,
        }}
      >
        {japanese}
      </span>
    </div>

    <p
      style={{
        fontFamily: font.japanese,
        fontSize: 13.5,
        lineHeight: 1.55,
        color: colors.character,
        opacity: 0.9,
      }}
    >
      {blurb}
    </p>

    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 8,
        marginTop: "auto",
        paddingTop: 4,
      }}
    >
      <span
        style={{
          fontFamily: font.japanese,
          fontSize: 20,
          color: colors.character,
        }}
      >
        {example}
      </span>
      <span
        aria-hidden="true"
        style={{ color: colors.romaji, fontFamily: font.mono, fontSize: 12 }}
      >
        →
      </span>
      <span
        style={{
          fontFamily: font.mono,
          fontSize: 13,
          color: colors.accentDecor,
        }}
      >
        {exampleReading}
      </span>
    </div>
  </div>
);
