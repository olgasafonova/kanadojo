import { useCurrentFrame, interpolate } from "remotion";
import type { CSSProperties } from "react";
import { font, colors } from "../styles/tokens";

interface TypewriterTextProps {
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  style?: CSSProperties;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame = 0,
  charsPerFrame = 0.5,
  style,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const visibleChars = Math.min(
    Math.floor(elapsed * charsPerFrame),
    text.length,
  );

  if (elapsed <= 0) return null;

  const opacity = interpolate(elapsed, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        fontFamily: font.mono,
        color: colors.romaji,
        opacity,
        ...style,
      }}
    >
      {text.slice(0, visibleChars)}
    </span>
  );
};
