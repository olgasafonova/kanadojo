import { hiragana, hiraganaGroups } from "../data/hiragana";
import { katakana, katakanaGroups } from "../data/katakana";
import { kanji, kanjiGroups } from "../data/kanji";
import { colors, font } from "../styles/tokens";
import {
  getAllRecords,
  getStreak,
  getMasteredCount,
  getDueCount,
} from "../store/progress";
import { BELTS, getCurrentBelt } from "../data/belts";
import { CharGrid } from "./progress/CharGrid";
import { BeltCard } from "./progress/BeltCard";
import type { ReviewRecord } from "../data/types";

function accuracyPercent(records: Record<string, ReviewRecord>): number {
  const totalSeen = Object.keys(records).length;
  if (totalSeen === 0) return 0;
  const onTarget = Object.values(records).filter(
    (r) => r.lastQuality >= 1,
  ).length;
  return Math.round((onTarget / totalSeen) * 100);
}

const StatBlock: React.FC<{
  value: string | number;
  label: string;
  color: string;
  tooltip?: string;
}> = ({ value, label, color, tooltip }) => (
  <div title={tooltip}>
    <div
      style={{
        fontSize: 44,
        fontFamily: font.mono,
        fontWeight: 700,
        color,
        lineHeight: 1,
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: 17,
        fontFamily: font.mono,
        textTransform: "uppercase" as const,
        letterSpacing: 1.5,
        color: colors.romaji,
        marginTop: 6,
      }}
    >
      {label}
    </div>
  </div>
);

const LegendItem: React.FC<{ color: string; label: string }> = ({
  color,
  label,
}) => (
  <span>
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 12,
        height: 12,
        borderRadius: 2,
        background: color,
        marginRight: 6,
        verticalAlign: "middle",
      }}
    />
    {label}
  </span>
);

const StatsRow: React.FC<{
  masteredCount: number;
  streakCount: number;
  accuracy: number;
  dueCount: number;
}> = ({ masteredCount, streakCount, accuracy, dueCount }) => (
  <div
    className="stats-row"
    style={{
      display: "flex",
      gap: 40,
      marginBottom: 40,
      flexWrap: "wrap",
    }}
  >
    <StatBlock value={masteredCount} label="Mastered" color={colors.accent} />
    <StatBlock value={streakCount} label="Day Streak" color={colors.accent} />
    <StatBlock value={`${accuracy}%`} label="Accuracy" color={colors.accent} />
    <StatBlock
      value={dueCount}
      label="Due Today"
      color={colors.accentDecor}
      tooltip="Characters scheduled for review by spaced repetition. Quiz them to keep your memory fresh."
    />
  </div>
);

const kanaGridItems = (chars: typeof hiragana) =>
  chars.map((k) => ({
    char: k.char,
    group: k.group,
    sub: k.romaji,
    label: k.romaji,
  }));

const OverviewGrids: React.FC<{
  records: Record<string, ReviewRecord>;
}> = ({ records }) => (
  <>
    {/* Character grids — kana side by side */}
    <div
      className="char-grids"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 32,
      }}
    >
      <CharGrid
        title="Hiragana Overview"
        chars={kanaGridItems(hiragana)}
        groups={hiraganaGroups}
        records={records}
      />
      <CharGrid
        title="Katakana Overview"
        chars={kanaGridItems(katakana)}
        groups={katakanaGroups}
        records={records}
      />
    </div>

    {/* Kanji overview — full width */}
    <div style={{ marginTop: 8 }}>
      <CharGrid
        title="Kanji Overview"
        chars={kanji.map((k) => ({
          char: k.char,
          group: k.group,
          sub: k.meaning,
          label: k.meaning,
        }))}
        groups={kanjiGroups}
        records={records}
        showSub={false}
      />
    </div>
  </>
);

export const ProgressPage: React.FC = () => {
  const records = getAllRecords();
  const masteredCount = getMasteredCount();
  const belt = getCurrentBelt(masteredCount);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px" }}>
      <StatsRow
        masteredCount={masteredCount}
        streakCount={getStreak().count}
        accuracy={accuracyPercent(records)}
        dueCount={getDueCount()}
      />

      {/* Belt progression */}
      <div
        className="belt-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 16,
          marginBottom: 40,
        }}
      >
        {BELTS.map((b) => (
          <BeltCard
            key={b.id}
            belt={b}
            isCurrent={b.id === belt.id}
            masteredCount={masteredCount}
          />
        ))}
      </div>

      <OverviewGrids records={records} />

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 16,
          fontFamily: font.mono,
          fontSize: 16,
          color: colors.romaji,
        }}
      >
        <LegendItem color={colors.mastered} label="Mastered" />
        <LegendItem color={colors.learning} label="Learning" />
        <LegendItem color={colors.notStarted} label="Not started" />
      </div>
    </div>
  );
};
