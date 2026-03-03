import {
  useCurrentFrame,
  interpolate,
  spring as remotionSpring,
  useVideoConfig,
} from "remotion";
import type { CSSProperties, ReactNode } from "react";

interface InkBrushProps {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
}

/**
 * Reveals children with an ink-brush wipe effect.
 * Uses a clip-path that sweeps from left to right,
 * combined with a slight scale and opacity for organic feel.
 */
export const InkBrush: React.FC<InkBrushProps> = ({
  children,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = remotionSpring({
    frame: frame - delay,
    fps,
    config: {
      stiffness: 80,
      damping: 18,
    },
  });

  // Clip from left to right with a soft leading edge
  const clipRight = interpolate(progress, [0, 1], [0, 100]);

  // Slight overshoot scale for brush energy
  const scale = interpolate(progress, [0, 0.5, 1], [0.9, 1.02, 1]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        clipPath: `inset(0 ${100 - clipRight}% 0 0)`,
        transform: `scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
