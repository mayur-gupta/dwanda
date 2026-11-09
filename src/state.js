// Shared mutable state. Modules import these objects and read/write their fields.
import { CHARACTERS } from './characters/index.js';

// Player choices that persist between screens.
export const G = {
  mode: 'cpu',          // 'cpu' | 'versus' | 'training'
  cpuLevel: 1,          // index into CPU_LEVELS
  stage: 0,             // index into STAGES
  picks: [0, Math.min(1, CHARACTERS.length - 1)],
  muted: false,
  hitboxes: false,
};

// Runtime state.
export const S = {
  current: null,        // active screen name
  match: null,          // current Match instance
  T: 0,                 // global tick counter (60 per second)
  RS: 1,                // canvas render scale (pixel density)
};
