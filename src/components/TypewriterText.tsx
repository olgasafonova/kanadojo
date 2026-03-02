import { useCurrentFrame } from "remotion";
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
  charsPerFrame = 0.75,
  style,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const visibleChars = Math.min(
    Math.floor(elapsed * charsPerFrame),
    text.length,
  );
  const isComplete = visibleChars >= text.length;
  const isActive = elapsed > 0 && !isComplete;

  if (elapsed <= 0) return null;

  return (
    <span
      style={{
        fontFamily: font.mono,
        color: colors.romaji,
        ...style,
      }}
    >
      {text.slice(0, visibleChars)}
      {isActive && <span style={{ opacity: 0.7 }}>|</span>}
    </span>
  );
};
