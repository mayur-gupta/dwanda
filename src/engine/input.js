// Keyboard state. `held` = keys down now, `just` = keys pressed since the last game tick.
import { CONTROLS } from '../config.js';

export const held = new Set();
export const just = new Set();
export const ACTIONS = ['up', 'down', 'left', 'right', 'punch', 'kick', 'special'];

export function blankInput() {
  const o = {};
  for (const a of ACTIONS) { o[a] = false; o[a + 'P'] = false; }
  return o;
}

function keyIn(list, set) { for (const k of list) if (set.has(k)) return true; return false; }

// Returns { up, down, ..., punchP, kickP, ... } where the P fields are fresh presses.
export function readPlayer(id, merged) {
  const out = blankInput();
  const sets = merged ? [CONTROLS.p1, CONTROLS.p2] : [CONTROLS[id]];
  for (const c of sets) for (const a of ACTIONS) {
    if (keyIn(c[a], held)) out[a] = true;
    if (keyIn(c[a], just)) out[a + 'P'] = true;
  }
  return out;
}

// Menu navigation: code -> [action, player]. Player -1 means either.
export const MENU_KEYS = {
  KeyW: ['up', 0], KeyS: ['down', 0], KeyA: ['left', 0], KeyD: ['right', 0],
  ArrowUp: ['up', 1], ArrowDown: ['down', 1], ArrowLeft: ['left', 1], ArrowRight: ['right', 1],
  Enter: ['confirm', 0], Space: ['confirm', 0], KeyF: ['confirm', 0],
  NumpadEnter: ['confirm', 1], Numpad1: ['confirm', 1], Comma: ['confirm', 1],
  KeyG: ['back', 0], Numpad2: ['back', 1], Period: ['back', 1],
  Escape: ['back', -1], Backspace: ['back', -1],
};

// Keys whose browser default (scrolling, button activation) should be suppressed.
export const BLOCK_DEFAULT = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter', 'NumpadEnter', 'Slash', 'Quote', 'Backquote', 'Backspace']);
