import { useState, useCallback, useEffect } from "react";
import { Player } from "@remotion/player";
import { hiragana, hiraganaGroups } from "../data/hiragana";
import { katakana, katakanaGroups } from "../data/katakana";
import { KanaIntro } from "../compositions/KanaIntro";
import { colors, font, timing } from "../styles/tokens";
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

  // Reset when switching kana mode
  useEffect(() => {
    setGroupIdx(0);
    setCharIdx(0);
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

      {/* Remotion Player card */}
      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          border: `1px solid rgba(255,255,255,0.08)`,
        }}
      >
        <Player
          key={`${kanaMode}-${currentChar.char}`}
          component={KanaIntro}
          inputProps={{ kana: currentChar }}
          compositionWidth={760}
          compositionHeight={360}
          durationInFrames={timing.introFrames}
          fps={timing.fps}
          autoPlay
          loop={false}
          style={{
            width: "100%",
            aspectRatio: "760 / 360",
          }}
        />
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
