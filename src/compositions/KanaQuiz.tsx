import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  spring as remotionSpring,
} from "remotion";
import { InkSplatter } from "../components/InkSplatter";
import { colors, font } from "../styles/tokens";

interface KanaQuizProps {
  char: string;
}

/**
 * Quiz flash composition: the character drops in with a dramatic
 * scale + blur entrance, then settles. No timer, no stress.
 */
export const KanaQuiz: React.FC<KanaQuizProps> = ({ char }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Character drop-in spring
  const drop = remotionSpring({
    frame,
    fps,
    config: { stiffness: 140, damping: 12 },
  });

  const scale = interpolate(drop, [0, 1], [2.5, 1]);
  const opacity = interpolate(drop, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const blur = interpolate(drop, [0, 1], [12, 0]);

  // Subtle idle breathing after landing (loopable)
  const breathe = Math.sin((frame - 15) * 0.06) * 0.015 + 1;
  const idleScale = frame > 15 ? breathe : 1;

  return (
    <AbsoluteFill
      style={{
        background: colors.bgCard,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: 16,
      }}
    >
      {/* Ink splatter on landing */}
      <InkSplatter
        triggerFrame={5}
        count={18}
        seed={char.charCodeAt(0)}
        color={[
          "rgba(232,184,48,0.5)",
          "rgba(224,112,96,0.4)",
          "rgba(245,240,232,0.3)",
        ]}
      />

      {/* Character */}
      <div
        style={{
          fontSize: 180,
          fontFamily: font.japanese,
          fontWeight: font.weightBold,
          color: colors.character,
          lineHeight: 1,
          transform: `scale(${scale * idleScale})`,
          opacity,
          filter: `blur(${blur}px)`,
        }}
      >
        {char}
      </div>

      {/* "type romaji" hint, fades in after character lands */}
      <div
        style={{
          marginTop: 20,
          fontFamily: font.mono,
          fontSize: 16,
          color: colors.romaji,
          opacity: interpolate(frame, [20, 30], [0, 0.5], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          letterSpacing: 2,
        }}
      >
        type the romaji
      </div>
    </AbsoluteFill>
  );
};
