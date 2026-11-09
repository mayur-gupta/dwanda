// Fighter, shadow, portrait and projectile drawing.
import { TAU, DEG, clamp, hexA } from './utils.js';
import { POSES, solvePose } from './poses.js';
import { S } from '../state.js';

// Procedural silhouette with a coloured rim light.
// o: { scale, pt (pre-solved points), t (anim time), flash, rim (outline width), phase }
export function drawFighter(c, ch, pal, pose, x, y, f, o = {}) {
  const sc = (o.scale || 1) * ch.body.scale, bulk = ch.body.bulk;
  const p = o.pt || solvePose(pose, f);
  const t = o.t != null ? o.t : S.T;
  const rim = o.flash ? '#fff7e6' : pal.rim, acc = pal.accent, ink = ch.colors.ink, inkB = ch.colors.inkBack;
  const E = o.rim != null ? o.rim : 5;
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
  const tdx = p.sho[0] - p.hip[0], tdy = p.sho[1] - p.hip[1], tlen = Math.hypot(tdx, tdy) || 1, nx = -tdy / tlen, ny = tdx / tlen;
  const torso = () => {
    const sw = 17 * bulk, hw = 12 * bulk;
    c.beginPath();
    c.moveTo(p.hip[0] + nx * hw, p.hip[1] + ny * hw); c.lineTo(p.sho[0] + nx * sw, p.sho[1] + ny * sw);
    c.lineTo(p.sho[0] - nx * sw, p.sho[1] - ny * sw); c.lineTo(p.hip[0] - nx * hw, p.hip[1] - ny * hw);
    c.closePath();
  };
  const hd = p.head, HR = 17, ph = o.phase || 0;
  const wv = Math.sin(t * 0.17 + ph), wv2 = Math.sin(t * 0.17 + 1.3 + ph);
  const bandBack = [hd[0] - f * 13, hd[1] - 7];
  const tailA = [bandBack, [hd[0] - f * 24, hd[1] - 9 + wv * 3], [hd[0] - f * 36, hd[1] - 6 + wv2 * 6]];
  const tailB = [bandBack, [hd[0] - f * 22, hd[1] - 1 + wv2 * 3], [hd[0] - f * 31, hd[1] + 6 + wv * 6]];
  const pony = [[hd[0] - f * 12, hd[1] - 8], [hd[0] - f * 24, hd[1] + 2 + wv * 2], [hd[0] - f * 27, hd[1] + 22 + wv2 * 4]];
  const knot = [hd[0] - f * 4, hd[1] - HR - 4];
  const sash = [[p.hip[0] - f * 8, p.hip[1] - 2], [p.hip[0] - f * 18, p.hip[1] + 12 + wv * 2], [p.hip[0] - f * 22, p.hip[1] + 26 + wv2 * 3]];
  const look = ch.look;
  const legs = (k, a, tt, e) => { L(p.hip, k, w.th + e); L(k, a, w.sh + e); L(a, tt, w.ft + e); };
  const arms = (el, h, e) => { L(p.sho, el, w.ua + e); L(el, h, w.fa + e); };

  // Rim pass: everything in the rim colour, a little wider, so only the outer contour shows.
  c.strokeStyle = rim; c.fillStyle = rim;
  legs(p.kneeB, p.ankB, p.toeB, E); arms(p.elbB, p.handB, E); D(p.handB, w.hand + E / 2);
  if (look.hair === 'ponytail') PL(pony, 8 + E);
  if (look.headband) { PL(tailA, 4 + E); PL(tailB, 3.5 + E); }
  if (look.sash) PL(sash, 4 + E);
  torso(); c.lineWidth = 7 + E; c.stroke(); c.fill();
  legs(p.kneeF, p.ankF, p.toeF, E);
  D(hd, HR + E / 2); if (look.hair === 'topknot') D(knot, 7 + E / 2);
  arms(p.elbF, p.handF, E); D(p.handF, w.hand + E / 2);

  // Fill pass, back to front.
  c.strokeStyle = inkB; c.fillStyle = inkB;
  legs(p.kneeB, p.ankB, p.toeB, 0); arms(p.elbB, p.handB, 0);
  c.fillStyle = acc; c.globalAlpha = 0.7; D(p.handB, w.hand); c.globalAlpha = 1;
  if (look.hair === 'ponytail') { c.strokeStyle = ink; PL(pony, 8); }
  if (look.headband) { c.strokeStyle = acc; PL(tailA, 4); PL(tailB, 3.5); }
  if (look.sash) { c.strokeStyle = acc; PL(sash, 4); }
  c.strokeStyle = ink; c.fillStyle = ink; torso(); c.lineWidth = 7; c.stroke(); c.fill();
  if (look.sash) {
    const bw = 14 * bulk, bx = p.hip[0] + tdx / tlen * 6, by = p.hip[1] + tdy / tlen * 6;
    c.strokeStyle = acc; L([bx + nx * bw, by + ny * bw], [bx - nx * bw, by - ny * bw], 6);
  }
  c.strokeStyle = ink; legs(p.kneeF, p.ankF, p.toeF, 0);
  c.fillStyle = ink; D(hd, HR); if (look.hair === 'topknot') D(knot, 7);
  if (look.headband) {
    c.save(); c.beginPath(); c.arc(hd[0], hd[1], HR, 0, TAU); c.clip();
    c.strokeStyle = acc; L([hd[0] - 20, hd[1] - 7], [hd[0] + 20, hd[1] - 8], 5);
    c.restore();
  }
  c.fillStyle = '#fff3d6'; c.beginPath(); c.ellipse(hd[0] + f * 8.5, hd[1] - 0.5, 3.4, 1.7, 0, 0, TAU); c.fill();
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
  c.clearRect(0, 0, w, h);
  drawFighter(c, ch, pal, POSES.idle, w / 2 - f * 12 * s * bs, h * 0.42 + 171 * s * bs, f, { scale: s, t: 0 });
}

export function glowDot(c, x, y, r, hex, a) {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, hexA(hex, a)); g.addColorStop(1, hexA(hex, 0));
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
}

export function drawProjectile(c, p) {
  c.save(); c.translate(p.x, p.y); c.globalCompositeOperation = 'lighter';
  const r = p.r, dir = Math.sign(p.vx) || 1;
  if (p.kind === 'ring') {
    c.rotate(p.t * 0.35 * dir);
    glowDot(c, 0, 0, r * 2.2, p.rim, 0.35);
    c.strokeStyle = p.rim; c.lineWidth = 5; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke();
    c.strokeStyle = p.accent; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, r * 0.62, 0, TAU); c.stroke();
    c.strokeStyle = '#ffffff'; c.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * TAU;
      c.beginPath(); c.moveTo(Math.cos(a) * r, Math.sin(a) * r); c.lineTo(Math.cos(a + 0.35) * (r + 9), Math.sin(a + 0.35) * (r + 9)); c.stroke();
    }
  } else {
    const g = c.createRadialGradient(0, 0, 0, 0, 0, r * 1.9);
    g.addColorStop(0, 'rgba(255,255,240,1)'); g.addColorStop(0.3, hexA(p.accent, 0.95)); g.addColorStop(0.65, hexA(p.rim, 0.6)); g.addColorStop(1, hexA(p.rim, 0));
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, r * 1.9, 0, TAU); c.fill();
    c.fillStyle = hexA(p.accent, 0.6);
    for (let i = 0; i < 3; i++) {
      const a = p.t * 0.5 + i * 2.1;
      c.beginPath(); c.arc(Math.cos(a) * r * 0.5 - dir * 6, Math.sin(a) * r * 0.5, r * 0.45, 0, TAU); c.fill();
    }
  }
  c.restore();
}
