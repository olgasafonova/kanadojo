const CORRECT_REACTIONS = [
  { kaomoji: "(＾▽＾)", text: "よし！" },
  { kaomoji: "＼(＾o＾)／", text: "すごい！" },
  { kaomoji: "(ノ´ヮ`)ノ*:・゚✧", text: "やった！" },
  { kaomoji: "(*≧▽≦)", text: "いいね！" },
] as const;

export function pickReaction() {
  return CORRECT_REACTIONS[
    Math.floor(Math.random() * CORRECT_REACTIONS.length)
  ];
}
