import { useState } from "react";
import { interpolate } from "remotion";
import { InkBrush } from "../../components/InkBrush";
import { InkSplatter } from "../../components/InkSplatter";
import { colors, font } from "../../styles/tokens";
import type { KanjiChar } from "../../data/types";

const Celebration: React.FC<{
  kanji: KanjiChar;
  entry: number;
  reaction: { kaomoji: string; text: string };
}> = ({ kanji, entry, reaction }) => (
  <div
    style={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
      transform: `scale(${interpolate(entry, [0, 1], [0.3, 1])})`,
      opacity: interpolate(entry, [0.3, 1], [0, 1], {
        extrapolateLeft: "clamp",
      }),
    }}
  >
    <InkSplatter
      triggerFrame={3}
      count={28}
      seed={kanji.char.charCodeAt(0) + 99}
      color={[
        "rgba(232,184,48,0.5)",
        "rgba(224,112,96,0.35)",
        "rgba(232,184,48,0.25)",
        "rgba(245,240,232,0.2)",
      ]}
    />
    <div
      style={{
        fontSize: 72,
        color: colors.accent,
        fontFamily: font.japanese,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {reaction.kaomoji}
    </div>
    <div
      style={{
        fontSize: 32,
        fontFamily: font.japanese,
        fontWeight: 700,
        color: colors.accent,
        letterSpacing: 4,
      }}
    >
      {reaction.text}
    </div>
  </div>
);

const MnemonicReveal: React.FC<{ kanji: KanjiChar }> = ({ kanji }) => {
  const [imageOk, setImageOk] = useState(true);

  if (!kanji.mnemonicImage || !imageOk) {
    // Fallback while art is pending: show the mnemonic story instead.
    return (
      <div
        style={{
          fontFamily: font.japanese,
          fontSize: 16,
          color: colors.character,
          lineHeight: 1.6,
          opacity: 0.85,
          maxWidth: 340,
          textAlign: "center",
        }}
      >
        {kanji.mnemonic}
      </div>
    );
  }

  return (
    <InkBrush delay={8}>
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
  );
};

interface KanjiReactionProps {
  kanji: KanjiChar;
  correct: boolean;
  entry: number;
  reaction: { kaomoji: string; text: string };
}

/** Right column: kaomoji celebration on a hit, mnemonic art on a miss. */
export const KanjiReaction: React.FC<KanjiReactionProps> = ({
  kanji,
  correct,
  entry,
  reaction,
}) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}
  >
    {correct ? (
      <Celebration kanji={kanji} entry={entry} reaction={reaction} />
    ) : (
      <MnemonicReveal kanji={kanji} />
    )}
  </div>
);
