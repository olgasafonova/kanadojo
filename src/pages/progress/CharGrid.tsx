import { colors, font } from "../../styles/tokens";
import { isMastered } from "../../srs/sm2";
import type { ReviewRecord } from "../../data/types";

export interface GridItem {
  char: string;
  group: string;
  sub: string; // subtitle shown under the char (romaji or meaning)
  label: string; // accessible label / tooltip
}

function cellBackground(mastered: boolean, seen: boolean): string {
  if (mastered) return colors.mastered;
  return seen ? colors.learning : colors.notStarted;
}

function cellStatus(mastered: boolean, seen: boolean): string {
  if (mastered) return "mastered";
  return seen ? "learning" : "not started";
}

const CharCell: React.FC<{
  item: GridItem;
  record: ReviewRecord | undefined;
  showSub: boolean;
}> = ({ item, record, showSub }) => {
  const mastered = !!record && isMastered(record);
  const seen = !!record;

  return (
    <div
      title={`${item.char} (${item.label})`}
      aria-label={`${item.label}: ${cellStatus(mastered, seen)}`}
      style={{
        width: 48,
        height: 48,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: cellBackground(mastered, seen),
        borderRadius: 6,
        fontSize: showSub ? 22 : 26,
        fontFamily: font.japanese,
        color: mastered || seen ? "#fff" : colors.romaji,
        lineHeight: 1,
      }}
    >
      <span>{item.char}</span>
      {showSub && (
        <span
          style={{
            fontSize: 12,
            fontFamily: font.mono,
            opacity: 0.7,
          }}
        >
          {item.sub}
        </span>
      )}
    </div>
  );
};

interface CharGridProps {
  title: string;
  chars: GridItem[];
  groups: { id: string; label: string; chars: string }[];
  records: Record<string, ReviewRecord>;
  showSub?: boolean; // hide the subtitle when it's too long (kanji meanings)
}

/** A titled grid of characters colored by learning status, one row per group. */
export const CharGrid: React.FC<CharGridProps> = ({
  title,
  chars,
  groups,
  records,
  showSub = true,
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
    {groups.map((group) => (
      <div
        key={group.id}
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 6,
          flexWrap: "wrap",
        }}
      >
        {chars
          .filter((k) => k.group === group.id)
          .map((k) => (
            <CharCell
              key={k.char}
              item={k}
              record={records[k.char]}
              showSub={showSub}
            />
          ))}
      </div>
    ))}
  </div>
);
