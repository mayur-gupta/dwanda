import { defineCharacter } from './defaults.js';

// Disgust (बीभत्स). Rasa colour in the Natyashastra: blue (nila).
export default defineCharacter({
  id: 'bibhatsa',
  name: 'BIBHATSA',
  english: 'Disgust',
  devanagari: 'बीभत्स',
  tagline: 'Disgust · the face you look away from',
  colors: { rim: '#2f6bff', accent: '#9adf3a' },
  alt: { rim: '#8a5cff', accent: '#c6f04a' },
  look: { hair: 'bald', headband: false, sash: true },
  body: { scale: 1.05, bulk: 1.28, stoop: 10 },
  stats: { power: 6, speed: 4, defense: 8 },
  moves: {
    special: { label: 'Bile shard', projectile: 'shard', speed: 7, damage: 105 },
  },
});
