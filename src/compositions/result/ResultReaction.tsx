import { interpolate } from "remotion";
import { InkBrush } from "../../components/InkBrush";
import { InkSplatter } from "../../components/InkSplatter";
import { colors, font } from "../../styles/tokens";
import type { KanaChar } from "../../data/types";

interface ResultReactionProps {
  kana: KanaChar;
  correct: boolean;
  entry: number;
  reaction: { kaomoji: string; text: string };
}

export const ResultReaction: React.FC<ResultReactionProps> = ({
  kana,
  correct,
  entry,
  reaction,
}) => {
  return (
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
            seed={kana.char.charCodeAt(0) + 99}
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
      ) : (
        kana.mnemonicImage && (
          <InkBrush delay={8}>
            <img
              src={`${import.meta.env.BASE_URL}${kana.mnemonicImage}`}
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
        )
      )}
    </div>
  );
};
