// Fighter, shadow, portrait and projectile drawing.
import { TAU, DEG, clamp, hexA } from './utils.js';
import { POSES, solvePose, stoop } from './poses.js';
import { S } from '../state.js';

// Procedural silhouette with a coloured rim light.
// o: { scale, pt (pre-solved points), t (anim time), flash, rim (outline width), phase, noAura }
export function drawFighter(c, ch, pal, pose, x, y, f, o = {}) {
  const sc = (o.scale || 1) * ch.body.scale, bulk = ch.body.bulk;
  const p = o.pt || solvePose(stoop(pose, ch), f);
  const t = o.t != null ? o.t : S.T;
  const rim = o.flash ? '#fff7e6' : pal.rim, acc = pal.accent, ink = ch.colors.ink, inkB = ch.colors.inkBack;
  const E = o.rim != null ? o.rim : 5;
  const look = ch.look;
  const w = { ua: 12.5 * bulk, fa: 11 * bulk, th: 17 * bulk, sh: 14 * bulk, ft: 9 * bulk, hand: 7.5 * bulk };
  c.save();
  c.translate(x, y);
  if (pose.rot) { c.translate(0, -15 * sc * Math.min(1, Math.abs(pose.rot) / 90)); c.rotate(-pose.rot * f * DEG); }
  c.scale(sc, sc);
  c.translate(0, -p.low);
  c.lineCap = 'round'; c.lineJoin = 'round';

  const L = (a, b, wd) => { c.lineWidth = wd; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); };
  const PL = (pts, wd) => { c.lineWidth = wd; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke(); };
  const D = (q, r) => { c.beginPath(); c.arc(q[0], q[1], r, 0, TAU); c.fill(); };
  const POLY = (pts) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); };
  const tdx = p.sho[0] - p.hip[0], tdy = p.sho[1] - p.hip[1], tlen = Math.hypot(tdx, tdy) || 1, nx = -tdy / tlen, ny = tdx / tlen;
  const torso = () => {
    const sw = 17 * bulk, hw = 12 * bulk;
    c.beginPath();
    c.moveTo(p.hip[0] + nx * hw, p.hip[1] + ny * hw); c.lineTo(p.sho[0] + nx * sw, p.sho[1] + ny * sw);
    c.lineTo(p.sho[0] - nx * sw, p.sho[1] - ny * sw); c.lineTo(p.hip[0] - nx * hw, p.hip[1] - ny * hw);
    c.closePath();
  };

  // Accessory geometry, relative to the head.
  const hd = p.head, HR = 17, ph = o.phase || 0;
  const wv = Math.sin(t * 0.17 + ph), wv2 = Math.sin(t * 0.17 + 1.3 + ph);
  const bandBack = [hd[0] - f * 13, hd[1] - 7];
  const tailA = [bandBack, [hd[0] - f * 24, hd[1] - 9 + wv * 3], [hd[0] - f * 36, hd[1] - 6 + wv2 * 6]];
  const tailB = [bandBack, [hd[0] - f * 22, hd[1] - 1 + wv2 * 3], [hd[0] - f * 31, hd[1] + 6 + wv * 6]];
  const pony = [[hd[0] - f * 12, hd[1] - 8], [hd[0] - f * 24, hd[1] + 2 + wv * 2], [hd[0] - f * 27, hd[1] + 22 + wv2 * 4]];
  const longHair = [[hd[0] - f * 6, hd[1] - 14], [hd[0] - f * 19, hd[1] + 2 + wv * 2], [hd[0] - f * 23 + wv2 * 2, hd[1] + 28], [hd[0] - f * 19 + wv * 3, hd[1] + 50]];
  const knot = [hd[0] - f * 4, hd[1] - HR - 4];
  const tuft = [[hd[0] + f * 1, hd[1] - 15], [hd[0] + f * 8, hd[1] - 28], [hd[0] - f * 2, hd[1] - 31]];
  const flames = [-1, 0, 1].map((k) => {
    const fl = Math.sin(t * 0.4 + k * 2) * 4;
    return [[hd[0] + k * 8 - f * 2, hd[1] - 11], [hd[0] + k * 11 - f * 8, hd[1] - (k === 0 ? 42 : 31) + fl]];
  });
  // Curved, pointed horns sweeping outward: [base, control, tip, base half-width].
  const horns = [
    [[hd[0] + f * 6, hd[1] - 13], [hd[0] + f * 22, hd[1] - 18], [hd[0] + f * 20, hd[1] - 36], 5],
    [[hd[0] - f * 7, hd[1] - 14], [hd[0] - f * 24, hd[1] - 14], [hd[0] - f * 30, hd[1] - 30], 5.5],
  ];
  const horn = ([b, k, tip, hw], e) => {
    const dx = k[0] - b[0], dy = k[1] - b[1], len = Math.hypot(dx, dy) || 1, ux = -dy / len * (hw + e / 2), uy = dx / len * (hw + e / 2);
    c.beginPath(); c.moveTo(b[0] + ux, b[1] + uy); c.quadraticCurveTo(k[0] + ux * 0.4, k[1] + uy * 0.4, tip[0], tip[1]);
    c.quadraticCurveTo(k[0] - ux * 0.4, k[1] - uy * 0.4, b[0] - ux, b[1] - uy); c.closePath(); c.fill();
    if (e) { c.lineWidth = e; c.stroke(); }
  };
  const beard = [[hd[0] + f * 1, hd[1] + 6], [hd[0] + f * 16, hd[1] + 4], [hd[0] + f * 9, hd[1] + 26], [hd[0] - f * 3, hd[1] + 14]];
  const sash = [[p.hip[0] - f * 8, p.hip[1] - 2], [p.hip[0] - f * 18, p.hip[1] + 12 + wv * 2], [p.hip[0] - f * 22, p.hip[1] + 26 + wv2 * 3]];
  const legs = (k, a, tt, e) => { L(p.hip, k, w.th + e); L(k, a, w.sh + e); L(a, tt, w.ft + e); };
  const arms = (el, h, e) => { L(p.sho, el, w.ua + e); L(el, h, w.fa + e); };
  const hairBack = (e) => {
    if (look.hair === 'ponytail') PL(pony, 8 + e);
    if (look.hair === 'long') { PL(longHair, 13 + e); PL(longHair.slice(0, 3), 16 + e); }
  };
  const hairTop = (e) => {
    if (look.hair === 'topknot') D(knot, 7 + e / 2);
    if (look.hair === 'tuft') { PL(tuft, 6 + e); D(tuft[2], 4 + e / 2); }
    if (look.hair === 'flame') for (const fl of flames) L(fl[0], fl[1], 8 + e);
    if (look.hair === 'horns') for (const h of horns) horn(h, e);
  };

  // Aura behind the body.
  if (look.aura && !o.noAura) {
    const cx = p.sho[0] * 0.6, cy = p.sho[1] * 0.6, R = 118 * (1 + Math.sin(t * 0.07) * 0.06);
    const g = c.createRadialGradient(cx, cy, 8, cx, cy, R);
    if (look.aura === 'dark') { g.addColorStop(0, 'rgba(4,2,10,0.62)'); g.addColorStop(0.6, hexA(rim, 0.14)); g.addColorStop(1, hexA(rim, 0)); }
    else { g.addColorStop(0, hexA(rim, 0.34)); g.addColorStop(1, hexA(rim, 0)); }
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill();
  }

  // Rim pass: everything in the rim colour, a little wider, so only the outer contour shows.
  c.strokeStyle = rim; c.fillStyle = rim;
  legs(p.kneeB, p.ankB, p.toeB, E); arms(p.elbB, p.handB, E); D(p.handB, w.hand + E / 2);
  hairBack(E);
  if (look.headband) { PL(tailA, 4 + E); PL(tailB, 3.5 + E); }
  if (look.sash) PL(sash, 4 + E);
  torso(); c.lineWidth = 7 + E; c.stroke(); c.fill();
  legs(p.kneeF, p.ankF, p.toeF, E);
  D(hd, HR + E / 2); hairTop(E);
  if (look.beard) { POLY(beard); c.lineWidth = E; c.stroke(); c.fill(); }
  arms(p.elbF, p.handF, E); D(p.handF, w.hand + E / 2);

  // Fill pass, back to front.
  c.strokeStyle = inkB; c.fillStyle = inkB;
  legs(p.kneeB, p.ankB, p.toeB, 0); arms(p.elbB, p.handB, 0);
  c.fillStyle = acc; c.globalAlpha = 0.7; D(p.handB, w.hand); c.globalAlpha = 1;
  c.strokeStyle = ink; c.fillStyle = ink; hairBack(0);
  if (look.headband) { c.strokeStyle = acc; PL(tailA, 4); PL(tailB, 3.5); }
  if (look.sash) { c.strokeStyle = acc; PL(sash, 4); }
  c.strokeStyle = ink; c.fillStyle = ink; torso(); c.lineWidth = 7; c.stroke(); c.fill();
  if (look.sash) {
    const bw = 14 * bulk, bx = p.hip[0] + tdx / tlen * 6, by = p.hip[1] + tdy / tlen * 6;
    c.strokeStyle = acc; L([bx + nx * bw, by + ny * bw], [bx - nx * bw, by - ny * bw], 6);
  }
  c.strokeStyle = ink; legs(p.kneeF, p.ankF, p.toeF, 0);
  c.fillStyle = ink; c.strokeStyle = ink; D(hd, HR); hairTop(0);
  if (look.beard) { POLY(beard); c.fill(); }
  if (look.headband) {
    c.save(); c.beginPath(); c.arc(hd[0], hd[1], HR, 0, TAU); c.clip();
    c.strokeStyle = acc; L([hd[0] - 20, hd[1] - 7], [hd[0] + 20, hd[1] - 8], 5);
    c.restore();
  }
  const eye = look.eyes || '#fff3d6';
  if (look.aura === 'dark') { c.fillStyle = hexA(eye, 0.35); c.beginPath(); c.arc(hd[0] + f * 8.5, hd[1] - 0.5, 6, 0, TAU); c.fill(); }
  c.fillStyle = eye; c.beginPath(); c.ellipse(hd[0] + f * 8.5, hd[1] - 0.5, 3.4, 1.7, 0, 0, TAU); c.fill();
  c.strokeStyle = ink; arms(p.elbF, p.handF, 0); c.fillStyle = acc; D(p.handF, w.hand);
  c.restore();
}

export function drawShadow(c, x, gy, s, lift) {
  const k = clamp(1 - lift / 260, 0.35, 1);
  c.fillStyle = `rgba(8,4,12,${0.4 * k})`;
  c.beginPath(); c.ellipse(x, gy + 2, 46 * s * k, 9 * s * k, 0, 0, TAU); c.fill();
}

// Head-and-shoulders portrait for the roster grid and HUD.
export function drawBust(cv, ch, pal, flip) {
  const c = cv.getContext('2d'), w = cv.width, h = cv.height, s = h / 105, f = flip ? -1 : 1, bs = ch.body.scale;
  const lean = (ch.body.stoop || 0) * 0.9;
  c.clearRect(0, 0, w, h);
  drawFighter(c, ch, pal, POSES.idle, w / 2 - f * (12 + lean) * s * bs, h * 0.46 + 171 * s * bs, f, { scale: s, t: 0, noAura: true });
}

export function glowDot(c, x, y, r, hex, a) {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, hexA(hex, a)); g.addColorStop(1, hexA(hex, 0));
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
}

function starPath(c, n, R, r) {
  c.beginPath();
  for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, d = i % 2 ? r : R; i ? c.lineTo(Math.cos(a) * d, Math.sin(a) * d) : c.moveTo(Math.cos(a) * d, Math.sin(a) * d); }
  c.closePath();
}

// One drawing per projectile kind. Each is drawn centred on the projectile.
const PROJECTILES = {
  orb(c, p, r, dir) {
    const g = c.createRadialGradient(0, 0, 0, 0, 0, r * 1.9);
    g.addColorStop(0, 'rgba(255,255,240,1)'); g.addColorStop(0.3, hexA(p.accent, 0.95)); g.addColorStop(0.65, hexA(p.rim, 0.6)); g.addColorStop(1, hexA(p.rim, 0));
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, r * 1.9, 0, TAU); c.fill();
    c.fillStyle = hexA(p.accent, 0.6);
    for (let i = 0; i < 3; i++) { const a = p.t * 0.5 + i * 2.1; c.beginPath(); c.arc(Math.cos(a) * r * 0.5 - dir * 6, Math.sin(a) * r * 0.5, r * 0.45, 0, TAU); c.fill(); }
  },
  ring(c, p, r, dir) {
    c.rotate(p.t * 0.35 * dir);
    glowDot(c, 0, 0, r * 2.2, p.rim, 0.35);
    c.strokeStyle = p.rim; c.lineWidth = 5; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke();
    c.strokeStyle = p.accent; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, r * 0.62, 0, TAU); c.stroke();
    c.strokeStyle = '#ffffff'; c.lineWidth = 3;
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; c.beginPath(); c.moveTo(Math.cos(a) * r, Math.sin(a) * r); c.lineTo(Math.cos(a + 0.35) * (r + 9), Math.sin(a + 0.35) * (r + 9)); c.stroke(); }
  },
  smoke(c, p, r, dir) {
    c.globalCompositeOperation = 'source-over';
    for (let i = 4; i >= 0; i--) { const a = p.t * 0.2 + i * 1.3; c.fillStyle = `rgba(16,10,30,${0.75 - i * 0.12})`; c.beginPath(); c.arc(-dir * i * 8 + Math.cos(a) * 4, Math.sin(a) * 5, r * (1.1 - i * 0.14), 0, TAU); c.fill(); }
    c.globalCompositeOperation = 'lighter';
    glowDot(c, 0, 0, r * 1.7, p.rim, 0.3);
    c.fillStyle = p.accent; c.beginPath(); c.arc(dir * 3, -3, 2.6, 0, TAU); c.arc(dir * 11, -3, 2.6, 0, TAU); c.fill();
  },
  confetti(c, p, r, dir) {
    glowDot(c, 0, 0, r * 1.8, p.accent, 0.3);
    const cols = ['#ff5fa8', '#ffd23d', '#4fe0d0', '#9d8cff', '#ffffff'];
    for (let i = 0; i < 10; i++) { const a = p.t * 0.3 * dir + i / 10 * TAU, d = r * (0.5 + (i % 3) * 0.3); c.save(); c.translate(Math.cos(a) * d, Math.sin(a) * d); c.rotate(a * 2); c.fillStyle = cols[i % 5]; c.fillRect(-4, -2, 8, 4); c.restore(); }
  },
  star(c, p, r) {
    c.rotate(p.t * 0.25);
    glowDot(c, 0, 0, r * 2.1, p.rim, 0.45);
    starPath(c, 5, r * 1.15, r * 0.48); c.fillStyle = p.rim; c.fill();
    starPath(c, 5, r * 0.55, r * 0.24); c.fillStyle = '#fffbe6'; c.fill();
  },
  flame(c, p, r, dir) {
    glowDot(c, 0, 0, r * 2.1, p.rim, 0.5);
    for (let i = 4; i >= 0; i--) { const k = 1 - i * 0.15; c.fillStyle = hexA(i % 2 ? p.accent : p.rim, 0.85); c.beginPath(); c.ellipse(-dir * i * 7, Math.sin(p.t * 0.6 + i) * 3, r * k * 1.3, r * k * 0.8, 0, 0, TAU); c.fill(); }
    c.fillStyle = '#fff3d0'; c.beginPath(); c.arc(dir * 3, 0, r * 0.42, 0, TAU); c.fill();
  },
  shard(c, p, r) {
    glowDot(c, 0, 0, r * 1.9, p.rim, 0.4);
    c.rotate(p.t * 0.3);
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * TAU; c.fillStyle = i % 2 ? p.rim : p.accent; c.beginPath();
      c.moveTo(Math.cos(a) * r * 1.35, Math.sin(a) * r * 1.35); c.lineTo(Math.cos(a + 0.6) * r * 0.35, Math.sin(a + 0.6) * r * 0.35); c.lineTo(Math.cos(a - 0.6) * r * 0.35, Math.sin(a - 0.6) * r * 0.35); c.fill();
    }
  },
  petal(c, p, r) {
    glowDot(c, 0, 0, r * 2, p.accent, 0.35);
    for (let i = 0; i < 5; i++) { c.save(); c.rotate(p.t * 0.15 + i / 5 * TAU); c.fillStyle = i % 2 ? p.accent : '#ffd1e6'; c.beginPath(); c.ellipse(0, -r * 0.62, r * 0.34, r * 0.7, 0, 0, TAU); c.fill(); c.restore(); }
    c.fillStyle = '#ffe8a0'; c.beginPath(); c.arc(0, 0, r * 0.25, 0, TAU); c.fill();
  },
  spear(c, p, r, dir) {
    glowDot(c, 0, 0, r * 1.9, p.rim, 0.4);
    c.strokeStyle = hexA(p.rim, 0.5); c.lineWidth = 2;
    for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-dir * r * (1.4 + i * 0.5), (i - 1) * 6); c.lineTo(-dir * r * (2.6 + i * 0.5), (i - 1) * 6); c.stroke(); }
    c.strokeStyle = p.rim; c.lineWidth = 5; c.beginPath(); c.moveTo(-dir * r * 2.2, 0); c.lineTo(dir * r * 0.6, 0); c.stroke();
    c.fillStyle = '#fff6d8'; c.beginPath(); c.moveTo(dir * r * 1.5, 0); c.lineTo(dir * r * 0.4, -r * 0.5); c.lineTo(dir * r * 0.4, r * 0.5); c.closePath(); c.fill();
  },
  tear(c, p, r, dir) {
    glowDot(c, 0, 0, r * 2, p.accent, 0.35);
    c.fillStyle = hexA(p.accent, 0.9); c.beginPath();
    c.moveTo(-dir * r * 1.8, 0);
    c.bezierCurveTo(-dir * r * 0.6, -r * 0.95, dir * r * 0.9, -r * 0.95, dir * r * 0.9, 0);
    c.bezierCurveTo(dir * r * 0.9, r * 0.95, -dir * r * 0.6, r * 0.95, -dir * r * 1.8, 0);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.arc(dir * r * 0.3, -r * 0.3, r * 0.18, 0, TAU); c.fill();
  },
  lotus(c, p, r) {
    glowDot(c, 0, 0, r * 2.3, p.rim, 0.4);
    c.strokeStyle = hexA(p.rim, 0.5 - (p.t % 30) / 60); c.lineWidth = 2; c.beginPath(); c.arc(0, 0, r + (p.t % 30) * 0.8, 0, TAU); c.stroke();
    for (let i = 0; i < 8; i++) { c.save(); c.rotate(i / 8 * TAU + p.t * 0.04); c.fillStyle = hexA(i % 2 ? p.rim : p.accent, 0.85); c.beginPath(); c.ellipse(0, -r * 0.55, r * 0.26, r * 0.6, 0, 0, TAU); c.fill(); c.restore(); }
    c.fillStyle = '#ffe9a8'; c.beginPath(); c.arc(0, 0, r * 0.28, 0, TAU); c.fill();
  },
};

export function drawProjectile(c, p) {
  c.save(); c.translate(p.x, p.y); c.globalCompositeOperation = 'lighter';
  (PROJECTILES[p.kind] || PROJECTILES.orb)(c, p, p.r, Math.sign(p.vx) || 1);
  c.restore();
}
