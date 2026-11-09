// Screen registry and navigation. Each screen module adds itself to `screens`.
// A screen can define: init(), enter(arg, prev), exit(next), key(code, action, player, repeat), update(), render(ctx).
import { $, $$ } from '../engine/utils.js';
import { G, S } from '../state.js';

export const screens = {};

const NO_CORNER = ['select', 'vs', 'fight', 'pause', 'map', 'story'];

export function go(name, arg) {
  const prev = S.current;
  if (prev && screens[prev].exit) screens[prev].exit(name);
  S.current = name;
  for (const el of $$('.screen')) {
    el.classList.toggle('active', el.id === 'scr-' + name || (name === 'pause' && el.id === 'scr-fight'));
  }
  $('#stage').classList.toggle('no-corner', NO_CORNER.includes(name));
  if (screens[name].enter) screens[name].enter(arg, prev);
}

export function startSelect(mode) { G.mode = mode; go('select'); }
