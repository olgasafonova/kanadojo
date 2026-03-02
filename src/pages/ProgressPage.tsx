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
import { BeltBadge, BELTS, getCurrentBelt } from "../components/BeltBadge";
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
    <div
      style={{
        fontFamily: font.mono,
        fontSize: 12,
        textTransform: "uppercase" as const,
        letterSpacing: 2,
        color: colors.romaji,
        marginBottom: 12,
      }}
    >
      {title}
    </div>
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
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: bg,
                  borderRadius: 6,
                  fontSize: 18,
                  fontFamily: font.japanese,
                  color: mastered || seen ? "#fff" : colors.romaji,
                  lineHeight: 1,
                }}
              >
                <span>{k.char}</span>
                <span
                  style={{
                    fontSize: 8,
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
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>
      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: 32,
          marginBottom: 32,
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
        />
      </div>

      {/* Belt cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 32,
        }}
      >
        {BELTS.map((b) => {
          const isCurrent = b.id === belt.id;
          const rangeText = b.max ? `${b.min} — ${b.max}` : `${b.min}+`;
          const progress =
            isCurrent && b.max
              ? Math.min(1, (masteredCount - b.min) / (b.max - b.min + 1))
              : isCurrent
                ? 0.1
                : masteredCount >= b.min
                  ? 1
                  : 0;

          return (
            <div
              key={b.id}
              style={{
                background: isCurrent
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(255,255,255,0.02)",
                border: `1px solid ${isCurrent ? b.color : "rgba(255,255,255,0.08)"}`,
                borderRadius: 10,
                padding: 16,
              }}
            >
              <BeltBadge belt={b.id} size="sm" />
              <div
                style={{
                  fontFamily: font.mono,
                  fontSize: 12,
                  color: colors.romaji,
                  marginTop: 8,
                }}
              >
                {rangeText} characters
              </div>
              {isCurrent && (
                <div
                  style={{
                    marginTop: 8,
                    height: 4,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.1)",
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

      {/* Character grids */}
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

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 12,
          fontFamily: font.mono,
          fontSize: 11,
          color: colors.romaji,
        }}
      >
        <span>
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: 2,
              background: colors.mastered,
              marginRight: 4,
              verticalAlign: "middle",
            }}
          />
          Mastered
        </span>
        <span>
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: 2,
              background: colors.learning,
              marginRight: 4,
              verticalAlign: "middle",
            }}
          />
          Learning
        </span>
        <span>
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: 2,
              background: colors.notStarted,
              marginRight: 4,
              verticalAlign: "middle",
            }}
          />
          Not started
        </span>
      </div>
    </div>
  );
};

const StatBlock: React.FC<{
  value: string | number;
  label: string;
  color: string;
}> = ({ value, label, color }) => (
  <div>
    <div
      style={{
        fontSize: 36,
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
        fontSize: 12,
        fontFamily: font.mono,
        textTransform: "uppercase" as const,
        letterSpacing: 1,
        color: colors.romaji,
        marginTop: 4,
      }}
    >
      {label}
    </div>
  </div>
);
