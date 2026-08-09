import { colors, font } from "../../styles/tokens";
import { KimonoBelt } from "../../components/KimonoBelt";
import type { BeltInfo } from "../../data/types";

/** Fraction of the current belt's range that has been mastered. */
function beltProgress(
  belt: BeltInfo,
  isCurrent: boolean,
  achieved: boolean,
  masteredCount: number,
): number {
  if (!isCurrent) return achieved ? 1 : 0;
  if (!belt.max) return 0.1;
  return Math.min(1, (masteredCount - belt.min) / (belt.max - belt.min + 1));
}

interface BeltCardProps {
  belt: BeltInfo;
  isCurrent: boolean;
  masteredCount: number;
}

/** One belt tier in the progression grid, with a progress bar when current. */
export const BeltCard: React.FC<BeltCardProps> = ({
  belt,
  isCurrent,
  masteredCount,
}) => {
  const achieved = masteredCount >= belt.min;
  const rangeText = belt.max ? `${belt.min}–${belt.max}` : `${belt.min}+`;
  const progress = beltProgress(belt, isCurrent, achieved, masteredCount);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 12px 16px",
        opacity: achieved || isCurrent ? 1 : 0.35,
        borderBottom: isCurrent
          ? `3px solid ${belt.color}`
          : "3px solid transparent",
      }}
    >
      <KimonoBelt belt={belt.id} size={80} />
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 17,
          fontWeight: isCurrent ? 700 : 400,
          color: isCurrent ? belt.color : colors.character,
          marginTop: 12,
        }}
      >
        {belt.kanji} {belt.name}
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
              background: belt.color,
              borderRadius: 2,
              transition: "width 0.3s",
            }}
          />
        </div>
      )}
    </div>
  );
};
