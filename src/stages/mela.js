import { TAU, rng } from '../engine/utils.js';
import { vgrad, glow, disc, ridge, puff } from './art.js';

const FLAGS = ['#e2463d', '#ffd23d', '#2a9d8f', '#7b4fd6', '#ff8a2a'];

function wheel(c, cx, cy, R) {
  c.strokeStyle = '#4a3358'; c.lineWidth = 9;
  c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx - 95, 600); c.moveTo(cx, cy); c.lineTo(cx + 95, 600); c.stroke();
  c.lineWidth = 5; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
  c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R * 0.9, 0, TAU); c.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); c.stroke(); }
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU, px = cx + Math.cos(a) * R, py = cy + Math.sin(a) * R;
    c.fillStyle = '#4a3358'; c.fillRect(px - 1, py, 2, 6);
    c.fillStyle = FLAGS[i % 4]; c.fillRect(px - 10, py + 5, 20, 15);
  }
  disc(c, cx, cy, 11, '#4a3358');
}

function stall(c, x, by, w, a, b) {
  const roofY = by - 122, n = 6, span = w + 20;
  c.fillStyle = '#5a3a2a'; c.fillRect(x + 4, roofY, 5, 122); c.fillRect(x + w - 9, roofY, 5, 122);
  c.fillStyle = '#7a4f35'; c.fillRect(x, by - 50, w, 50);
  c.fillStyle = '#5e3a26'; c.fillRect(x, by - 50, w, 6);
  for (let i = 0; i < n; i++) {
    const x0 = x - 10 + i * span / n, x1 = x0 + span / n, mid = x + w / 2;
    c.fillStyle = i % 2 ? b : a; c.beginPath();
    c.moveTo(mid + (x0 - mid) * 0.6, roofY - 36); c.lineTo(mid + (x1 - mid) * 0.6, roofY - 36); c.lineTo(x1, roofY); c.lineTo(x0, roofY); c.fill();
    c.beginPath(); c.arc(x0 + span / n / 2, roofY, span / n / 2, 0, Math.PI); c.fill();
  }
  const r = rng(Math.round(x));
  for (let i = 0; i < 6; i++) { c.fillStyle = FLAGS[Math.floor(r() * 5)]; c.beginPath(); c.arc(x + 14 + r() * (w - 28), by - 58, 6 + r() * 4, 0, TAU); c.fill(); }
}

// Village fair in the afternoon: giant wheel, striped stalls, bunting and balloons.
export default {
  id: 'mela',
  name: 'Village Mela',
  sub: 'The fair comes to town',
  ground: 622,
  paint(c) {
    c.fillStyle = vgrad(c, 0, 540, [[0, '#5aa8f0'], [0.6, '#a8d4f5'], [1, '#ffe3b0']]); c.fillRect(0, 0, 1280, 720);
    glow(c, 170, 110, 170, '255,240,200', 0.6);
    puff(c, 420, 150, 1.1, 'rgba(255,255,255,0.92)'); puff(c, 760, 100, 0.8, 'rgba(255,255,255,0.85)'); puff(c, 1180, 180, 0.9, 'rgba(255,255,255,0.8)');
    c.fillStyle = 'rgba(79,122,74,0.75)'; ridge(c, 540, 26, rng(61));
    wheel(c, 940, 330, 170);
    stall(c, 40, 600, 200, '#e2463d', '#fff3e0');
    stall(c, 300, 600, 170, '#2a9d8f', '#ffe08a');
    stall(c, 560, 600, 190, '#f4a261', '#fffaf0');
    stall(c, 1060, 600, 200, '#7b4fd6', '#ffd23d');
    c.fillStyle = vgrad(c, 600, 720, [[0, '#d7a265'], [1, '#a26d3c']]); c.fillRect(0, 600, 1280, 120);
    const r = rng(67);
    for (let i = 0; i < 400; i++) { c.fillStyle = r() < 0.5 ? 'rgba(255,240,210,0.18)' : 'rgba(120,70,30,0.15)'; c.fillRect(r() * 1280, 606 + r() * 114, 2 + r() * 4, 1.5); }
  },
  dyn(c, t) {
    // bunting
    [[70, 104, 28, 0], [132, 92, 24, 2]].forEach(([y0, y1, sag, off]) => {
      c.strokeStyle = 'rgba(80,50,60,0.6)'; c.lineWidth = 1.2; c.beginPath();
      for (let x = 0; x <= 1280; x += 20) { const u = x / 1280, y = y0 + (y1 - y0) * u + Math.sin(u * Math.PI) * sag; x ? c.lineTo(x, y) : c.moveTo(x, y); }
      c.stroke();
      for (let i = 0; i < 26; i++) {
        const x = i * 50 + 12, u = x / 1280, y = y0 + (y1 - y0) * u + Math.sin(u * Math.PI) * sag, sw = Math.sin(t * 0.05 + i + off) * 3;
        c.fillStyle = FLAGS[(i + off) % 5]; c.beginPath(); c.moveTo(x - 12, y); c.lineTo(x + 12, y); c.lineTo(x + sw, y + 24); c.fill();
      }
    });
    // wheel lights twinkle
    for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, on = (Math.floor(t / 8) + i) % 3 === 0; c.fillStyle = on ? '#fff6c8' : 'rgba(255,240,200,0.35)'; c.beginPath(); c.arc(940 + Math.cos(a) * 170, 330 + Math.sin(a) * 170, on ? 3 : 2, 0, TAU); c.fill(); }
    // balloon seller
    c.strokeStyle = '#4a3358'; c.lineWidth = 3; c.beginPath(); c.moveTo(250, 470); c.lineTo(250, 604); c.stroke();
    for (let i = 0; i < 6; i++) {
      const bx = 220 + (i % 3) * 30 + Math.sin(t * 0.03 + i) * 4, byy = 360 + Math.floor(i / 3) * 34 + Math.cos(t * 0.04 + i) * 3;
      c.strokeStyle = 'rgba(70,40,60,0.6)'; c.lineWidth = 1; c.beginPath(); c.moveTo(250, 470); c.lineTo(bx, byy + 16); c.stroke();
      c.fillStyle = FLAGS[i % 5]; c.beginPath(); c.ellipse(bx, byy, 13, 16, 0, 0, TAU); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.arc(bx - 4, byy - 6, 3, 0, TAU); c.fill();
    }
  },
};
