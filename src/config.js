// Game-wide settings. Tweak these to change match rules, controls or CPU behaviour.

export const GAME = {
  title: 'DWANDVA',
  native: 'द्वंद्व',
  tagline: 'Two fighters. One arena. Best of three rounds.',
  build: '0.2',
};

export const VIEW_W = 1280;
export const VIEW_H = 720;

export const ROSTER_SIZE = 8;     // slots on the select screen
export const ROUNDS_TO_WIN = 2;   // best of 3
export const ROUND_TIME = 99;     // seconds per round
export const GRAVITY = 0.85;
export const STAGE_LEFT = 70;
export const STAGE_RIGHT = 1210;

export const CPU_LEVELS = [
  { name: 'EASY',   react: 24, block: 0.15, aggro: 0.35, special: 0.15 },
  { name: 'NORMAL', react: 14, block: 0.40, aggro: 0.55, special: 0.30 },
  { name: 'HARD',   react: 7,  block: 0.70, aggro: 0.75, special: 0.45 },
];

// KeyboardEvent.code values. Each action can have several keys.
export const CONTROLS = {
  p1: { up: ['KeyW'], down: ['KeyS'], left: ['KeyA'], right: ['KeyD'], punch: ['KeyF'], kick: ['KeyG'], special: ['KeyH'] },
  p2: { up: ['ArrowUp'], down: ['ArrowDown'], left: ['ArrowLeft'], right: ['ArrowRight'], punch: ['Numpad1', 'Comma'], kick: ['Numpad2', 'Period'], special: ['Numpad3', 'Slash'] },
};
