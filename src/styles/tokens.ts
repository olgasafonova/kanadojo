export const colors = {
  bg: "#0f0a1e",
  bgCard: "#1e1450",
  accent: "#e8b830", // gold — text accents
  accentDecor: "#e07060", // warm coral — decorative only
  character: "#f5f0e8", // washi paper white
  romaji: "#b8b0c8",
  correct: "#e8b830",
  wrong: "#e07060",
  belt: {
    white: "#f5f0e8",
    yellow: "#d4a017",
    green: "#2d8659",
    blue: "#2563eb",
    brown: "#8b4513",
    black: "#1a1a1a",
  },
  mastered: "#2d8659",
  learning: "#e8b830",
  notStarted: "#3a3560",
} as const;

export const font = {
  japanese: "'Noto Sans JP', sans-serif",
  mono: "'JetBrains Mono', monospace",
  weightBold: 700,
  weightRegular: 400,
} as const;

export const springConfig = {
  stiffness: 120,
  damping: 20,
} as const;

export const timing = {
  fps: 30,
  introFrames: 90, // 3s per character intro
  quizFlashFrames: 45, // 1.5s flash
  feedbackFrames: 30, // 1s feedback
} as const;
