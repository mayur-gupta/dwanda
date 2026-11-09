import { defineCharacter } from './defaults.js';

// Peace (शान्त). Rasa colour in the Natyashastra: moon-white.
export default defineCharacter({
  id: 'shanta',
  name: 'SHANTA',
  english: 'Peace',
  devanagari: 'शान्त',
  tagline: 'Peace · nothing left to win',
  colors: { rim: '#dfeaff', accent: '#bfe3ff' },
  alt: { rim: '#ffe9c2', accent: '#ffd8a8' },
  look: { hair: 'bald', headband: false, sash: true, aura: 'light' },
  body: { scale: 1.0, bulk: 1.0 },
  stats: { power: 4, speed: 5, defense: 9 },
  moves: {
    special: { label: 'Still lotus', projectile: 'lotus', speed: 6, damage: 90 },
  },
});
