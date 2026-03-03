let currentAudio: HTMLAudioElement | null = null;

function play(path: string): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  const audio = new Audio(path);
  currentAudio = audio;
  audio.play().catch(() => {
    // Silently fail if autoplay is blocked
  });
}

export function speakChar(_char: string, romaji?: string): void {
  if (romaji) {
    play(`${import.meta.env.BASE_URL}audio/char-${romaji}.mp3`);
  }
}

export function speakWord(
  romaji: string,
  type?: "hiragana" | "katakana",
): void {
  const prefix = type === "katakana" ? "k-" : "";
  play(`${import.meta.env.BASE_URL}audio/word-${prefix}${romaji}.mp3`);
}
