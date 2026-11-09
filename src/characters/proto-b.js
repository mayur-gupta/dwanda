import { defineCharacter } from './defaults.js';

// Placeholder fighter. Faster and lighter than PROTO A.
export default defineCharacter({
  id: 'proto-b',
  name: 'PROTO B',
  tagline: 'Placeholder fighter · quick, lighter hits',
  placeholder: true,
  colors: { rim: '#19c3b3', accent: '#ff5fa8' },
  alt: { rim: '#9d8cff', accent: '#4fe0d0' },
  look: { hair: 'ponytail', headband: true, sash: true },
  body: { scale: 0.96, bulk: 0.9 },
  stats: { power: 4, speed: 8, defense: 4 },
  moves: {
    punch: { damage: 38, startup: 3, recovery: 7 },
    kick: { damage: 62, startup: 6, recovery: 12 },
    special: { label: 'Spin ring', projectile: 'ring', speed: 11, damage: 85 },
  },
});
