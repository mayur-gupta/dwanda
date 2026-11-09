import { defineCharacter } from './defaults.js';

// Fear (भयानक). Rasa colour in the Natyashastra: black (krishna).
export default defineCharacter({
  id: 'bhayanaka',
  name: 'BHAYANAKA',
  english: 'Fear',
  devanagari: 'भयानक',
  tagline: 'Fear · every sound you cannot name',
  colors: { rim: '#6a4fc2', accent: '#d8d2ff', ink: '#07050c', inkBack: '#1a1426' },
  alt: { rim: '#3fa0a0', accent: '#d8fff6' },
  look: { hair: 'horns', headband: false, sash: false, aura: 'dark', eyes: '#e6ecff' },
  body: { scale: 1.12, bulk: 0.88 },
  stats: { power: 6, speed: 7, defense: 4 },
  moves: {
    special: { label: 'Night terror', projectile: 'smoke', speed: 7, damage: 95 },
  },
});
