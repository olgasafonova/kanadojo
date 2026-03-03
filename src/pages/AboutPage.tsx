import { colors, font } from "../styles/tokens";

export const AboutPage: React.FC = () => (
  <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 16px" }}>
    {/* Hero */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 56,
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}logo-enso-k.png`}
        alt="KanaDojo logo — the letter K inside a Zen ensō circle"
        style={{ width: 160, height: 160, borderRadius: 20 }}
      />
      <h1
        style={{
          fontFamily: font.mono,
          fontSize: 36,
          fontWeight: 700,
          marginTop: 20,
          color: colors.character,
        }}
      >
        Kana<span style={{ color: colors.accentDecor }}>Dojo</span>
      </h1>
      <p
        style={{
          fontFamily: font.mono,
          fontSize: 16,
          color: colors.romaji,
          marginTop: 8,
          letterSpacing: 1.5,
          textTransform: "uppercase",
        }}
      >
        The path of learning kana, one stroke at a time
      </p>
    </div>

    {/* Sections */}
    <Section title="What is this">
      A free, browser-based trainer for the 92 hiragana and katakana characters.
      Animated flashcards, spaced repetition, visual mnemonics. No accounts, no
      server. Everything stays in your browser.
    </Section>

    <Section title="Why">
      {" "}
      <a href="https://www.duolingo.com/" style={linkStyle}>
        Duolingo
      </a>{" "}
      teaches you Japanese in careful, gamified sips and has its own kana
      drills, but no mnemonics. You stare at ケ and ク, get them wrong, stare
      again. KanaDojo takes a different approach: visual associations, animated
      memory hooks, spaced repetition tuned to the exact moment you're about to
      forget. Closer to a musician drilling scales than a student re-reading
      flashcards. A belt system instead of a streak counter, because mastery is
      not the same thing as attendance.
    </Section>

    <Section title="How it works">
      <strong style={{ color: colors.character }}>Learn</strong> walks through
      characters one group at a time with animated mnemonics and pronunciation.{" "}
      <strong style={{ color: colors.character }}>Quiz</strong> tests recall
      using the SM-2 spaced repetition algorithm, surfacing characters right at
      the edge of forgetting.{" "}
      <strong style={{ color: colors.character }}>Progress</strong> shows your
      mastery grid and belt rank, from white (0 chars) to black (121+). The grid
      is honest. Grey squares don't lie.
    </Section>

    <Section title="Built with">
      React, Remotion for animations, Web Speech API for pronunciation, SM-2 for
      scheduling, localStorage for persistence. The whole thing runs
      client-side. No telemetry, no analytics, no cookie banners.
    </Section>

    <Section title="Made by">
      Built by{" "}
      <a href="https://github.com/olgasafonova" style={linkStyle}>
        Olga Safonova
      </a>{" "}
      in 2026, as a companion to Duolingo's Japanese course. Somewhere around
      lesson 40, you realize the app expects you to read kana faster than you
      actually can. This is the remedy.
      <br />
      <br />
      <a href="https://substack.com/@olgasafonova" style={linkStyle}>
        Substack
      </a>
      {" · "}
      <a href="https://www.linkedin.com/in/olgasafonova/" style={linkStyle}>
        LinkedIn
      </a>
      {" · "}
      <a href="https://github.com/olgasafonova" style={linkStyle}>
        GitHub
      </a>
    </Section>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section style={{ marginBottom: 40 }}>
    <h2
      style={{
        fontFamily: font.mono,
        fontSize: 16,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 2,
        color: colors.accent,
        marginBottom: 12,
      }}
    >
      {title}
    </h2>
    <p
      style={{
        fontFamily: font.japanese,
        fontSize: 18,
        color: colors.romaji,
        lineHeight: 1.7,
      }}
    >
      {children}
    </p>
  </section>
);

const linkStyle: React.CSSProperties = {
  color: colors.accent,
  textDecoration: "none",
  borderBottom: `1px solid ${colors.accent}`,
};
