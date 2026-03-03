import type { Belt } from "../data/types";
import { colors } from "../styles/tokens";

interface KimonoBeltProps {
  belt: Belt;
  size?: number;
}

const BELT_COLORS: Record<Belt, string> = {
  white: colors.belt.white,
  yellow: colors.belt.yellow,
  green: colors.belt.green,
  blue: colors.belt.blue,
  brown: colors.belt.brown,
  black: colors.belt.black,
};

/**
 * Stylised kimono figure with a coloured obi (belt).
 * Hand-drawn-ish SVG that matches the mnemonic art vibe.
 */
export const KimonoBelt: React.FC<KimonoBeltProps> = ({ belt, size = 120 }) => {
  const beltColor = BELT_COLORS[belt];
  // Slightly lighter tint for the kimono fabric per belt rank
  const kimonoColor =
    belt === "black" ? "#2a2a3a" : belt === "brown" ? "#4a3828" : "#3d3460";
  const skinColor = "#e8d5c0";
  const hairColor = "#1a1520";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <ellipse cx="60" cy="28" rx="14" ry="16" fill={skinColor} />

      {/* Hair — top knot */}
      <ellipse cx="60" cy="16" rx="12" ry="10" fill={hairColor} />
      <circle cx="60" cy="8" r="5" fill={hairColor} />

      {/* Neck */}
      <rect x="55" y="42" width="10" height="6" rx="2" fill={skinColor} />

      {/* Kimono body — left flap */}
      <path
        d="M40 48 L60 48 L60 90 L35 90 Q32 90 32 87 L32 58 Q32 50 40 48Z"
        fill={kimonoColor}
      />
      {/* Kimono body — right flap (overlaps left, traditional) */}
      <path
        d="M80 48 L60 48 L60 90 L85 90 Q88 90 88 87 L88 58 Q88 50 80 48Z"
        fill={kimonoColor}
      />
      {/* V-neck collar */}
      <path
        d="M50 48 L60 64 L70 48"
        stroke={colors.character}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Obi (belt) — the star of the show */}
      <rect x="32" y="68" width="56" height="12" rx="2" fill={beltColor} />
      {/* Obi knot */}
      <ellipse cx="60" cy="74" rx="8" ry="5" fill={beltColor} />
      <ellipse
        cx="60"
        cy="74"
        rx="8"
        ry="5"
        fill="none"
        stroke={belt === "white" ? "#ccc" : "rgba(0,0,0,0.2)"}
        strokeWidth="1"
      />
      {/* Obi texture line */}
      <line
        x1="36"
        y1="74"
        x2="52"
        y2="74"
        stroke={belt === "white" ? "#ddd" : "rgba(0,0,0,0.15)"}
        strokeWidth="0.8"
      />
      <line
        x1="68"
        y1="74"
        x2="84"
        y2="74"
        stroke={belt === "white" ? "#ddd" : "rgba(0,0,0,0.15)"}
        strokeWidth="0.8"
      />

      {/* Sleeves */}
      <path d="M32 52 L18 62 L22 72 L32 66Z" fill={kimonoColor} opacity="0.9" />
      <path
        d="M88 52 L102 62 L98 72 L88 66Z"
        fill={kimonoColor}
        opacity="0.9"
      />

      {/* Hands */}
      <circle cx="20" cy="67" r="4" fill={skinColor} />
      <circle cx="100" cy="67" r="4" fill={skinColor} />

      {/* Hakama (lower garment) */}
      <path
        d="M35 90 L30 115 L55 115 L60 90 L65 115 L90 115 L85 90Z"
        fill={kimonoColor}
        opacity="0.85"
      />
      {/* Hakama pleat lines */}
      <line
        x1="45"
        y1="92"
        x2="42"
        y2="113"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="0.8"
      />
      <line
        x1="75"
        y1="92"
        x2="78"
        y2="113"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="0.8"
      />

      {/* Black belt outline for visibility on dark bg */}
      {belt === "black" && (
        <rect
          x="32"
          y="68"
          width="56"
          height="12"
          rx="2"
          fill="none"
          stroke={colors.romaji}
          strokeWidth="0.8"
        />
      )}
    </svg>
  );
};
