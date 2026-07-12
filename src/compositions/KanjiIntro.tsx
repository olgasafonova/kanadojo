import { useState } from "react";
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
import type { KanjiChar } from "../data/types";

interface KanjiIntroProps {
  kanji: KanjiChar;
}

export const KanjiIntro: React.FC<KanjiIntroProps> = ({ kanji }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [imageOk, setImageOk] = useState(true);

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

  // Meaning fade
  const meaningOpacity = interpolate(frame, [10, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const meaningY = interpolate(frame, [10, 18], [12, 0], {
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
          flex: "0 0 300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "28px 26px",
          gap: 14,
        }}
      >
        {/* Character */}
        <div style={{ position: "relative" }}>
          <InkSplatter
            triggerFrame={6}
            count={28}
            seed={kanji.char.charCodeAt(0)}
            color="rgba(232, 184, 48, 0.6)"
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 130,
              height: 130,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${colors.accentDecor}40, transparent 70%)`,
              opacity: glowOpacity,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              fontSize: 100,
              fontFamily: font.japanese,
              fontWeight: font.weightBold,
              color: colors.character,
              lineHeight: 1,
              transform: `scale(${charScale}) rotate(${charRotate}deg)`,
              opacity: charOpacity,
              textShadow: `0 2px 24px rgba(232,184,48,${glowOpacity * 0.5})`,
            }}
          >
            {kanji.char}
          </div>
        </div>

        {/* Meaning — the headline for a kanji */}
        <div
          style={{
            fontSize: 26,
            fontFamily: font.mono,
            fontWeight: font.weightBold,
            color: colors.accent,
            letterSpacing: 0.5,
            opacity: meaningOpacity,
            transform: `translateY(${meaningY}px)`,
            textTransform: "lowercase",
          }}
        >
          {kanji.meaning}
        </div>

        {/* Readings */}
        <FadeUp delay={14}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {kanji.kunyomi.length > 0 && (
              <div
                style={{
                  fontFamily: font.japanese,
                  fontSize: 14,
                  color: colors.character,
                }}
              >
                <span style={{ color: colors.romaji, fontFamily: font.mono }}>
                  kun{"  "}
                </span>
                {kanji.kunyomi.join("、")}
              </div>
            )}
            {kanji.onyomi.length > 0 && (
              <div
                style={{
                  fontFamily: font.japanese,
                  fontSize: 14,
                  color: colors.character,
                }}
              >
                <span style={{ color: colors.romaji, fontFamily: font.mono }}>
                  on{"   "}
                </span>
                {kanji.onyomi.join("、")}
              </div>
            )}
          </div>
        </FadeUp>

        {/* Component breakdown */}
        <FadeUp delay={18}>
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 12,
              color: colors.accentDecor,
              lineHeight: 1.5,
            }}
          >
            {kanji.components}
          </div>
        </FadeUp>

        {/* Mnemonic text */}
        <FadeUp delay={22}>
          <div
            style={{
              fontFamily: font.japanese,
              fontSize: 13.5,
              color: colors.character,
              lineHeight: 1.55,
              opacity: 0.85,
              textAlign: "left",
            }}
          >
            {kanji.mnemonic}
          </div>
        </FadeUp>

        {/* Example word */}
        <FadeUp delay={30}>
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
                fontSize: 19,
                color: colors.character,
                whiteSpace: "nowrap",
              }}
            >
              {kanji.exampleWord}
              <span
                style={{
                  fontFamily: font.mono,
                  fontSize: 12,
                  color: colors.romaji,
                  marginLeft: 8,
                }}
              >
                {kanji.exampleReading}
              </span>
            </span>
            <span
              style={{
                fontFamily: font.mono,
                fontSize: 12,
                color: colors.romaji,
              }}
            >
              {kanji.exampleMeaning}
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
        {kanji.mnemonicImage && imageOk ? (
          <InkBrush delay={6}>
            <img
              src={`${import.meta.env.BASE_URL}${kanji.mnemonicImage}`}
              alt={`Mnemonic for ${kanji.char} (${kanji.meaning})`}
              onError={() => setImageOk(false)}
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
        ) : (
          // Fallback while the mnemonic art is being generated: an oversized,
          // faint rendering of the kanji itself so the card still reads as intentional.
          <div
            style={{
              width: "100%",
              height: "100%",
              maxWidth: 420,
              maxHeight: 420,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              borderRadius: 14,
              border: "1px dashed rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 220,
                fontFamily: font.japanese,
                fontWeight: font.weightBold,
                color: "rgba(245,240,232,0.10)",
                lineHeight: 1,
              }}
            >
              {kanji.char}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
