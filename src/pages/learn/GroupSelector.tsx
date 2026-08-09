import { colors, font } from "../../styles/tokens";
import type { LearnGroup } from "./catalog";

interface GroupSelectorProps {
  groups: LearnGroup[];
  groupIdx: number;
  onSelect: (i: number) => void;
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
  groups,
  groupIdx,
  onSelect,
}) => (
  <div
    className="learn-controls"
    style={{
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginBottom: 24,
    }}
  >
    {groups.map((g, i) => {
      const active = i === groupIdx;
      return (
        <button
          key={g.id}
          onClick={() => onSelect(i)}
          aria-pressed={active}
          style={{
            padding: "6px 0",
            borderRadius: 0,
            border: "none",
            borderBottom: active
              ? `2px solid ${colors.accent}`
              : "2px solid transparent",
            background: "none",
            color: active ? colors.accent : colors.romaji,
            fontFamily: font.mono,
            fontSize: 15,
            fontWeight: active ? 700 : 400,
            cursor: "pointer",
            letterSpacing: 0.5,
          }}
        >
          {g.label}
        </button>
      );
    })}
  </div>
);
