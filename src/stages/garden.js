import { TAU, rng } from '../engine/utils.js';
import { vgrad, glow, disc, tree } from './art.js';

function pavilion(c, x, by, col) {
  c.fillStyle = col;
  c.fillRect(x - 92, by - 22, 184, 22);
  for (const px of [-74, -26, 18, 66]) c.fillRect(x + px, by - 150, 9, 130);
  c.fillRect(x - 98, by - 162, 196, 14);
  c.beginPath(); c.moveTo(x - 82, by - 162); c.bezierCurveTo(x - 82, by - 244, x + 82, by - 244, x + 82, by - 162); c.fill();
  c.fillRect(x - 2, by - 266, 4, 30); disc(c, x, by - 240, 6, col);
  c.fillStyle = 'rgba(255,220,170,0.15)';
  for (const px of [-48, -2, 42]) { c.beginPath(); c.moveTo(x + px - 10, by - 22); c.lineTo(x + px - 10, by - 120); c.arc(x + px + 4, by - 120, 14, Math.PI, 0); c.lineTo(x + px + 18, by - 22); c.fill(); }
}

// Moonlit garden with a lotus pond and a pavilion.
export default {
  id: 'garden',
  name: 'Lotus Garden',
  sub: 'Moonlight on the pond',
  ground: 622,
  paint(c) {
    c.fillStyle = vgrad(c, 0, 520, [[0, '#0b1626'], [0.6, '#1d3350'], [1, '#3b4f73']]); c.fillRect(0, 0, 1280, 720);
    const rs = rng(71);
    for (let i = 0; i < 50; i++) { c.fillStyle = `rgba(230,240,255,${0.2 + rs() * 0.5})`; c.fillRect(rs() * 1280, rs() * 300, 1.4, 1.4); }
    glow(c, 640, 250, 270, '255,236,210', 0.25);
    disc(c, 640, 250, 72, '#fff1d6');
    c.fillStyle = 'rgba(220,200,170,0.18)';
    [[620, 232, 14], [664, 266, 10], [650, 222, 6]].forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); });
    pavilion(c, 220, 600, '#101a2b');
    tree(c, 1110, 600, '#0c1422', rng(73), 0.9);
    const rb = rng(79);
    for (let i = 0; i < 90; i++) { const a = rb() * TAU, d = Math.sqrt(rb()); c.fillStyle = `rgba(255,143,192,${0.35 + rb() * 0.4})`; c.beginPath(); c.arc(1110 + Math.cos(a) * d * 170, 320 + Math.sin(a) * d * 80, 2 + rb() * 2.5, 0, TAU); c.fill(); }
    // pond
    c.fillStyle = vgrad(c, 512, 596, [[0, '#1c3150'], [1, '#0e1a2c']]); c.fillRect(0, 512, 1280, 84);
    for (let i = 0; i < 12; i++) { const w = 70 - i * 4.5; c.fillStyle = `rgba(255,233,196,${0.5 - i * 0.035})`; c.fillRect(640 - w / 2 + Math.sin(i * 2) * 6, 518 + i * 6.4, w, 2); }
    const rp = rng(83);
    for (let i = 0; i < 22; i++) {
      const x = rp() * 1280, y = 528 + rp() * 60, w = 14 + rp() * 14;
      c.fillStyle = '#1b3b34'; c.beginPath(); c.ellipse(x, y, w, w * 0.32, 0, 0, TAU); c.fill();
      if (rp() < 0.35) { c.fillStyle = '#ff8fc0'; for (const a of [-0.6, 0, 0.6]) { c.beginPath(); c.ellipse(x + a * 6, y - 6, 3.5, 7, a, 0, TAU); c.fill(); } }
    }
    c.fillStyle = '#0d1a1f'; c.fillRect(0, 590, 1280, 14);
    for (let x = 0; x < 1280; x += 26) { c.beginPath(); c.arc(x + 13, 592, 14, Math.PI, 0); c.fill(); }
    c.fillStyle = vgrad(c, 604, 720, [[0, '#2c3a52'], [1, '#151d2b']]); c.fillRect(0, 604, 1280, 116);
    c.strokeStyle = 'rgba(10,16,28,0.5)'; c.lineWidth = 2;
    for (let i = -5; i <= 5; i++) { c.beginPath(); c.moveTo(640 + i * 150, 604); c.lineTo(640 + i * 210, 720); c.stroke(); }
    c.beginPath(); c.moveTo(0, 660); c.lineTo(1280, 660); c.stroke();
  },
  dyn(c, t) {
    for (let i = 0; i < 16; i++) {
      const x = ((i * 89 + t * (0.3 + (i % 4) * 0.1)) % 1360) - 40, y = ((i * 61 + t * (0.5 + (i % 3) * 0.2)) % 640);
      c.save(); c.translate(x + Math.sin(t * 0.03 + i) * 12, y); c.rotate(t * 0.02 + i);
      c.fillStyle = 'rgba(255,150,196,0.75)'; c.beginPath(); c.ellipse(0, 0, 4, 2.2, 0, 0, TAU); c.fill(); c.restore();
    }
    for (let i = 0; i < 8; i++) {
      const x = 300 + ((i * 151) % 700) + Math.sin(t * 0.02 + i) * 30, y = 420 + ((i * 37) % 140) + Math.cos(t * 0.03 + i) * 12;
      glow(c, x, y, 10, '200,255,160', 0.45 + 0.3 * Math.sin(t * 0.1 + i));
    }
  },
};
