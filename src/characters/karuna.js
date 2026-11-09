import { defineCharacter } from './defaults.js';

// Sorrow (करुण). Rasa colour in the Natyashastra: dove grey (kapota).
export default defineCharacter({
  id: 'karuna',
  name: 'KARUNA',
  english: 'Sorrow',
  devanagari: 'करुण',
  tagline: 'Sorrow · grief that becomes compassion',
  colors: { rim: '#a9b6c8', accent: '#7fb6ff' },
  alt: { rim: '#c8a9c4', accent: '#a9d8ff' },
  look: { hair: 'long', headband: false, sash: true },
  body: { scale: 0.97, bulk: 0.94, stoop: 8 },
  stats: { power: 5, speed: 4, defense: 7 },
  moves: {
    special: { label: 'Falling tear', projectile: 'tear', speed: 8, damage: 95 },
  },
});
