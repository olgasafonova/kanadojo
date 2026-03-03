let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

/**
 * Short ascending two-note chime. No audio files needed.
 * Plays a quick "do-mi" with soft sine waves.
 */
export function playCorrectChime(): void {
  try {
    const audio = getCtx();
    const now = audio.currentTime;

    const notes = [523.25, 659.25]; // C5, E5
    const durations = [0.1, 0.18];

    let offset = 0;
    for (let i = 0; i < notes.length; i++) {
      const osc = audio.createOscillator();
      const gain = audio.createGain();

      osc.type = "sine";
      osc.frequency.value = notes[i];

      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.18, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + offset + durations[i],
      );

      osc.connect(gain);
      gain.connect(audio.destination);

      osc.start(now + offset);
      osc.stop(now + offset + durations[i]);

      offset += durations[i] * 0.7; // slight overlap
    }
  } catch {
    // Silently fail if Web Audio isn't available
  }
}
