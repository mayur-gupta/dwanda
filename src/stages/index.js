// Arena list, in story order. Each arena exports { id, name, sub, ground, paint(c), dyn?(c, t), fg?(c, t) }:
//   paint = static background (cached), dyn = animated layer behind fighters, fg = layer in front.
import aangan from './aangan.js';
import mela from './mela.js';
import ramgiri from './ramgiri.js';
import akhada from './akhada.js';
import rooftop from './rooftop.js';
import garden from './garden.js';
import kurukshetra from './kurukshetra.js';
import ghat from './ghat.js';
import pond from './pond.js';
import { S } from '../state.js';
import { VIEW_W, VIEW_H } from '../config.js';

export const STAGES = [aangan, mela, ramgiri, akhada, rooftop, garden, kurukshetra, ghat, pond];

export const stageIndex = (id) => Math.max(0, STAGES.findIndex((s) => s.id === id));

const cache = new Map();
export function stageCache(st) {
  const hit = cache.get(st.id);
  if (hit && hit.rs === S.RS) return hit.canvas;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(VIEW_W * S.RS); canvas.height = Math.round(VIEW_H * S.RS);
  const c = canvas.getContext('2d'); c.scale(S.RS, S.RS); st.paint(c);
  cache.set(st.id, { canvas, rs: S.RS });
  return canvas;
}

export function drawStage(c, st, t, withFg = false) {
  c.drawImage(stageCache(st), 0, 0, VIEW_W, VIEW_H);
  if (st.dyn) st.dyn(c, t);
  if (withFg && st.fg) st.fg(c, t);
}
