// Drawing helpers shared by the arenas. All silhouettes are painted with canvas paths.
import { TAU } from '../engine/utils.js';

export function vgrad(c, y0, y1, stops) {
  const g = c.createLinearGradient(0, y0, 0, y1);
  for (const [o, col] of stops) g.addColorStop(o, col);
  return g;
}

export function glow(c, x, y, r, rgb, a) {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
}

export function disc(c, x, y, r, col) { c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }

export function ridge(c, by, amp, r) {
  c.beginPath(); c.moveTo(0, 720); c.lineTo(0, by);
  let x = 0;
  while (x < 1280) {
    const nx = x + 60 + r() * 120;
    c.quadraticCurveTo(x + (nx - x) / 2, by - amp * (0.4 + r()), nx, by - amp * r() * 0.5);
    x = nx;
  }
  c.lineTo(x, 720); c.closePath(); c.fill();
}

// Temple spire.
export function shikhara(c, x, by, w, h, col, flag) {
  c.fillStyle = col;
  c.fillRect(x - w * 0.65, by - h * 0.22, w * 1.3, h * 0.22 + 1);
  c.beginPath(); c.moveTo(x - w / 2, by - h * 0.2);
  c.bezierCurveTo(x - w * 0.5, by - h * 0.7, x - w * 0.18, by - h * 0.92, x, by - h * 0.95);
  c.bezierCurveTo(x + w * 0.18, by - h * 0.92, x + w * 0.5, by - h * 0.7, x + w / 2, by - h * 0.2);
  c.closePath(); c.fill();
  c.beginPath(); c.ellipse(x, by - h * 0.96, w * 0.14, w * 0.05, 0, 0, TAU); c.fill();
  c.fillRect(x - 1.5, by - h * 1.12, 3, h * 0.17);
  if (flag) {
    c.fillStyle = flag; c.beginPath();
    c.moveTo(x + 1.5, by - h * 1.12); c.lineTo(x + 1.5 + w * 0.3, by - h * 1.08); c.lineTo(x + 1.5, by - h * 1.03);
    c.fill();
  }
}

export function banyan(c, x, by, col, r) {
  c.fillStyle = col; c.strokeStyle = col;
  c.beginPath(); c.moveTo(x - 38, by);
  c.bezierCurveTo(x - 20, by - 90, x - 30, by - 170, x - 60, by - 230); c.lineTo(x + 40, by - 240);
  c.bezierCurveTo(x + 25, by - 160, x + 18, by - 80, x + 44, by); c.closePath(); c.fill();
  for (let i = 0; i < 34; i++) {
    const rx = x - 230 + r() * 460, top = by - 230 - r() * 40;
    c.lineWidth = 1 + r() * 3; c.beginPath(); c.moveTo(rx, top);
    c.quadraticCurveTo(rx + (r() - 0.5) * 20, (top + by) / 2, rx + (r() - 0.5) * 14, by - (r() < 0.5 ? 0 : r() * 120)); c.stroke();
  }
  for (let i = 0; i < 70; i++) {
    const a = r() * TAU, d = Math.sqrt(r());
    c.beginPath(); c.arc(x + Math.cos(a) * d * 250, by - 300 + Math.sin(a) * d * 80, 26 + r() * 44, 0, TAU); c.fill();
  }
}

// Indian wooden exercise club.
export function mudgar(c, x, by, h, tilt, col) {
  c.save(); c.translate(x, by); c.rotate(tilt); c.fillStyle = col;
  c.beginPath(); c.moveTo(-4, -h); c.lineTo(4, -h);
  c.bezierCurveTo(5, -h * 0.6, 13, -h * 0.35, 12, -6); c.quadraticCurveTo(0, 2, -12, -6);
  c.bezierCurveTo(-13, -h * 0.35, -5, -h * 0.6, -4, -h); c.fill();
  c.fillRect(-6, -h - 6, 12, 6); c.restore();
}

// Bamboo umbrella and wooden platform, as seen on river ghats.
export function umbrella(c, x, by, col) {
  c.fillStyle = col; c.fillRect(x - 2, by - 168, 4, 168);
  c.beginPath(); c.moveTo(x - 96, by - 160);
  c.quadraticCurveTo(x - 40, by - 196, x, by - 204); c.quadraticCurveTo(x + 40, by - 196, x + 96, by - 160);
  for (let i = 0; i < 8; i++) { const x0 = x + 96 - i * 24; c.quadraticCurveTo(x0 - 12, by - 151, x0 - 24, by - 160); }
  c.closePath(); c.fill();
  c.strokeStyle = 'rgba(255,200,150,0.09)'; c.lineWidth = 1.5;
  for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(x, by - 204); c.lineTo(x + i * 30, by - 158); c.stroke(); }
  c.fillStyle = col; c.fillRect(x - 62, by - 34, 124, 9); c.fillRect(x - 56, by - 25, 6, 25); c.fillRect(x + 50, by - 25, 6, 25);
}

// Rooftop water tank.
export function tank(c, x, by, w, h, col) {
  c.fillStyle = col; c.fillRect(x, by - h, w, h);
  c.beginPath(); c.ellipse(x + w / 2, by - h, w / 2, w * 0.18, 0, 0, TAU); c.fill();
  c.fillRect(x + w * 0.4, by - h - w * 0.28, w * 0.2, w * 0.12);
  c.strokeStyle = 'rgba(255,255,255,0.06)'; c.lineWidth = 1;
  for (let i = 1; i < 4; i++) { c.beginPath(); c.moveTo(x, by - h + i * h / 4); c.lineTo(x + w, by - h + i * h / 4); c.stroke(); }
}

export function skyline(c, by, minH, maxH, col, r, win, tanks) {
  let x = -30;
  while (x < 1310) {
    const w = 50 + r() * 110, h = minH + r() * (maxH - minH);
    c.fillStyle = col; c.fillRect(x, by - h, w, h + 60);
    if (tanks && r() < 0.6) tank(c, x + 10 + r() * Math.max(4, w - 40), by - h, 20, 24, col);
    if (r() < 0.3) { c.fillStyle = col; c.fillRect(x + w * 0.7, by - h - 30, 2, 30); }
    for (let wy = by - h + 10; wy < by - 8; wy += 14) {
      for (let wx = x + 6; wx < x + w - 8; wx += 12) {
        if (r() < win * 0.35) { c.fillStyle = r() < 0.75 ? 'rgba(255,205,120,0.8)' : 'rgba(150,200,255,0.7)'; c.fillRect(wx, wy, 5, 7); }
      }
    }
    x += w + 2 + r() * 6;
  }
}

// Broad-canopied tree (neem, kadamba) without hanging roots.
export function tree(c, x, by, col, r, spread = 1) {
  c.fillStyle = col; c.strokeStyle = col; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x - 22, by);
  c.bezierCurveTo(x - 10, by - 80, x - 18, by - 150, x - 30, by - 200); c.lineTo(x + 22, by - 205);
  c.bezierCurveTo(x + 14, by - 140, x + 10, by - 70, x + 26, by); c.closePath(); c.fill();
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (r() - 0.5) * 2.2;
    c.lineWidth = 6 + r() * 6; c.beginPath(); c.moveTo(x, by - 180); c.lineTo(x + Math.cos(a) * 140 * spread, by - 190 + Math.sin(a) * 120); c.stroke();
  }
  for (let i = 0; i < 55; i++) {
    const a = r() * TAU, d = Math.sqrt(r());
    c.beginPath(); c.arc(x + Math.cos(a) * d * 190 * spread, by - 280 + Math.sin(a) * d * 90, 22 + r() * 38, 0, TAU); c.fill();
  }
}

// Soft daytime cloud.
export function puff(c, x, y, s, col) {
  c.fillStyle = col;
  for (const [dx, dy, rr] of [[-50, 8, 30], [-20, -10, 38], [18, -16, 44], [52, 4, 32], [0, 14, 34]]) {
    c.beginPath(); c.arc(x + dx * s, y + dy * s, rr * s, 0, TAU); c.fill();
  }
}
