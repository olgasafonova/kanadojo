import {
  useCurrentFrame,
  interpolate,
  spring as remotionSpring,
  useVideoConfig,
} from "remotion";
import { springConfig } from "../styles/tokens";
import type { CSSProperties, ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  translateY?: number;
  style?: CSSProperties;
}

export const FadeUp: React.FC<FadeUpProps> = ({
  children,
  delay = 0,
  translateY = 30,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = remotionSpring({
    frame: frame - delay,
    fps,
    config: {
      stiffness: springConfig.stiffness,
      damping: springConfig.damping,
    },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [translateY, 0]);

  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>
      {children}
    </div>
  );
};
