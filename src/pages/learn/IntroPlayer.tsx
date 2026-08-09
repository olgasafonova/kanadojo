import { Player } from "@remotion/player";
import { timing } from "../../styles/tokens";
import { KanaIntro } from "../../compositions/KanaIntro";
import { KanjiIntro } from "../../compositions/KanjiIntro";
import type { KanaChar, KanjiChar, Mode } from "../../data/types";
import type { LearnChar } from "./catalog";

const playerDefaults = {
  compositionWidth: 920,
  compositionHeight: 480,
  durationInFrames: timing.introFrames,
  fps: timing.fps,
  autoPlay: true,
  loop: false,
  moveToBeginningWhenEnded: false,
  style: { width: "100%", aspectRatio: "920 / 480" } as React.CSSProperties,
};

interface IntroPlayerProps {
  mode: Mode;
  currentChar: LearnChar;
}

/** The intro composition card for the current character. */
export const IntroPlayer: React.FC<IntroPlayerProps> = ({
  mode,
  currentChar,
}) => (
  <div style={{ borderRadius: 16, overflow: "hidden" }}>
    {mode === "kanji" ? (
      <Player
        key={`kanji-${currentChar.char}`}
        component={KanjiIntro}
        inputProps={{ kanji: currentChar as KanjiChar }}
        {...playerDefaults}
      />
    ) : (
      <Player
        key={`${mode}-${currentChar.char}`}
        component={KanaIntro}
        inputProps={{ kana: currentChar as KanaChar }}
        {...playerDefaults}
      />
    )}
  </div>
);
