import { useState, useCallback, useEffect } from "react";
import type { LearnChar, LearnGroup } from "./catalog";

/** Arrow-key / space navigation between characters. */
export function useKeyboardNav(goNext: () => void, goPrev: () => void): void {
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
}

export interface LearnNavigation {
  groupIdx: number;
  charIdx: number;
  groupChars: LearnChar[];
  currentChar: LearnChar | undefined;
  selectGroup: (i: number) => void;
  goNext: () => void;
  goPrev: () => void;
}

/** Position within groups/characters plus the movement callbacks. */
export function useLearnNavigation(
  chars: LearnChar[],
  groups: LearnGroup[],
): LearnNavigation {
  const [groupIdx, setGroupIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  const groupChars = chars.filter((k) => k.group === groups[groupIdx].id);
  const currentChar = groupChars[charIdx];

  const selectGroup = useCallback((i: number) => {
    setGroupIdx(i);
    setCharIdx(0);
  }, []);

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
      const prevGroup = groups[groupIdx - 1];
      const prevChars = chars.filter((k) => k.group === prevGroup.id);
      setGroupIdx((g) => g - 1);
      setCharIdx(prevChars.length - 1);
    }
  }, [charIdx, groupIdx, chars, groups]);

  useKeyboardNav(goNext, goPrev);

  return {
    groupIdx,
    charIdx,
    groupChars,
    currentChar,
    selectGroup,
    goNext,
    goPrev,
  };
}
