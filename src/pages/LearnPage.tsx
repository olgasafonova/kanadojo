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
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      {/* Group selector */}
      <div
        className="learn-controls"
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
            aria-pressed={i === groupIdx}
            style={{
              padding: "6px 0",
              borderRadius: 0,
              border: "none",
              borderBottom:
                i === groupIdx
                  ? `2px solid ${colors.accent}`
                  : "2px solid transparent",
              background: "none",
              color: i === groupIdx ? colors.accent : colors.romaji,
              fontFamily: font.mono,
              fontSize: 15,
              fontWeight: i === groupIdx ? 700 : 400,
              cursor: "pointer",
              letterSpacing: 0.5,
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
        }}
      >
        <Player
          key={`${kanaMode}-${currentChar.char}`}
          component={KanaIntro}
          inputProps={{ kana: currentChar }}
          compositionWidth={920}
          compositionHeight={480}
          durationInFrames={timing.introFrames}
          fps={timing.fps}
          autoPlay
          loop={false}
          moveToBeginningWhenEnded={false}
          style={{
            width: "100%",
            aspectRatio: "920 / 480",
          }}
        />
      </div>

      {/* Controls */}
      <div
        className="learn-controls"
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
          aria-label="Previous character"
          style={navBtn}
          disabled={groupIdx === 0 && charIdx === 0}
        >
          ← Prev
        </button>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => speakChar(currentChar.char, currentChar.romaji)}
            style={actionBtn}
            aria-label={`Hear character ${currentChar.romaji}`}
          >
            🔊 {currentChar.char}
          </button>
          <button
            onClick={() => speakWord(currentChar.romaji, kanaMode)}
            style={actionBtn}
            aria-label={`Hear example word ${currentChar.exampleWord}`}
          >
            🔊 {currentChar.exampleWord}
          </button>
        </div>

        <span
          style={{
            fontFamily: font.mono,
            fontSize: 16,
            color: colors.romaji,
          }}
        >
          {charIdx + 1} / {groupChars.length}
        </span>

        <button
          onClick={goNext}
          aria-label="Next character"
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
  minHeight: 44,
  borderRadius: 0,
  border: "none",
  borderBottom: `2px solid ${colors.romaji}`,
  background: "none",
  color: colors.romaji,
  fontFamily: font.mono,
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  letterSpacing: 1,
  textTransform: "uppercase",
};

const actionBtn: React.CSSProperties = {
  padding: "10px 18px",
  minHeight: 44,
  borderRadius: 0,
  border: "none",
  borderBottom: `2px solid ${colors.accent}`,
  background: "none",
  color: colors.accent,
  fontFamily: font.japanese,
  fontSize: 17,
  cursor: "pointer",
};
