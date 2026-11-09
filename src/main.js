// Entry point: fonts, styles, input wiring, scaling and the game loop.
import '@fontsource/teko/400.css';
import '@fontsource/teko/500.css';
import '@fontsource/teko/600.css';
import '@fontsource/rozha-one/400.css';
import '@fontsource/rajdhani/500.css';
import '@fontsource/rajdhani/600.css';
import '@fontsource/rajdhani/700.css';
import './styles.css';

import { VIEW_W, VIEW_H } from './config.js';
import { G, S } from './state.js';
import { $, clamp } from './engine/utils.js';
import { ensureAudio, applyMute } from './engine/audio.js';
import { held, just, MENU_KEYS, BLOCK_DEFAULT } from './engine/input.js';
import { newMatch } from './engine/match.js';
import { HUD } from './ui/hud.js';
import { screens, go, startSelect } from './ui/router.js';
import './ui/screens/title.js';
import './ui/screens/controls.js';
import './ui/screens/select.js';
import './ui/screens/stage-select.js';
import './ui/screens/vs.js';
import './ui/screens/fight.js';
import './ui/screens/pause.js';
import './ui/screens/results.js';
import './ui/screens/map.js';
import './ui/screens/story.js';
import { progress } from './story/progress.js';

const stageEl = $('#stage');
const canvas = $('#game');
const ctx = canvas.getContext('2d');

function setMuted(m) {
  G.muted = m;
  applyMute();
  const b = $('#btn-mute');
  b.textContent = m ? 'Sound off' : 'Sound on';
  b.setAttribute('aria-pressed', String(m));
}

// ---------- Input ----------
addEventListener('keydown', (e) => {
  if (BLOCK_DEFAULT.has(e.code)) e.preventDefault();
  ensureAudio();
  if (!e.repeat) { held.add(e.code); just.add(e.code); }
  if (e.code === 'KeyM' && !e.repeat) { setMuted(!G.muted); return; }
  if (e.code === 'Backquote' && !e.repeat) { G.hitboxes = !G.hitboxes; return; }
  const m = MENU_KEYS[e.code], scr = screens[S.current];
  if (scr && scr.key) scr.key(e.code, m ? m[0] : null, m ? m[1] : -1, e.repeat);
});
addEventListener('keyup', (e) => held.delete(e.code));
addEventListener('blur', () => { held.clear(); if (S.current === 'fight') go('pause'); });
document.addEventListener('visibilitychange', () => { if (document.hidden && S.current === 'fight') go('pause'); });
addEventListener('pointerdown', ensureAudio);

$('#btn-mute').addEventListener('click', (e) => { e.currentTarget.blur(); ensureAudio(); setMuted(!G.muted); });
$('#btn-full').addEventListener('click', async (e) => {
  e.currentTarget.blur();
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch (err) { /* fullscreen not allowed here */ }
});

// ---------- Scaling: fixed 1280×720 stage, fitted to the window ----------
function fit() {
  const s = Math.min(innerWidth / VIEW_W, innerHeight / VIEW_H);
  stageEl.style.transform = `translate(${(innerWidth - VIEW_W * s) / 2}px, ${(innerHeight - VIEW_H * s) / 2}px) scale(${s})`;
  const rs = clamp(s * (window.devicePixelRatio || 1), 1, 2);
  if (Math.abs(rs - S.RS) > 0.01) {
    S.RS = rs;
    canvas.width = Math.round(VIEW_W * S.RS);
    canvas.height = Math.round(VIEW_H * S.RS);
  }
}
addEventListener('resize', fit);

// ---------- Game loop: fixed 60 updates per second, render every frame ----------
const STEP = 1 / 60;
let last = 0, acc = 0;
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  const scr = screens[S.current];
  const slow = S.current === 'fight' && S.match && S.match.slowmo > 0;
  acc += dt * (slow ? 0.35 : 1);
  let n = 0;
  while (acc >= STEP && n < 6) {
    acc -= STEP; n++; S.T++;
    if (scr.update) scr.update();
    just.clear();
    if (screens[S.current] !== scr) break;
  }
  if (n >= 6) acc = 0;
  ctx.setTransform(S.RS, 0, 0, S.RS, 0, 0);
  const now2 = screens[S.current];
  if (now2.render) now2.render(ctx);
  requestAnimationFrame(frame);
}

// ---------- Boot ----------
fit();
HUD.init();
for (const k in screens) if (screens[k].init) screens[k].init();
setMuted(false);
go('title');
requestAnimationFrame((t) => { last = t; frame(t); });

// Debug handle in development builds (npm run dev): window.dwandva.G, .S, .go('fight'), ...
if (import.meta.env.DEV) window.dwandva = { G, S, go, startSelect, newMatch, progress };
