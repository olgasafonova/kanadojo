# KanaDojo

The path of learning kana, one stroke at a time.

A free, browser-based trainer for the 92 hiragana and katakana characters, plus the core JLPT N5 kanji. Animated flashcards, spaced repetition, visual mnemonics. No accounts, no server.

**[Try it live](https://olgasafonova.github.io/kanadojo/)**

## Features

- **Learn** — walk through characters one group at a time with animated mnemonics and audio pronunciation
- **Quiz** — test recall using SM-2 spaced repetition, surfacing characters right at the edge of forgetting. Kana quizzes ask for the reading; kanji quizzes ask for the meaning
- **Progress** — mastery grid and belt rank from white (0 chars) to black (121+)
- **Kanji** — the core N5 kanji, grouped by theme, each taught with a meaning-first radical mnemonic (休 = a person resting against a tree)
- **Mnemonics** — every character has a visual memory hook generated with AI

## Built with

React, Remotion (animations), Web Speech API (pronunciation), SM-2 (spaced repetition), localStorage (persistence). The whole thing runs client-side.

## Development

```bash
npm install
npm run dev
```

Builds to `dist/` with `npm run build`. Deployed to GitHub Pages on push to `main`.

## License

MIT
