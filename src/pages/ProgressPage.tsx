import { hiragana, hiraganaGroups } from "../data/hiragana";
import { katakana, katakanaGroups } from "../data/katakana";
import { colors, font } from "../styles/tokens";
import {
  getAllRecords,
  getStreak,
  getMasteredCount,
  getDueCount,
} from "../store/progress";
import { isMastered } from "../srs/sm2";
import { BELTS, getCurrentBelt } from "../components/BeltBadge";
import { KimonoBelt } from "../components/KimonoBelt";
import type { KanaChar } from "../data/types";

interface CharGridProps {
  title: string;
  chars: KanaChar[];
  groups: { id: string; label: string; chars: string }[];
  records: Record<string, import("../data/types").ReviewRecord>;
}

const CharGrid: React.FC<CharGridProps> = ({
  title,
  chars,
  groups,
  records,
}) => (
  <div style={{ marginBottom: 24 }}>
    <h2
      style={{
        fontFamily: font.mono,
        fontSize: 18,
        textTransform: "uppercase" as const,
        letterSpacing: 2,
        color: colors.romaji,
        marginBottom: 14,
        fontWeight: 400,
      }}
    >
      {title}
    </h2>
    {groups.map((group) => {
      const groupChars = chars.filter((k) => k.group === group.id);
      return (
        <div
          key={group.id}
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 6,
            flexWrap: "wrap",
          }}
        >
          {groupChars.map((k) => {
            const rec = records[k.char];
            const mastered = rec && isMastered(rec);
            const seen = !!rec;
            const bg = mastered
              ? colors.mastered
              : seen
                ? colors.learning
                : colors.notStarted;
            return (
              <div
                key={k.char}
                title={`${k.char} (${k.romaji})`}
                aria-label={`${k.romaji}: ${mastered ? "mastered" : seen ? "learning" : "not started"}`}
                style={{
                  width: 48,
                  height: 48,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: bg,
                  borderRadius: 6,
                  fontSize: 22,
                  fontFamily: font.japanese,
                  color: mastered || seen ? "#fff" : colors.romaji,
                  lineHeight: 1,
                }}
              >
                <span>{k.char}</span>
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: font.mono,
                    opacity: 0.7,
                  }}
                >
                  {k.romaji}
                </span>
              </div>
            );
          })}
        </div>
      );
    })}
  </div>
);

export const ProgressPage: React.FC = () => {
  const records = getAllRecords();
  const streak = getStreak();
  const masteredCount = getMasteredCount();
  const dueCount = getDueCount();
  const belt = getCurrentBelt(masteredCount);
  const totalSeen = Object.keys(records).length;
  const accuracy =
    totalSeen > 0
      ? Math.round(
          (Object.values(records).filter((r) => r.lastQuality >= 1).length /
            totalSeen) *
            100,
        )
      : 0;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px" }}>
      {/* Stats row */}
      <div
        className="stats-row"
        style={{
          display: "flex",
          gap: 40,
          marginBottom: 40,
          flexWrap: "wrap",
        }}
      >
        <StatBlock
          value={masteredCount}
          label="Mastered"
          color={colors.accent}
        />
        <StatBlock
          value={streak.count}
          label="Day Streak"
          color={colors.accent}
        />
        <StatBlock
          value={`${accuracy}%`}
          label="Accuracy"
          color={colors.accent}
        />
        <StatBlock
          value={dueCount}
          label="Due Today"
          color={colors.accentDecor}
          tooltip="Characters scheduled for review by spaced repetition. Quiz them to keep your memory fresh."
        />
      </div>

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
        {BELTS.map((b) => {
          const isCurrent = b.id === belt.id;
          const achieved = masteredCount >= b.min;
          const rangeText = b.max ? `${b.min}–${b.max}` : `${b.min}+`;
          const progress =
            isCurrent && b.max
              ? Math.min(1, (masteredCount - b.min) / (b.max - b.min + 1))
              : isCurrent
                ? 0.1
                : achieved
                  ? 1
                  : 0;

          return (
            <div
              key={b.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px 12px 16px",
                opacity: achieved || isCurrent ? 1 : 0.35,
                borderBottom: isCurrent
                  ? `3px solid ${b.color}`
                  : "3px solid transparent",
              }}
            >
              <KimonoBelt belt={b.id} size={80} />
              <div
                style={{
                  fontFamily: font.mono,
                  fontSize: 17,
                  fontWeight: isCurrent ? 700 : 400,
                  color: isCurrent ? b.color : colors.character,
                  marginTop: 12,
                }}
              >
                {b.kanji} {b.name}
              </div>
              <div
                style={{
                  fontFamily: font.mono,
                  fontSize: 15,
                  color: colors.romaji,
                  marginTop: 4,
                }}
              >
                {rangeText} chars
              </div>
              {isCurrent && (
                <div
                  style={{
                    marginTop: 10,
                    width: "100%",
                    height: 4,
                    borderRadius: 2,
                    background: colors.notStarted,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress * 100}%`,
                      height: "100%",
                      background: b.color,
                      borderRadius: 2,
                      transition: "width 0.3s",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Character grids — side by side */}
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
          chars={hiragana}
          groups={hiraganaGroups}
          records={records}
        />
        <CharGrid
          title="Katakana Overview"
          chars={katakana}
          groups={katakanaGroups}
          records={records}
        />
      </div>

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
