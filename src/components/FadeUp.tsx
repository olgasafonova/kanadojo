import { useCurrentFrame } from "remotion";
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

  const t = Math.max(0, frame - delay);
  const duration = 20; // frames
  const progress = Math.min(t / duration, 1);
  // ease-out cubic — smooth deceleration, no bounce
  const eased = 1 - Math.pow(1 - progress, 3);

  const opacity = Math.min(eased * 1.5, 1);
  const y = (1 - eased) * translateY * 0.4;

  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>
      {children}
    </div>
  );
};
