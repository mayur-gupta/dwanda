import { TAU, rng } from '../engine/utils.js';
import { vgrad, glow, disc, skyline, tank } from './art.js';

const sagY = (x) => 440 + 15 * (1 - Math.pow((x - 642) / 260, 2)); // clothesline curve

// City terrace at night in the monsoon: water tanks, a clothesline, rain and lightning.
export default {
  id: 'rooftop',
  name: 'Monsoon Rooftop',
  sub: 'City terrace in the rain',
  ground: 622,
  paint(c) {
    c.fillStyle = vgrad(c, 0, 560, [[0, '#060918'], [0.55, '#121a3b'], [1, '#2a3463']]);
    c.fillRect(0, 0, 1280, 720);
    glow(c, 1010, 130, 130, '200,215,255', 0.25);
    disc(c, 1010, 130, 30, 'rgba(221,229,255,0.85)');
    c.fillStyle = 'rgba(10,14,32,0.65)';
    [[880, 150, 220, 26], [1150, 120, 180, 22], [300, 90, 260, 30], [620, 190, 300, 24]].forEach(([x, y, rx, ry]) => {
      c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill();
    });
    const r = rng(17);
    skyline(c, 540, 40, 150, '#121733', r, 0.35, false);
    skyline(c, 572, 60, 230, '#0b0f22', r, 0.55, true);
    c.save();
    c.shadowColor = '#ff4fa3'; c.shadowBlur = 18; c.strokeStyle = '#ff4fa3'; c.lineWidth = 3; c.fillStyle = '#16122a';
    c.fillRect(760, 330, 170, 70); c.strokeRect(760, 330, 170, 70);
    c.restore();
    c.fillStyle = 'rgba(255,194,61,0.85)';
    c.fillRect(778, 348, 60, 8); c.fillRect(778, 364, 110, 8); c.fillRect(778, 380, 80, 6);
    c.fillStyle = '#2b3150'; c.fillRect(0, 560, 1280, 46);
    c.fillStyle = '#3a4268'; c.fillRect(0, 555, 1280, 6);
    c.strokeStyle = 'rgba(10,12,24,0.35)'; c.lineWidth = 1;
    for (let x = 40; x < 1280; x += 120) { c.beginPath(); c.moveTo(x, 561); c.lineTo(x, 606); c.stroke(); }
    c.fillStyle = vgrad(c, 606, 720, [[0, '#1c2140'], [1, '#0c0f1f']]);
    c.fillRect(0, 606, 1280, 114);
    [[260, 660, 120], [700, 690, 160], [1050, 650, 110], [480, 700, 90]].forEach(([x, y, w]) => {
      const g = c.createRadialGradient(x, y, 0, x, y, w);
      g.addColorStop(0, 'rgba(150,170,255,0.13)'); g.addColorStop(1, 'rgba(150,170,255,0)');
      c.fillStyle = g; c.beginPath(); c.ellipse(x, y, w, w * 0.18, 0, 0, TAU); c.fill();
    });
    tank(c, 70, 612, 84, 110, '#090b16');
    c.fillStyle = '#141a33'; c.fillRect(380, 432, 5, 176); c.fillRect(900, 432, 5, 176);
    c.strokeStyle = '#2a3150'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(382, 440); c.quadraticCurveTo(642, 470, 902, 440); c.stroke();
  },
  dyn(c, t) {
    [[470, 90, 120, '#4a2a48'], [620, 70, 140, '#1f4450'], [760, 100, 110, '#5a4220']].forEach(([x, w, h, col], i) => {
      const s = Math.sin(t * 0.04 + i) * 8, y0 = sagY(x), y1 = sagY(x + w);
      c.fillStyle = col; c.beginPath(); c.moveTo(x, y0); c.lineTo(x + w, y1);
      c.quadraticCurveTo(x + w + s, y1 + h * 0.6, x + w + s * 1.4, y1 + h);
      c.lineTo(x + s * 1.2, y0 + h + 4);
      c.quadraticCurveTo(x + s * 0.6, y0 + h * 0.5, x, y0);
      c.fill();
    });
    const ph = t % 520;
    if (ph < 8 && ph % 4 < 2) { c.fillStyle = 'rgba(190,205,255,0.2)'; c.fillRect(0, 0, 1280, 720); }
  },
  fg(c, t) {
    c.strokeStyle = 'rgba(170,190,255,0.32)'; c.lineWidth = 1.3; c.beginPath();
    for (let i = 0; i < 160; i++) {
      const sp = 14 + (i % 7), y = ((t * sp + i * 53) % 780) - 40, x = ((i * 137.5) % 1340) - y * 0.18 + 60;
      c.moveTo(x, y); c.lineTo(x - 4, y + 18);
    }
    c.stroke();
    c.strokeStyle = 'rgba(190,205,255,0.35)'; c.lineWidth = 1;
    for (let i = 0; i < 14; i++) {
      const k = ((t + i * 23) % 30) / 30, x = (i * 331) % 1280, y = 630 + ((i * 47) % 85);
      c.globalAlpha = 1 - k; c.beginPath(); c.ellipse(x, y, 3 + k * 12, 1 + k * 3, 0, 0, TAU); c.stroke();
    }
    c.globalAlpha = 1;
  },
};
