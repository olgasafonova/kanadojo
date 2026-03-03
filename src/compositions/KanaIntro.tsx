import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  spring as remotionSpring,
} from "remotion";
import { FadeUp } from "../components/FadeUp";
import { InkBrush } from "../components/InkBrush";
import { InkSplatter } from "../components/InkSplatter";
import { colors, font } from "../styles/tokens";
import type { KanaChar } from "../data/types";

interface KanaIntroProps {
  kana: KanaChar;
}

export const KanaIntro: React.FC<KanaIntroProps> = ({ kana }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Character entrance
  const charProgress = remotionSpring({
    frame,
    fps,
    config: { stiffness: 100, damping: 14 },
  });
  const charScale = interpolate(charProgress, [0, 1], [0.3, 1]);
  const charOpacity = interpolate(charProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const charRotate = interpolate(charProgress, [0, 1], [-8, 0]);

  // Glow pulse
  const glowOpacity = interpolate(frame, [12, 20, 35], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Romaji fade
  const romajiOpacity = interpolate(frame, [10, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const romajiY = interpolate(frame, [10, 18], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: colors.bgCard,
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* Left column: character + text info */}
      <div
        style={{
          flex: "0 0 240px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "32px 28px",
          gap: 20,
        }}
      >
        {/* Character */}
        <div style={{ position: "relative" }}>
          <InkSplatter
            triggerFrame={6}
            count={28}
            seed={kana.char.charCodeAt(0)}
            color="rgba(232, 184, 48, 0.6)"
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${colors.accentDecor}40, transparent 70%)`,
              opacity: glowOpacity,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              fontSize: 110,
              fontFamily: font.japanese,
              fontWeight: font.weightBold,
              color: colors.character,
              lineHeight: 1,
              transform: `scale(${charScale}) rotate(${charRotate}deg)`,
              opacity: charOpacity,
              textShadow: `0 2px 24px rgba(232,184,48,${glowOpacity * 0.5})`,
            }}
          >
            {kana.char}
          </div>
        </div>

        {/* Romaji */}
        <div
          style={{
            fontSize: 24,
            fontFamily: font.mono,
            color: colors.romaji,
            letterSpacing: 3,
            opacity: romajiOpacity,
            transform: `translateY(${romajiY}px)`,
          }}
        >
          {kana.romaji}
        </div>

        {/* Mnemonic text */}
        <FadeUp delay={18}>
          <div
            style={{
              fontFamily: font.japanese,
              fontSize: 14,
              color: colors.character,
              lineHeight: 1.6,
              opacity: 0.85,
              textAlign: "left",
            }}
          >
            {kana.mnemonic}
          </div>
        </FadeUp>

        {/* Example word */}
        <FadeUp delay={28}>
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: 8,
              padding: "8px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <span
              style={{
                fontFamily: font.japanese,
                fontSize: 20,
                color: colors.character,
                whiteSpace: "nowrap",
              }}
            >
              {kana.exampleWord}
            </span>
            <span
              style={{
                fontFamily: font.mono,
                fontSize: 12,
                color: colors.romaji,
              }}
            >
              {kana.exampleMeaning}
            </span>
          </div>
        </FadeUp>
      </div>

      {/* Right column: mnemonic image — the hero */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        {kana.mnemonicImage && (
          <InkBrush delay={6}>
            <img
              src={kana.mnemonicImage}
              alt={`Mnemonic for ${kana.char}`}
              style={{
                width: "100%",
                height: "100%",
                maxWidth: 420,
                maxHeight: 420,
                objectFit: "contain",
                borderRadius: 14,
              }}
            />
          </InkBrush>
        )}
      </div>
    </AbsoluteFill>
  );
};
