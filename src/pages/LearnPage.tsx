import { useState, useCallback, useEffect } from "react";
import { hiragana, hiraganaGroups } from "../data/hiragana";
import { katakana, katakanaGroups } from "../data/katakana";
import { colors, font } from "../styles/tokens";
import { speakChar, speakWord } from "../utils/speech";
import type { KanaChar, KanaMode } from "../data/types";

interface Props {
  kanaMode: KanaMode;
}

export const LearnPage: React.FC<Props> = ({ kanaMode }) => {
  const chars = kanaMode === "hiragana" ? hiragana : katakana;
  const groups = kanaMode === "hiragana" ? hiraganaGroups : katakanaGroups;

  const [groupIdx, setGroupIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  // Reset when switching kana mode
  useEffect(() => {
    setGroupIdx(0);
    setCharIdx(0);
    setAnimKey((k) => k + 1);
  }, [kanaMode]);

  const group = groups[groupIdx];
  const groupChars = chars.filter((k) => k.group === group.id);
  const currentChar: KanaChar | undefined = groupChars[charIdx];

  const goNext = useCallback(() => {
    if (charIdx < groupChars.length - 1) {
      setCharIdx((i) => i + 1);
    } else if (groupIdx < groups.length - 1) {
      setGroupIdx((g) => g + 1);
      setCharIdx(0);
    }
    setAnimKey((k) => k + 1);
  }, [charIdx, groupChars.length, groupIdx, groups.length]);

  const goPrev = useCallback(() => {
    if (charIdx > 0) {
      setCharIdx((i) => i - 1);
    } else if (groupIdx > 0) {
      setGroupIdx((g) => g - 1);
      const prevGroup = groups[groupIdx - 1];
      const prevChars = chars.filter((k) => k.group === prevGroup.id);
      setCharIdx(prevChars.length - 1);
    }
    setAnimKey((k) => k + 1);
  }, [charIdx, groupIdx, chars, groups]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  if (!currentChar) return null;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
      {/* Group selector */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        {groups.map((g, i) => (
          <button
            key={g.id}
            onClick={() => {
              setGroupIdx(i);
              setCharIdx(0);
              setAnimKey((k) => k + 1);
            }}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid",
              borderColor:
                i === groupIdx ? colors.accent : "rgba(255,255,255,0.1)",
              background:
                i === groupIdx ? "rgba(232,184,48,0.15)" : "transparent",
              color: i === groupIdx ? colors.accent : colors.romaji,
              fontFamily: font.mono,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Card */}
      <div
        key={animKey}
        style={{
          background: colors.bgCard,
          borderRadius: 16,
          border: `1px solid rgba(255,255,255,0.08)`,
          padding: 40,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 48,
          minHeight: 360,
          animation: "fadeIn 0.4s ease-out",
        }}
      >
        {/* Left: character */}
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            animation: "scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontFamily: font.japanese,
              fontWeight: 700,
              color: colors.character,
              lineHeight: 1,
            }}
          >
            {currentChar.char}
          </div>
          <div
            style={{
              fontSize: 22,
              fontFamily: font.mono,
              color: colors.romaji,
              letterSpacing: 2,
            }}
          >
            {currentChar.romaji}
          </div>
        </div>

        {/* Right: mnemonic + example */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxWidth: 400,
          }}
        >
          {currentChar.mnemonicImage && (
            <div style={{ animation: "slideUp 0.5s ease-out 0.1s both" }}>
              <img
                src={currentChar.mnemonicImage}
                alt={`Mnemonic for ${currentChar.char}`}
                style={{
                  width: 180,
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: `1px solid rgba(255,255,255,0.1)`,
                }}
              />
            </div>
          )}

          <div style={{ animation: "slideUp 0.5s ease-out 0.2s both" }}>
            <div
              style={{
                fontFamily: font.japanese,
                fontSize: 16,
                color: colors.character,
                lineHeight: 1.6,
              }}
            >
              {currentChar.mnemonic}
            </div>
          </div>

          <div style={{ animation: "slideUp 0.5s ease-out 0.3s both" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "10px 16px",
                display: "flex",
                gap: 12,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: font.japanese,
                  fontSize: 22,
                  color: colors.character,
                }}
              >
                {currentChar.exampleWord}
              </span>
              <span
                style={{
                  fontFamily: font.mono,
                  fontSize: 14,
                  color: colors.romaji,
                }}
              >
                ({currentChar.exampleMeaning})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
          gap: 16,
        }}
      >
        <button
          onClick={goPrev}
          style={navBtn}
          disabled={groupIdx === 0 && charIdx === 0}
        >
          ← Prev
        </button>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => speakChar(currentChar.char, currentChar.romaji)}
            style={actionBtn}
            title="Hear character"
          >
            🔊 {currentChar.char}
          </button>
          <button
            onClick={() => speakWord(currentChar.romaji, kanaMode)}
            style={actionBtn}
            title="Hear example word"
          >
            🔊 {currentChar.exampleWord}
          </button>
        </div>

        <span
          style={{
            fontFamily: font.mono,
            fontSize: 13,
            color: colors.romaji,
          }}
        >
          {charIdx + 1} / {groupChars.length}
        </span>

        <button
          onClick={goNext}
          style={navBtn}
          disabled={
            groupIdx === groups.length - 1 && charIdx === groupChars.length - 1
          }
        >
          Next →
        </button>
      </div>
    </div>
  );
};

const navBtn: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: 8,
  border: `1px solid rgba(255,255,255,0.15)`,
  background: "rgba(255,255,255,0.05)",
  color: colors.character,
  fontFamily: font.mono,
  fontSize: 14,
  cursor: "pointer",
};

const actionBtn: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 8,
  border: `1px solid ${colors.accent}`,
  background: "rgba(232,184,48,0.1)",
  color: colors.accent,
  fontFamily: font.japanese,
  fontSize: 15,
  cursor: "pointer",
};
