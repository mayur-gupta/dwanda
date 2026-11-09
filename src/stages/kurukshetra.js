import { TAU, rng } from '../engine/utils.js';
import { vgrad, glow, disc } from './art.js';

function horse(c, x, col) {
  c.fillStyle = col; c.strokeStyle = col;
  c.beginPath(); c.ellipse(x, -44, 22, 10, 0, 0, TAU); c.fill();
  c.lineWidth = 4;
  for (const lx of [-15, -8, 10, 17]) { c.beginPath(); c.moveTo(x + lx, -38); c.lineTo(x + lx + (lx > 0 ? 5 : -3), 0); c.stroke(); }
  c.lineWidth = 8; c.beginPath(); c.moveTo(x + 14, -48); c.lineTo(x + 26, -70); c.stroke();
  c.beginPath(); c.ellipse(x + 33, -70, 9, 5, 0.4, 0, TAU); c.fill();
  c.lineWidth = 3; c.beginPath(); c.moveTo(x - 20, -46); c.quadraticCurveTo(x - 34, -40, x - 32, -24); c.stroke();
}

function chariot(c, x, by, s, f, col, flag) {
  c.save(); c.translate(x, by); c.scale(s * f, s); c.fillStyle = col; c.strokeStyle = col;
  c.lineWidth = 3; c.beginPath(); c.arc(0, -24, 24, 0, TAU); c.stroke();
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; c.beginPath(); c.moveTo(0, -24); c.lineTo(Math.cos(a) * 24, -24 + Math.sin(a) * 24); c.stroke(); }
  c.fillRect(-28, -60, 48, 28); c.fillRect(-32, -64, 56, 6);
  c.fillRect(-22, -128, 3, 66);
  c.fillStyle = flag; c.beginPath(); c.moveTo(-19, -128); c.lineTo(12, -119); c.lineTo(-19, -108); c.fill();
  c.lineWidth = 4; c.strokeStyle = col; c.beginPath(); c.moveTo(18, -38); c.lineTo(62, -42); c.stroke();
  horse(c, 74, col); horse(c, 92, col);
  c.restore();
}

// The field of Kurukshetra at dawn, two armies waiting.
export default {
  id: 'kurukshetra',
  name: 'Kurukshetra',
  sub: 'Battlefield at dawn',
  ground: 622,
  paint(c) {
    c.fillStyle = vgrad(c, 0, 560, [[0, '#241d3a'], [0.4, '#7a3b4a'], [0.75, '#e0703f'], [1, '#ffcc80']]); c.fillRect(0, 0, 1280, 720);
    glow(c, 640, 540, 360, '255,200,120', 0.55);
    disc(c, 640, 548, 62, '#ffe0a0');
    c.fillStyle = 'rgba(255,230,180,0.06)';
    for (let i = -6; i <= 6; i++) { const a = i * 0.22; c.beginPath(); c.moveTo(640, 548); c.lineTo(640 + Math.sin(a - 0.04) * 900, 548 - Math.cos(a - 0.04) * 900); c.lineTo(640 + Math.sin(a + 0.04) * 900, 548 - Math.cos(a + 0.04) * 900); c.closePath(); c.fill(); }
    c.fillStyle = '#5a2f2a'; c.fillRect(0, 548, 1280, 40);
    // two armies on the horizon
    const r = rng(91);
    [[30, 520, '#ff8a2a'], [760, 1250, '#b0263a']].forEach(([x0, x1, flag]) => {
      for (let x = x0; x < x1; x += 7) {
        const h = 10 + r() * 4; c.fillStyle = '#2a1520'; c.fillRect(x, 552 - h, 4, h);
        c.fillRect(x + 1, 552 - h - 14 - r() * 6, 1.2, 14);
        if (r() < 0.08) { c.fillRect(x + 2, 552 - 44, 1.6, 30); c.fillStyle = flag; c.beginPath(); c.moveTo(x + 3.6, 552 - 44); c.lineTo(x + 18, 552 - 39); c.lineTo(x + 3.6, 552 - 34); c.fill(); }
      }
    });
    chariot(c, 290, 588, 1.0, 1, '#2a1520', '#ff8a2a');
    chariot(c, 990, 588, 1.0, -1, '#2a1520', '#b0263a');
    c.fillStyle = vgrad(c, 586, 720, [[0, '#6b3d26'], [1, '#2e1a12']]); c.fillRect(0, 586, 1280, 134);
    const ra = rng(97);
    c.strokeStyle = '#1e110c'; c.lineWidth = 2;
    for (let i = 0; i < 26; i++) {
      const x = ra() * 1280, y = 640 + ra() * 70, lean = (ra() - 0.5) * 0.8;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.sin(lean) * 30, y - Math.cos(lean) * 30); c.stroke();
      const tx = x + Math.sin(lean) * 30, ty = y - Math.cos(lean) * 30;
      c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx - 5, ty + 6); c.moveTo(tx, ty); c.lineTo(tx + 5, ty + 6); c.stroke();
    }
  },
  dyn(c, t) {
    c.fillStyle = 'rgba(255,210,160,0.05)';
    for (let i = 0; i < 5; i++) { const x = ((t * (0.3 + i * 0.1) + i * 300) % 1700) - 300; c.beginPath(); c.ellipse(x, 600 + i * 18, 260, 18, 0, 0, TAU); c.fill(); }
    c.strokeStyle = 'rgba(30,14,20,0.85)'; c.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const a = t * 0.01 + i * 1.6, x = 640 + Math.cos(a) * (260 + i * 30), y = 150 + Math.sin(a) * 40 + i * 12, w = Math.sin(t * 0.15 + i) * 4;
      c.beginPath(); c.moveTo(x - 10, y - w); c.quadraticCurveTo(x - 4, y - 2, x, y); c.quadraticCurveTo(x + 4, y - 2, x + 10, y - w); c.stroke();
    }
  },
};
