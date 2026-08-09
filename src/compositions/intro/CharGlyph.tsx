import {
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  spring as remotionSpring,
} from "remotion";
import { InkSplatter } from "../../components/InkSplatter";
import { colors, font } from "../../styles/tokens";

interface CharGlyphProps {
  char: string;
  fontSize?: number;
  glowSize?: number;
}

/** The animated character with ink splatter and glow pulse. */
export const CharGlyph: React.FC<CharGlyphProps> = ({
  char,
  fontSize = 100,
  glowSize = 130,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = remotionSpring({
    frame,
    fps,
    config: { stiffness: 100, damping: 14 },
  });
  const scale = interpolate(progress, [0, 1], [0.3, 1]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const rotate = interpolate(progress, [0, 1], [-8, 0]);
  const glowOpacity = interpolate(frame, [12, 20, 35], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "relative" }}>
      <InkSplatter
        triggerFrame={6}
        count={28}
        seed={char.charCodeAt(0)}
        color="rgba(232, 184, 48, 0.6)"
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: glowSize,
          height: glowSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accentDecor}40, transparent 70%)`,
          opacity: glowOpacity,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          fontSize,
          fontFamily: font.japanese,
          fontWeight: font.weightBold,
          color: colors.character,
          lineHeight: 1,
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          opacity,
          textShadow: `0 2px 24px rgba(232,184,48,${glowOpacity * 0.5})`,
        }}
      >
        {char}
      </div>
    </div>
  );
};
