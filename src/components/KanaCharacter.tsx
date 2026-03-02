import {
  useCurrentFrame,
  interpolate,
  spring as remotionSpring,
  useVideoConfig,
} from "remotion";
import { springConfig, colors, font } from "../styles/tokens";
import type { CSSProperties } from "react";

interface KanaCharacterProps {
  char: string;
  romaji: string;
  delay?: number;
  size?: number;
  style?: CSSProperties;
}

export const KanaCharacter: React.FC<KanaCharacterProps> = ({
  char,
  romaji,
  delay = 0,
  size = 160,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = remotionSpring({
    frame: frame - delay,
    fps,
    config: {
      stiffness: springConfig.stiffness,
      damping: springConfig.damping,
    },
  });

  const opacity = interpolate(scale, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        opacity,
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      <div
        style={{
          fontSize: size,
          fontFamily: font.japanese,
          fontWeight: font.weightBold,
          color: colors.character,
          lineHeight: 1,
        }}
      >
        {char}
      </div>
      <div
        style={{
          fontSize: size * 0.18,
          fontFamily: font.mono,
          color: colors.romaji,
          letterSpacing: 2,
        }}
      >
        {romaji}
      </div>
    </div>
  );
};
