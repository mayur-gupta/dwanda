import { TAU, rng } from '../engine/utils.js';
import { vgrad, glow, ridge } from './art.js';

// Ramagiri hill as the monsoon arrives: towering clouds, light breaking through, cranes on the wind.
export default {
  id: 'ramgiri',
  name: 'Ramgiri Clouds',
  sub: 'Hilltop as the monsoon rolls in',
  ground: 622,
  paint(c) {
    c.fillStyle = vgrad(c, 0, 560, [[0, '#16233f'], [0.45, '#3b5a86'], [0.8, '#e9b47a'], [1, '#ffd9a0']]); c.fillRect(0, 0, 1280, 720);
    glow(c, 640, 520, 420, '255,210,150', 0.35);
    // cloud mass, lit from above
    const r = rng(51), puffs = [];
    for (let i = 0; i < 46; i++) puffs.push([700 + (r() - 0.5) * 760 * (1 - i / 80), 380 - Math.pow(r(), 0.7) * 300, 46 + r() * 84]);
    puffs.sort((a, b) => b[1] - a[1]);
    for (const [x, y, rad] of puffs) {
      const g = c.createRadialGradient(x - rad * 0.3, y - rad * 0.45, rad * 0.1, x, y, rad);
      g.addColorStop(0, '#fff1de'); g.addColorStop(0.55, '#b7b5c9'); g.addColorStop(1, '#5d6a8c');
      c.fillStyle = g; c.beginPath(); c.arc(x, y, rad, 0, TAU); c.fill();
    }
    c.fillStyle = 'rgba(52,64,96,0.55)'; c.beginPath(); c.ellipse(700, 410, 420, 40, 0, 0, TAU); c.fill();
    // rays of light through the gaps
    c.fillStyle = 'rgba(255,240,210,0.07)';
    [[520, -0.35], [640, -0.1], [780, 0.2], [880, 0.42]].forEach(([x, a]) => {
      c.beginPath(); c.moveTo(x, 400); c.lineTo(x + Math.tan(a) * 200 - 30, 600); c.lineTo(x + Math.tan(a) * 200 + 40, 600); c.closePath(); c.fill();
    });
    c.fillStyle = '#3a4f6b'; ridge(c, 520, 30, rng(53));
    c.fillStyle = '#2c3d52'; ridge(c, 552, 22, rng(57));
    c.strokeStyle = 'rgba(255,217,160,0.7)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(250, 590); c.bezierCurveTo(480, 560, 560, 600, 760, 572); c.bezierCurveTo(900, 556, 980, 576, 1120, 560); c.stroke();
    // hilltop plateau and rocks
    c.fillStyle = '#24352c'; c.beginPath(); c.moveTo(0, 720); c.lineTo(0, 600); c.quadraticCurveTo(300, 586, 640, 600); c.quadraticCurveTo(980, 588, 1280, 602); c.lineTo(1280, 720); c.fill();
    c.fillStyle = vgrad(c, 606, 720, [[0, '#2f4a3a'], [1, '#16241c']]); c.fillRect(0, 610, 1280, 110);
    c.fillStyle = '#1a281f';
    [[90, 612, 60, 34], [1170, 612, 80, 46], [1050, 616, 40, 22]].forEach(([x, y, w, h]) => { c.beginPath(); c.ellipse(x, y, w, h, 0, Math.PI, 0); c.fill(); });
    const rg = rng(59); c.strokeStyle = 'rgba(90,140,90,0.35)'; c.lineWidth = 1.2;
    for (let i = 0; i < 160; i++) { const x = rg() * 1280, y = 612 + rg() * 100; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (rg() - 0.5) * 6, y - 5 - rg() * 6); c.stroke(); }
  },
  dyn(c, t) {
    const ph = t % 300;
    if (ph < 10 && ph % 4 < 2) glow(c, 820, 230, 200, '220,230,255', 0.4);
    // cranes flying with the cloud, as in Meghaduta
    const bx = ((t * 0.6) % 1600) - 200;
    c.strokeStyle = 'rgba(255,250,240,0.9)'; c.lineWidth = 2;
    for (let i = 0; i < 7; i++) {
      const x = bx - Math.abs(i - 3) * 22, y = 190 + (i - 3) * 9 + Math.sin(t * 0.05 + i) * 3, w = Math.sin(t * 0.2 + i) * 5;
      c.beginPath(); c.moveTo(x - 9, y - w); c.quadraticCurveTo(x - 4, y - 2, x, y); c.quadraticCurveTo(x + 4, y - 2, x + 9, y - w); c.stroke();
    }
  },
};
