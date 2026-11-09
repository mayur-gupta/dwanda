// The roster. To add a fighter:
//   1. Copy proto-a.js to a new file (e.g. arjun.js) and edit it.
//   2. Import it below and add it to the CHARACTERS array.
// The select screen, previews, HUD, VS splash and results all read from this list.
import protoA from './proto-a.js';
import protoB from './proto-b.js';

export const CHARACTERS = [protoA, protoB];

// Colours for a side. Player 2 gets the alternate palette in a mirror match.
export function palFor(side, picks) {
  const ch = CHARACTERS[picks[side]];
  if (!ch) return { rim: '#5a4d6b', accent: '#5a4d6b' };
  return side === 1 && picks[0] === picks[1]
    ? { rim: ch.alt.rim, accent: ch.alt.accent }
    : { rim: ch.colors.rim, accent: ch.colors.accent };
}
