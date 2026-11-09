import { defineCharacter } from './defaults.js';

// Laughter (हास्य). Rasa colour in the Natyashastra: white (sita).
export default defineCharacter({
  id: 'hasya',
  name: 'HASYA',
  english: 'Laughter',
  devanagari: 'हास्य',
  tagline: 'Laughter · the joke that is never on you',
  colors: { rim: '#fff1cf', accent: '#ffd23d' },
  alt: { rim: '#ff9fd0', accent: '#fff1cf' },
  look: { hair: 'tuft', headband: false, sash: true },
  body: { scale: 0.9, bulk: 0.84 },
  stats: { power: 4, speed: 9, defense: 4 },
  moves: {
    punch: { damage: 36, startup: 3, recovery: 7 },
    special: { label: 'Giggle burst', projectile: 'confetti', speed: 10, damage: 80 },
  },
});
