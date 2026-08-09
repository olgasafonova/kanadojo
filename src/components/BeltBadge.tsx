import { colors, font } from "../styles/tokens";
import { BELTS } from "../data/belts";
import type { Belt } from "../data/types";

interface BeltBadgeProps {
  belt: Belt;
  size?: "sm" | "md";
}

export const BeltBadge: React.FC<BeltBadgeProps> = ({ belt, size = "md" }) => {
  const info = BELTS.find((b) => b.id === belt) || BELTS[0];
  const dotSize = size === "sm" ? 10 : 14;
  const fontSize = size === "sm" ? 13 : 16;

  return (
    <span
      role="img"
      aria-label={`${info.name} belt`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: font.mono,
        fontSize,
        color: colors.character,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: info.color,
          border: belt === "black" ? `1px solid ${colors.romaji}` : undefined,
          flexShrink: 0,
        }}
      />
      {info.kanji} {info.name}
    </span>
  );
};
