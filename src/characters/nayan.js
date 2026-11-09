import { defineCharacter } from './defaults.js';

// Nayan ("eyes"): the boy who grows up in Story mode.
const COLORS = { rim: '#40d4ff', accent: '#ffd23d' };
const ALT = { rim: '#ff9f43', accent: '#40d4ff' };
const SPECIAL = { special: { label: 'Inner light', projectile: 'orb' } };

// How Nayan looks and fights at each age of his life.
const AGES = {
  6:  { body: { scale: 0.72, bulk: 0.8 },  look: { hair: 'short', headband: false, sash: true },               stats: { power: 3, speed: 7, defense: 4 } },
  9:  { body: { scale: 0.78, bulk: 0.82 }, look: { hair: 'tuft', headband: false, sash: true },                stats: { power: 4, speed: 7, defense: 4 } },
  12: { body: { scale: 0.84, bulk: 0.86 }, look: { hair: 'short', headband: true, sash: true },                stats: { power: 4, speed: 7, defense: 5 } },
  15: { body: { scale: 0.9, bulk: 0.92 },  look: { hair: 'short', headband: true, sash: true },                stats: { power: 5, speed: 7, defense: 5 } },
  17: { body: { scale: 0.95, bulk: 0.95 }, look: { hair: 'ponytail', headband: true, sash: true },             stats: { power: 5, speed: 7, defense: 5 } },
  21: { body: { scale: 1.0, bulk: 1.0 },   look: { hair: 'short', headband: true, sash: true },                stats: { power: 6, speed: 6, defense: 6 } },
  30: { body: { scale: 1.02, bulk: 1.06 }, look: { hair: 'topknot', headband: true, sash: true },              stats: { power: 6, speed: 6, defense: 6 } },
  50: { body: { scale: 1.0, bulk: 1.12 },  look: { hair: 'short', headband: false, sash: true, beard: true },  stats: { power: 6, speed: 5, defense: 7 } },
  75: { body: { scale: 0.96, bulk: 0.98, stoop: 14 }, look: { hair: 'bald', headband: false, sash: true, beard: true }, stats: { power: 4, speed: 3, defense: 6 } },
};

const cache = {};
export function nayanAt(age) {
  if (!cache[age]) {
    const a = AGES[age] || AGES[30];
    cache[age] = defineCharacter({
      id: `nayan-${age}`, name: 'NAYAN', english: 'The boy', tagline: `Nayan at ${age}`,
      colors: COLORS, alt: ALT, ...a, moves: SPECIAL,
    });
  }
  return cache[age];
}

// The grown-up Nayan, playable in VS and Training.
export default defineCharacter({
  id: 'nayan', name: 'NAYAN', english: 'The boy who grows up', devanagari: 'नयन',
  tagline: 'Hero of Story mode · balanced',
  colors: COLORS, alt: ALT, ...AGES[30], moves: SPECIAL,
});
