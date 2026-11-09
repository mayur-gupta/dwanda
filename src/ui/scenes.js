// Canvas backdrops for the menu screens.
import { VIEW_W, VIEW_H } from '../config.js';
import { CHARACTERS, palFor } from '../characters/index.js';
import { STAGES, drawStage } from '../stages/index.js';
import { S } from '../state.js';
import { TAU, ease, hexA, REDUCED } from '../engine/utils.js';
import { idlePose } from '../engine/poses.js';
import { drawFighter, drawShadow, glowDot } from '../engine/draw.js';

export function drawTitleScene(c, dim) {
  const st = STAGES[1];
  drawStage(c, st, S.T);
  const bi = Math.min(1, CHARACTERS.length - 1), a = CHARACTERS[0], b = CHARACTERS[bi];
  const pa = palFor(0, [0, bi]), pb = palFor(1, [0, bi]);
  drawShadow(c, 800, st.ground, a.body.scale, 0);
  drawShadow(c, 1050, st.ground, b.body.scale, 0);
  drawFighter(c, a, pa, idlePose(S.T), 800, st.ground, 1, { t: S.T });
  drawFighter(c, b, pb, idlePose(S.T + 40), 1050, st.ground, -1, { t: S.T, phase: 2 });
  if (st.fg) st.fg(c, S.T);
  if (dim) { c.fillStyle = `rgba(9,6,15,${dim})`; c.fillRect(0, 0, VIEW_W, VIEW_H); }
}

// Dark plum backdrop with a dot grid and a slowly turning lotus line motif.
export function drawSelectBackdrop(c, t) {
  const g = c.createRadialGradient(640, 320, 40, 640, 360, 780);
  g.addColorStop(0, '#2a1840'); g.addColorStop(1, '#0b0812');
  c.fillStyle = g; c.fillRect(0, 0, VIEW_W, VIEW_H);
  c.fillStyle = 'rgba(255,194,61,0.10)';
  for (let y = 18, row = 0; y < VIEW_H; y += 36, row++) {
    for (let x = (row % 2) * 18 + 10; x < VIEW_W; x += 36) c.fillRect(x - 1, y - 1, 2, 2);
  }
  c.save(); c.translate(640, 340); c.rotate(t * 0.0015);
  c.strokeStyle = 'rgba(255,194,61,0.07)'; c.lineWidth = 1.5;
  for (let ring = 0; ring < 3; ring++) {
    const R = 150 + ring * 90, n = 8 + ring * 4;
    for (let i = 0; i < n; i++) {
      c.save(); c.rotate(i / n * TAU); c.beginPath();
      c.moveTo(0, -R * 0.35); c.quadraticCurveTo(R * 0.22, -R * 0.7, 0, -R); c.quadraticCurveTo(-R * 0.22, -R * 0.7, 0, -R * 0.35);
      c.stroke(); c.restore();
    }
  }
  c.restore();
}

export function drawVS(c, M, t) {
  c.fillStyle = '#0b0812'; c.fillRect(0, 0, VIEW_W, VIEW_H);
  const e = REDUCED ? 1 : ease(t / 20);
  const sides = [
    { poly: [[0, 0], [700, 0], [580, 720], [0, 720]], dx: -(1 - e) * 720, x: 330, f: 1 },
    { poly: [[700, 0], [1280, 0], [1280, 720], [580, 720]], dx: (1 - e) * 720, x: 960, f: -1 },
  ];
  sides.forEach((s, i) => {
    const pal = M.pals[i], ch = M.chars[i];
    c.save(); c.translate(s.dx, 0);
    c.beginPath(); s.poly.forEach(([x, y], k) => (k ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath();
    c.fillStyle = '#120c1c'; c.fill();
    const g = c.createLinearGradient(i ? 1280 : 0, 0, 640, 720);
    g.addColorStop(0, hexA(pal.rim, 0.7)); g.addColorStop(1, hexA(pal.rim, 0.04));
    c.fillStyle = g; c.fill();
    c.clip();
    c.fillStyle = hexA(pal.rim, 0.16);
    for (let k = 0; k < 16; k++) {
      const yy = (k * 47) % 720, len = 120 + ((k * 71) % 200), xx = (((k * 133) + t * (8 + (k % 4) * 3)) % 900) - 120;
      c.fillRect(i ? 1280 - xx - len : xx, yy, len, 3);
    }
    drawFighter(c, ch, pal, idlePose(t + i * 30), s.x, 800, s.f, { scale: 2.55, t, rim: 4, phase: i * 2 });
    c.restore();
  });
  c.strokeStyle = '#ffc23d'; c.lineWidth = 6;
  c.beginPath(); c.moveTo(700, -10); c.lineTo(580, 730); c.stroke();
}

export function drawResults(c, M, pose, t) {
  drawStage(c, M.stage, S.T);
  c.fillStyle = 'rgba(8,6,14,0.74)'; c.fillRect(0, 0, VIEW_W, VIEW_H);
  const w = M.winner;
  if (w === -1) {
    [0, 1].forEach((i) => {
      const ch = M.chars[i], x = 200 + i * 260;
      drawShadow(c, x, 620, 1.5 * ch.body.scale, 0);
      drawFighter(c, ch, M.pals[i], idlePose(S.T + i * 30), x, 620, i ? -1 : 1, { scale: 1.5, t: S.T, phase: i * 2 });
    });
  } else {
    const ch = M.chars[w], pal = M.pals[w];
    glowDot(c, 330, 380, 330, pal.rim, 0.2);
    c.save(); c.translate(330, 640); c.scale(1, 0.22); glowDot(c, 0, 0, 300, pal.rim, 0.55); c.restore();
    drawShadow(c, 330, 640, 2.1 * ch.body.scale, 0);
    drawFighter(c, ch, pal, pose, 330, 640, 1, { scale: 2.1, t: S.T, rim: 4.5 });
  }
  for (let i = 0; i < 26; i++) {
    const x = ((i * 149) % 620) + 20, y = 720 - ((t * (0.6 + (i % 5) * 0.25) + i * 67) % 760);
    c.fillStyle = hexA('#ffc23d', 0.2 + (i % 3) * 0.15); c.fillRect(x, y, 3, 3);
  }
}
