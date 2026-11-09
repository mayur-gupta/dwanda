import { TAU, rng } from '../engine/utils.js';
import { vgrad, glow, disc, tree } from './art.js';

// Village courtyard at night during a power cut: tulsi pedestal, neem tree, a dark doorway.
export default {
  id: 'aangan',
  name: 'Aangan at Night',
  sub: 'Courtyard during a power cut',
  ground: 622,
  paint(c) {
    c.fillStyle = vgrad(c, 0, 470, [[0, '#04030c'], [0.6, '#0f0d26'], [1, '#1d1a3d']]);
    c.fillRect(0, 0, 1280, 720);
    const rs = rng(31);
    for (let i = 0; i < 80; i++) { c.fillStyle = `rgba(220,225,255,${0.2 + rs() * 0.6})`; c.fillRect(rs() * 1280, rs() * 330, 1.5, 1.5); }
    glow(c, 980, 120, 120, '190,200,255', 0.22);
    disc(c, 980, 120, 26, 'rgba(225,230,255,0.9)');
    c.fillStyle = 'rgba(6,5,16,0.78)';
    c.beginPath(); c.ellipse(1010, 134, 90, 15, 0, 0, TAU); c.fill();
    c.beginPath(); c.ellipse(880, 152, 150, 13, 0, 0, TAU); c.fill();
    // house wall and tiled roof
    c.fillStyle = '#17142b'; c.fillRect(0, 440, 1280, 170);
    c.fillStyle = '#0d0b1c'; c.beginPath(); c.moveTo(-20, 448); c.lineTo(120, 392); c.lineTo(780, 392); c.lineTo(920, 448); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(40,36,70,0.6)'; c.lineWidth = 1;
    for (let y = 402; y < 446; y += 9) { c.beginPath(); c.moveTo(130 - (y - 392) * 2.5, y); c.lineTo(770 + (y - 392) * 2.5, y); c.stroke(); }
    // doorway
    c.fillStyle = '#04030a'; c.beginPath(); c.moveTo(470, 610); c.lineTo(470, 505); c.arc(515, 505, 45, Math.PI, 0); c.lineTo(560, 610); c.closePath(); c.fill();
    // lit window: someone is still awake
    glow(c, 245, 505, 100, '255,170,80', 0.22);
    c.fillStyle = '#ffb35a'; c.fillRect(225, 485, 40, 42);
    c.fillStyle = '#17142b'; c.fillRect(243, 485, 4, 42); c.fillRect(225, 504, 40, 3);
    c.strokeStyle = 'rgba(8,6,18,0.5)'; c.lineWidth = 1.2;
    [[620, 470, 650, 520], [700, 560, 690, 600], [120, 520, 150, 560]].forEach(([a, b, d, e]) => { c.beginPath(); c.moveTo(a, b); c.lineTo(d, e); c.stroke(); });
    // tulsi pedestal with a small lamp
    c.fillStyle = '#1f1b36'; c.fillRect(330, 548, 62, 64); c.fillRect(322, 540, 78, 10);
    glow(c, 361, 578, 28, '255,170,80', 0.4);
    c.fillStyle = '#ffcf7a'; c.fillRect(359, 572, 4, 5);
    const rt = rng(33); c.strokeStyle = '#121022'; c.fillStyle = '#121022'; c.lineWidth = 2.5;
    for (let k = 0; k < 7; k++) {
      const tx = 346 + rt() * 30, ty = 498 + rt() * 26;
      c.beginPath(); c.moveTo(361, 540); c.lineTo(tx, ty); c.stroke();
      c.beginPath(); c.ellipse(tx, ty, 6, 3.5, rt() * 3, 0, TAU); c.fill();
    }
    tree(c, 1090, 612, '#0a0917', rng(41), 1.1);
    // packed-earth floor with a patch of moonlight and a faint kolam
    c.fillStyle = vgrad(c, 606, 720, [[0, '#24203d'], [1, '#0e0c1c']]); c.fillRect(0, 606, 1280, 114);
    const mg = c.createRadialGradient(760, 664, 0, 760, 664, 300);
    mg.addColorStop(0, 'rgba(170,180,255,0.10)'); mg.addColorStop(1, 'rgba(170,180,255,0)');
    c.fillStyle = mg; c.beginPath(); c.ellipse(760, 664, 300, 46, 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(230,230,255,0.10)';
    for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; c.beginPath(); c.arc(640 + Math.cos(a) * 120, 676 + Math.sin(a) * 22, 2, 0, TAU); c.fill(); }
  },
  dyn(c, t) {
    for (let i = 0; i < 12; i++) {
      const x = 180 + ((i * 137 + Math.sin(t * 0.01 + i) * 60 + 1000) % 1000), y = 300 + ((i * 53) % 250) + Math.sin(t * 0.03 + i * 2) * 20;
      const a = 0.5 + 0.5 * Math.sin(t * 0.1 + i * 3);
      glow(c, x, y, 12, '200,255,140', 0.5 * a);
      c.fillStyle = `rgba(230,255,180,${a})`; c.fillRect(x - 1, y - 1, 2, 2);
    }
    // a pair of eyes in the doorway, blinking now and then
    if (t % 420 > 120 && t % 140 > 6) {
      c.fillStyle = 'rgba(220,226,255,0.75)';
      c.beginPath(); c.ellipse(503, 540, 3, 1.6, 0, 0, TAU); c.ellipse(527, 540, 3, 1.6, 0, 0, TAU); c.fill();
    }
  },
};
