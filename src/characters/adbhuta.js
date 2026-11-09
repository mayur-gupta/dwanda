import { defineCharacter } from './defaults.js';

// Wonder (अद्भुत). Rasa colour in the Natyashastra: yellow (pita).
export default defineCharacter({
  id: 'adbhuta',
  name: 'ADBHUTA',
  english: 'Wonder',
  devanagari: 'अद्भुत',
  tagline: 'Wonder · the question that keeps asking',
  colors: { rim: '#ffd60a', accent: '#7fd4ff' },
  alt: { rim: '#b6ff5a', accent: '#ffd60a' },
  look: { hair: 'long', headband: false, sash: true, aura: 'light' },
  body: { scale: 0.96, bulk: 0.92 },
  stats: { power: 5, speed: 6, defense: 5 },
  moves: {
    special: { label: 'Starfall', projectile: 'star', speed: 9, damage: 95 },
  },
});
