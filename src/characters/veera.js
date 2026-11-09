import { defineCharacter } from './defaults.js';

// Courage (वीर). Rasa colour in the Natyashastra: golden (gaura).
export default defineCharacter({
  id: 'veera',
  name: 'VEERA',
  english: 'Courage',
  devanagari: 'वीर',
  tagline: 'Courage · fear that keeps walking',
  colors: { rim: '#ffb84d', accent: '#fff1c2' },
  alt: { rim: '#ffe14d', accent: '#ff7a3c' },
  look: { hair: 'topknot', headband: true, sash: true },
  body: { scale: 1.06, bulk: 1.12 },
  stats: { power: 7, speed: 6, defense: 7 },
  moves: {
    special: { label: 'Vijaya spear', projectile: 'spear', speed: 12, damage: 105 },
  },
});
