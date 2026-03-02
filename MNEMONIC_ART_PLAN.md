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
| Vowels | あ い う え お | 1/5 done (あ) |
| K-row | か き く け こ | 1/5 done (か) |
| S-row | さ し す せ そ | 1/5 done (さ) |
| T-row | た ち つ て と | not started |
| N-row | な に ぬ ね の | not started |
| H-row | は ひ ふ へ ほ | not started |
| M-row | ま み む め も | not started |
| Y-row | や ゆ よ | not started |
| R-row | ら り る れ ろ | not started |
| W + N | わ を ん | not started |

### Katakana (46 total)
All not started. Same row structure as hiragana.

## Mnemonic concepts (hiragana)

Each image should embed the character shape into the illustration:

### Vowels
- **あ (a)** — antenna on a rooftop [DONE]
- **い (i)** — two people bowing to each other
- **う (u)** — a bird looking up at the sky
- **え (e)** — an energetic dancer with arms out
- **お (o)** — a person carrying a heavy load on their back

### K-row
- **か (ka)** — katana slicing through bamboo [DONE]
- **き (ki)** — a key with two teeth
- **く (ku)** — a beak of a cuckoo bird
- **け (ke)** — a keg with a tap
- **こ (ko)** — two coins stacked

### S-row
- **さ (sa)** — a saw blade cutting wood [DONE]
- **し (shi)** — a fishing hook in water
- **す (su)** — a bird on a swing
- **せ (se)** — a person saying something
- **そ (so)** — a zigzag sewing stitch

### T-row
- **た (ta)** — a rice paddy with crossed stalks
- **ち (chi)** — a cheerful face winking (number 5)
- **つ (tsu)** — a tsunami wave
- **て (te)** — a hand reaching out (te = hand)
- **と (to)** — a tornado touching ground

### N-row
- **な (na)** — a knot being tied
- **に (ni)** — two knees side by side
- **ぬ (nu)** — noodles tangled on chopsticks
- **ね (ne)** — a cat (neko) curled up
- **の (no)** — a "no entry" sign swirl

### H-row
- **は (ha)** — a house with a chimney
- **ひ (hi)** — a person laughing "hee hee"
- **ふ (fu)** — Mount Fuji with snow cap
- **へ (he)** — a simple hill
- **ほ (ho)** — a horse galloping

### M-row
- **ま (ma)** — a mama with a baby on her back
- **み (mi)** — a cat (looking at "me" in a mirror)
- **む (mu)** — a cow mooing
- **め (me)** — an eye (me = eye in Japanese)
- **も (mo)** — a fishing hook catching more fish

### Y-row
- **や (ya)** — a yak with curved horns
- **ゆ (yu)** — a steaming hot bath (yu = hot water)
- **よ (yo)** — a person doing yoga

### R-row
- **ら (ra)** — a rabbit running
- **り (ri)** — two reeds by a river
- **る (ru)** — a kangaroo (ru-shaped tail)
- **れ (re)** — a person reaching forward
- **ろ (ro)** — a winding road

### W + N
- **わ (wa)** — a swan on water
- **を (wo)** — a person carrying a heavy load (wo = object particle)
- **ん (n)** — a person nodding "nn"

## Next session
1. Generate remaining vowels: い う え お (4 images, 2-3 variations each)
2. Generate K-row remainder: き く け こ (4 images)
3. Generate S-row remainder: し す せ そ (4 images)
4. Continue row by row until all 46 hiragana are done
5. Then start katakana
