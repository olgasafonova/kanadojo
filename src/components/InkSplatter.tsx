import { useCurrentFrame, interpolate } from "remotion";

interface Particle {
  angle: number;
  distance: number;
  size: number;
  delay: number;
  drift: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateParticles(count: number, seed: number): Particle[] {
  const rng = seededRandom(seed);
  return Array.from({ length: count }, () => ({
    angle: rng() * Math.PI * 2,
    distance: 60 + rng() * 140,
    size: 3 + rng() * 8,
    delay: rng() * 4,
    drift: (rng() - 0.5) * 30,
  }));
}

interface InkSplatterProps {
  /** Frame at which the burst triggers */
  triggerFrame?: number;
  /** Number of particles */
  count?: number;
  /** Seed for deterministic randomness */
  seed?: number;
  /** Single color or array of colors to pick from per-particle */
  color?: string | string[];
}

export const InkSplatter: React.FC<InkSplatterProps> = ({
  triggerFrame = 8,
  count = 24,
  seed = 42,
  color = "rgba(20, 15, 10, 0.7)",
}) => {
  const colorArray = Array.isArray(color) ? color : [color];
  const frame = useCurrentFrame();
  const particles = generateParticles(count, seed);

  const elapsed = frame - triggerFrame;
  if (elapsed < 0) return null;

  return (
    <>
      {particles.map((p, i) => {
        const start = p.delay;
        const life = 18;
        const t = elapsed - start;
        if (t < 0 || t > life) return null;

        const progress = t / life;

        // Burst out fast, decelerate
        const dist = interpolate(
          progress,
          [0, 0.3, 1],
          [0, p.distance * 0.8, p.distance],
          {
            extrapolateRight: "clamp",
          },
        );

        // Fade out
        const opacity = interpolate(
          progress,
          [0, 0.1, 0.6, 1],
          [0, 0.9, 0.5, 0],
          {
            extrapolateRight: "clamp",
          },
        );

        // Slight gravity drift downward
        const gravityY = progress * progress * 20;
        const driftX = p.drift * progress;

        const x = Math.cos(p.angle) * dist + driftX;
        const y = Math.sin(p.angle) * dist + gravityY;

        // Particles shrink as they fly
        const size = p.size * interpolate(progress, [0, 1], [1, 0.3]);

        // Some particles are elongated (like ink splashes)
        const scaleX = 1 + Math.abs(Math.cos(p.angle)) * 0.6;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: size,
              height: size,
              borderRadius: i % 3 === 0 ? "50%" : "30%",
              background: colorArray[i % colorArray.length],
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scaleX(${scaleX}) rotate(${p.angle}rad)`,
              opacity,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
};
