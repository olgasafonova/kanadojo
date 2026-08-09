import { useCurrentFrame, interpolate } from "remotion";
import { FadeUp } from "../../components/FadeUp";
import { colors, font } from "../../styles/tokens";
import type { KanjiChar } from "../../data/types";

const ReadingRow: React.FC<{ label: string; readings: string[] }> = ({
  label,
  readings,
}) => {
  if (readings.length === 0) return null;
  return (
    <div
      style={{
        fontFamily: font.japanese,
        fontSize: 14,
        color: colors.character,
      }}
    >
      <span style={{ color: colors.romaji, fontFamily: font.mono }}>
        {label}
      </span>
      {readings.join("、")}
    </div>
  );
};

const ExampleWord: React.FC<{ kanji: KanjiChar }> = ({ kanji }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.05)",
      borderRadius: 8,
      padding: "8px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 2,
      border: "1px solid rgba(255,255,255,0.04)",
    }}
  >
    <span
      style={{
        fontFamily: font.japanese,
        fontSize: 19,
        color: colors.character,
        whiteSpace: "nowrap",
      }}
    >
      {kanji.exampleWord}
      <span
        style={{
          fontFamily: font.mono,
          fontSize: 12,
          color: colors.romaji,
          marginLeft: 8,
        }}
      >
        {kanji.exampleReading}
      </span>
    </span>
    <span
      style={{
        fontFamily: font.mono,
        fontSize: 12,
        color: colors.romaji,
      }}
    >
      {kanji.exampleMeaning}
    </span>
  </div>
);

/** Meaning, readings, components, mnemonic text, and example word. */
export const KanjiInfo: React.FC<{ kanji: KanjiChar }> = ({ kanji }) => {
  const frame = useCurrentFrame();
  const meaningOpacity = interpolate(frame, [10, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const meaningY = interpolate(frame, [10, 18], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      {/* Meaning — the headline for a kanji */}
      <div
        style={{
          fontSize: 26,
          fontFamily: font.mono,
          fontWeight: font.weightBold,
          color: colors.accent,
          letterSpacing: 0.5,
          opacity: meaningOpacity,
          transform: `translateY(${meaningY}px)`,
          textTransform: "lowercase",
        }}
      >
        {kanji.meaning}
      </div>

      <FadeUp delay={14}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <ReadingRow label={"kun  "} readings={kanji.kunyomi} />
          <ReadingRow label={"on   "} readings={kanji.onyomi} />
        </div>
      </FadeUp>

      <FadeUp delay={18}>
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 12,
            color: colors.accentDecor,
            lineHeight: 1.5,
          }}
        >
          {kanji.components}
        </div>
      </FadeUp>

      <FadeUp delay={22}>
        <div
          style={{
            fontFamily: font.japanese,
            fontSize: 13.5,
            color: colors.character,
            lineHeight: 1.55,
            opacity: 0.85,
            textAlign: "left",
          }}
        >
          {kanji.mnemonic}
        </div>
      </FadeUp>

      <FadeUp delay={30}>
        <ExampleWord kanji={kanji} />
      </FadeUp>
    </>
  );
};
