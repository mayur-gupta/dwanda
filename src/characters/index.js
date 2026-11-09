// The roster, in story order. To add a fighter:
//   1. Copy one of these files (e.g. raudra.js) to a new file and edit it.
//   2. Import it below and add it to the CHARACTERS array.
// The select screen, previews, HUD, VS splash and results all read from this list.
import nayan from './nayan.js';
import bhayanaka from './bhayanaka.js';
import hasya from './hasya.js';
import adbhuta from './adbhuta.js';
import raudra from './raudra.js';
import bibhatsa from './bibhatsa.js';
import shringara from './shringara.js';
import veera from './veera.js';
import karuna from './karuna.js';
import shanta from './shanta.js';

export const CHARACTERS = [nayan, bhayanaka, hasya, adbhuta, raudra, bibhatsa, shringara, veera, karuna, shanta];

export const byId = (id) => CHARACTERS.find((c) => c.id === id);

// Colours for a side. Player 2 gets the alternate palette in a mirror match.
export function palFor(side, picks) {
  const ch = CHARACTERS[picks[side]];
  if (!ch) return { rim: '#5a4d6b', accent: '#5a4d6b' };
  return side === 1 && picks[0] === picks[1]
    ? { rim: ch.alt.rim, accent: ch.alt.accent }
    : { rim: ch.colors.rim, accent: ch.colors.accent };
}
