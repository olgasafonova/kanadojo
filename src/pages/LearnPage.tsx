import { KunOnHelp } from "../components/KunOnHelp";
import { colors, font } from "../styles/tokens";
import { catalogForMode } from "./learn/catalog";
import { useLearnNavigation } from "./learn/navigation";
import { GroupSelector } from "./learn/GroupSelector";
import { IntroPlayer } from "./learn/IntroPlayer";
import { SpeakButtons } from "./learn/SpeakButtons";
import type { Mode } from "../data/types";

interface Props {
  mode: Mode;
}

export const LearnPage: React.FC<Props> = ({ mode }) => {
  // Mode changes remount the page via key={mode} in App, so no reset effect.
  const { chars, groups } = catalogForMode(mode);
  const nav = useLearnNavigation(chars, groups);
  const { groupIdx, charIdx, groupChars, currentChar } = nav;

  if (!currentChar) return null;

  const atStart = groupIdx === 0 && charIdx === 0;
  const atEnd =
    groupIdx === groups.length - 1 && charIdx === groupChars.length - 1;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      <GroupSelector
        groups={groups}
        groupIdx={groupIdx}
        onSelect={nav.selectGroup}
      />

      <IntroPlayer mode={mode} currentChar={currentChar} />

      {/* Controls */}
      <div
        className="learn-controls"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
          gap: 16,
        }}
      >
        <button
          onClick={nav.goPrev}
          aria-label="Previous character"
          style={navBtn}
          disabled={atStart}
        >
          ← Prev
        </button>

        <SpeakButtons mode={mode} currentChar={currentChar} />

        <span
          style={{
            fontFamily: font.mono,
            fontSize: 16,
            color: colors.romaji,
          }}
        >
          {charIdx + 1} / {groupChars.length}
        </span>

        <button
          onClick={nav.goNext}
          aria-label="Next character"
          style={navBtn}
          disabled={atEnd}
        >
          Next →
        </button>
      </div>

      {mode === "kanji" && <KunOnHelp />}
    </div>
  );
};

const navBtn: React.CSSProperties = {
  padding: "10px 20px",
  minHeight: 44,
  borderRadius: 0,
  border: "none",
  borderBottom: `2px solid ${colors.romaji}`,
  background: "none",
  color: colors.romaji,
  fontFamily: font.mono,
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  letterSpacing: 1,
  textTransform: "uppercase",
};
