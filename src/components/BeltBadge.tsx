import { colors, font } from "../styles/tokens";
import type { Belt, BeltInfo } from "../data/types";

export const BELTS: BeltInfo[] = [
  {
    id: "white",
    kanji: "白帯",
    name: "White",
    min: 0,
    max: 9,
    color: colors.belt.white,
  },
  {
    id: "yellow",
    kanji: "黄帯",
    name: "Yellow",
    min: 10,
    max: 25,
    color: colors.belt.yellow,
  },
  {
    id: "green",
    kanji: "緑帯",
    name: "Green",
    min: 26,
    max: 50,
    color: colors.belt.green,
  },
  {
    id: "blue",
    kanji: "青帯",
    name: "Blue",
    min: 51,
    max: 80,
    color: colors.belt.blue,
  },
  {
    id: "brown",
    kanji: "茶帯",
    name: "Brown",
    min: 81,
    max: 120,
    color: colors.belt.brown,
  },
  {
    id: "black",
    kanji: "黒帯",
    name: "Black",
    min: 121,
    max: null,
    color: colors.belt.black,
  },
];

export function getCurrentBelt(mastered: number): BeltInfo {
  for (let i = BELTS.length - 1; i >= 0; i--) {
    if (mastered >= BELTS[i].min) return BELTS[i];
  }
  return BELTS[0];
}

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
