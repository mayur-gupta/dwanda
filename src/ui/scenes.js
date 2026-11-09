// Canvas backdrops for the menu screens.
import { VIEW_W, VIEW_H } from '../config.js';
import { CHARACTERS, palFor, byId } from '../characters/index.js';
import { nayanAt } from '../characters/nayan.js';
import { STAGES, drawStage, stageIndex } from '../stages/index.js';
import { S } from '../state.js';
import { TAU, ease, hexA, rng, REDUCED } from '../engine/utils.js';
import { POSES, idlePose } from '../engine/poses.js';
import { ridge } from '../stages/art.js';
import { drawFighter, drawShadow, glowDot } from '../engine/draw.js';

export function drawTitleScene(c, dim) {
  const st = STAGES[stageIndex('ghat')];
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

// ---------- Story mode ----------
const POSE_OF = (name, t) => (name === 'crouch' ? POSES.crouch : name === 'block' ? POSES.block : name === 'win' ? POSES.win
  : name === 'hit' ? POSES.hit : name === 'ko' ? POSES.ko : idlePose(t));

// Draws into an offscreen layer, then onto the scene with transparency (for the huge "ghost" emotion).
let ghostCv = null;
function ghost(c, alpha, fn) {
  const w = Math.round(VIEW_W * S.RS), h = Math.round(VIEW_H * S.RS);
  if (!ghostCv || ghostCv.width !== w || ghostCv.height !== h) { ghostCv = document.createElement('canvas'); ghostCv.width = w; ghostCv.height = h; }
  const g = ghostCv.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); g.setTransform(S.RS, 0, 0, S.RS, 0, 0);
  fn(g);
  c.save(); c.globalAlpha = alpha; c.drawImage(ghostCv, 0, 0, VIEW_W, VIEW_H); c.restore();
}

export function drawStoryScene(c, ch, panel, t) {
  const st = STAGES[stageIndex(ch.stage)], gy = st.ground, T = S.T;
  const hero = nayanAt(ch.age), emo = byId(ch.emotion);
  const type = panel.type;
  const who = panel.who || ({ duel: 'both', mastered: 'both', lose: 'both', title: 'ghost', end: 'finale' }[type] || 'none');
  const z = 1 + Math.min(1, t / 900) * 0.06;   // slow push-in
  c.save(); c.translate(640, 420); c.scale(z, z); c.translate(-640, -420);
  drawStage(c, st, T);
  const fig = (who2, pal, pose, x, f, scale, ph, y = gy) => {
    drawShadow(c, x, y, scale * who2.body.scale, 0);
    drawFighter(c, who2, pal, pose, x, y, f, { scale, t: T, phase: ph });
  };
  const hp = POSE_OF(panel.pose || (type === 'lose' ? 'crouch' : type === 'mastered' ? 'win' : 'idle'), T);
  const ep = POSE_OF(panel.epose || (type === 'lose' ? 'win' : 'idle'), T + 40);
  if (who === 'nayan') fig(hero, hero.colors, hp, panel.x || 560, 1, 1.3, 0);
  else if (who === 'emotion') fig(emo, emo.colors, ep, 700, -1, 1.6, 2);
  else if (who === 'both') { fig(emo, emo.colors, ep, 820, -1, 1.35, 2); fig(hero, hero.colors, hp, 470, 1, 1.3, 0); }
  else if (who === 'ghost') {
    ghost(c, 0.38, (g) => drawFighter(g, emo, emo.colors, idlePose(T), 920, gy + 300, -1, { scale: 3.1, t: T }));
    fig(hero, hero.colors, idlePose(T), 330, 1, 1.15, 0);
  } else if (who === 'finale') {
    // Every rasa in an arc behind young Nayan.
    const emos = CHARACTERS.filter((x) => x.id !== 'nayan');
    const order = emos.map((e, i) => i).sort((a, b) => Math.abs(a - 4) - Math.abs(b - 4));
    for (const i of order) {
      const e = emos[i], x = 120 + i * 130, y = gy - 22 + Math.abs(i - 4) * 5;
      fig(e, e.colors, idlePose(T + i * 23), x, x < 640 ? 1 : -1, 0.86, i);
    }
    const kid = nayanAt(6);
    fig(kid, kid.colors, POSES.win, 640, 1, 1.3, 0, gy + 8);
  }
  if (st.fg) st.fg(c, T);
  c.restore();
  const v = c.createRadialGradient(640, 380, 260, 640, 380, 820);
  v.addColorStop(0, 'rgba(6,4,12,0)'); v.addColorStop(1, 'rgba(6,4,12,0.75)');
  c.fillStyle = v; c.fillRect(0, 0, VIEW_W, VIEW_H);
  const dim = { quote: 0.66, title: 0.5, end: 0.48 }[type];
  if (dim) { c.fillStyle = `rgba(8,6,14,${dim})`; c.fillRect(0, 0, VIEW_W, VIEW_H); }
}

// Nayan's life as a path from dawn (childhood) to night (old age).
export function drawMap(c, t, nodes, sel, done, chapters) {
  const g = c.createLinearGradient(0, 0, VIEW_W, 0);
  g.addColorStop(0, '#4a2f4f'); g.addColorStop(0.32, '#2c4a6b'); g.addColorStop(0.68, '#5e2c43'); g.addColorStop(1, '#0d0a1c');
  c.fillStyle = g; c.fillRect(0, 0, VIEW_W, VIEW_H);
  glowDot(c, 130, 360, 200, '#ffd08a', 0.35);
  glowDot(c, 1160, 170, 130, '#dfe9ff', 0.28);
  const rs = rng(211);
  for (let i = 0; i < 70; i++) { const x = 760 + rs() * 520, y = rs() * 420; c.fillStyle = `rgba(230,236,255,${(x - 760) / 520 * 0.7 * rs()})`; c.fillRect(x, y, 1.5, 1.5); }
  const v = c.createLinearGradient(0, 0, 0, VIEW_H);
  v.addColorStop(0, 'rgba(8,6,14,0.55)'); v.addColorStop(0.45, 'rgba(8,6,14,0.08)'); v.addColorStop(1, 'rgba(8,6,14,0.55)');
  c.fillStyle = v; c.fillRect(0, 0, VIEW_W, VIEW_H);
  c.fillStyle = 'rgba(14,10,24,0.85)'; ridge(c, 684, 46, rng(201));
  // the path, solid where lived, dashed where still ahead
  for (let i = 0; i < nodes.length - 1; i++) {
    const p0 = nodes[Math.max(0, i - 1)], p1 = nodes[i], p2 = nodes[i + 1], p3 = nodes[Math.min(nodes.length - 1, i + 2)];
    c.beginPath(); c.moveTo(p1[0], p1[1]);
    c.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
    if (done[i]) { c.setLineDash([]); c.strokeStyle = '#ffc23d'; c.lineWidth = 4; }
    else { c.setLineDash([6, 8]); c.strokeStyle = 'rgba(246,236,220,0.3)'; c.lineWidth = 3; }
    c.stroke();
  }
  c.setLineDash([]);
  nodes.forEach(([x, y], i) => glowDot(c, x, y, i === sel ? 64 : 44, byId(chapters[i].emotion).colors.rim, done[i] ? 0.5 : i === sel ? 0.4 : 0.18));
  const ch = chapters[sel], hero = nayanAt(ch.age), [x, y] = nodes[sel];
  drawFighter(c, hero, hero.colors, idlePose(t), x, y - 32, 1, { scale: 0.75, t });
}
