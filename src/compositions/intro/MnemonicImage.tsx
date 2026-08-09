import { useState } from "react";
import { InkBrush } from "../../components/InkBrush";
import { font } from "../../styles/tokens";
import type { KanjiChar } from "../../data/types";

/** The mnemonic artwork, with a faint-kanji fallback while art is missing. */
export const MnemonicImage: React.FC<{ kanji: KanjiChar }> = ({ kanji }) => {
  const [imageOk, setImageOk] = useState(true);

  if (!kanji.mnemonicImage || !imageOk) {
    // Fallback while the mnemonic art is being generated: an oversized,
    // faint rendering of the kanji itself so the card still reads as intentional.
    return (
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
    );
  }

  return (
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
  );
};
