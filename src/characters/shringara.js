import { defineCharacter } from './defaults.js';

// Love (शृंगार). Rasa colour in the Natyashastra: dark blue-green (shyama).
export default defineCharacter({
  id: 'shringara',
  name: 'SHRINGARA',
  english: 'Love',
  devanagari: 'शृंगार',
  tagline: 'Love · everything, given freely',
  colors: { rim: '#16b39a', accent: '#ff6fae' },
  alt: { rim: '#3b7bff', accent: '#ffb3d6' },
  look: { hair: 'long', headband: false, sash: true },
  body: { scale: 0.98, bulk: 0.85 },
  stats: { power: 5, speed: 7, defense: 5 },
  moves: {
    special: { label: 'Petal storm', projectile: 'petal', speed: 9, damage: 90 },
  },
});
