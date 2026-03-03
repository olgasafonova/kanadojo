import { colors } from "../styles/tokens";

type LogoVariant = "open" | "dotted" | "double";

interface DojoLogoProps {
  size?: number;
  variant?: LogoVariant;
}

let idCounter = 0;

export const DojoLogo: React.FC<DojoLogoProps> = ({
  size = 28,
  variant = "open",
}) => {
  const gradId = `enso-grad-${++idCounter}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.accent} />
          <stop offset="100%" stopColor={colors.accentDecor} />
        </linearGradient>
      </defs>

      {variant === "open" && (
        /* Classic ensō — open arc with gap at top-right */
        <path
          d="M 72 18 A 38 38 0 1 0 82 40"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="8"
          strokeLinecap="round"
        />
      )}

      {variant === "dotted" && (
        /* Ensō with a small ink dot inside (zen stone) */
        <>
          <path
            d="M 72 18 A 38 38 0 1 0 82 40"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="50" cy="52" r="5" fill={colors.accentDecor} />
        </>
      )}

      {variant === "double" && (
        /* Double-stroke ensō — outer thick, inner thin */
        <>
          <path
            d="M 72 18 A 38 38 0 1 0 82 40"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 66 28 A 26 26 0 1 0 72 42"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />
        </>
      )}
    </svg>
  );
};
