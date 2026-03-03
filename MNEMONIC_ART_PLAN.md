# Mnemonic Art Generation Plan

## Style
Sumi-e ink wash watercolor. Each illustration embeds the kana shape into the scene so the character is visually memorable.

## Approach
- Work **by row** (5 characters at a time)
- Generate **2-3 variations per character** via nano-banana (Gemini)
- Show contact sheet per row for picking winners
- Start with **hiragana** (foundation), then **katakana**

## File naming
- Hiragana: `public/mnemonics/h-{romaji}.png`
- Katakana: `public/mnemonics/k-{romaji}.png`

## Progress

### Hiragana (46 total)

| Row | Characters | Status |
|-----|-----------|--------|
| Vowels | あ い う え お | 5/5 DONE |
| K-row | か き く け こ | 5/5 DONE |
| S-row | さ し す せ そ | 5/5 DONE |
| T-row | た ち つ て と | 5/5 DONE |
| N-row | な に ぬ ね の | 5/5 DONE |
| H-row | は ひ ふ へ ほ | 5/5 DONE |
| M-row | ま み む め も | 5/5 DONE |
| Y-row | や ゆ よ | 3/3 DONE |
| R-row | ら り る れ ろ | 5/5 DONE |
| W + N | わ を ん | 3/3 DONE |

### Katakana (46 total)
All not started. Same row structure as hiragana.

## Mnemonic concepts (hiragana)

Each image should embed the character shape into the illustration:

All 46 hiragana mnemonic concepts generated and wired. See `src/data/hiragana.ts` for the full list with `mnemonicImage` paths.

## Next session
1. All 46 hiragana mnemonics COMPLETE (generated + wired into data file)
2. Start katakana mnemonics (46 characters, same row structure)
3. Style reference: `outputs/output_001_203151.png` (the あ image)
