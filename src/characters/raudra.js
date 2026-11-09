import { defineCharacter } from './defaults.js';

// Anger (रौद्र). Rasa colour in the Natyashastra: red (rakta).
export default defineCharacter({
  id: 'raudra',
  name: 'RAUDRA',
  english: 'Anger',
  devanagari: 'रौद्र',
  tagline: 'Anger · heat that wants somewhere to go',
  colors: { rim: '#ff2e2e', accent: '#ff9a3c' },
  alt: { rim: '#ff7a1a', accent: '#ffe066' },
  look: { hair: 'flame', headband: false, sash: true },
  body: { scale: 1.08, bulk: 1.25 },
  stats: { power: 9, speed: 5, defense: 4 },
  moves: {
    kick: { damage: 82 },
    special: { label: 'Wildfire', projectile: 'flame', speed: 8, damage: 120 },
  },
});
