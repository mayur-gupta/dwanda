import { defineCharacter } from './defaults.js';

// Placeholder fighter. Replace or copy this file to add a real character.
export default defineCharacter({
  id: 'proto-a',
  name: 'PROTO A',
  tagline: 'Placeholder fighter · balanced all-rounder',
  placeholder: true,
  colors: { rim: '#ff5a3c', accent: '#ffc23d' },
  alt: { rim: '#f7c948', accent: '#ff5a3c' },
  look: { hair: 'topknot', headband: true, sash: true },
  body: { scale: 1.0, bulk: 1.08 },
  stats: { power: 6, speed: 5, defense: 6 },
  moves: {
    special: { label: 'Fire orb', projectile: 'orb' },
  },
});
