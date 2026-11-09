import { rng } from '../engine/utils.js';
import { vgrad, glow, disc, shikhara, umbrella } from './art.js';

// River steps at dusk with lamps drifting on the water.
export default {
  id: 'ghat',
  name: 'Ghat at Dusk',
  sub: 'River steps, lamps on the water',
  ground: 622,
  paint(c) {
    c.fillStyle = vgrad(c, 0, 480, [[0, '#12123a'], [0.45, '#47236a'], [0.75, '#bf416d'], [1, '#ff8a4c']]);
    c.fillRect(0, 0, 1280, 720);
    const rs = rng(2);
    c.fillStyle = 'rgba(255,240,220,0.55)';
    for (let i = 0; i < 40; i++) c.fillRect(rs() * 1280, rs() * 190, 1.6, 1.6);
    glow(c, 470, 470, 250, '255,140,80', 0.5);
    disc(c, 470, 470, 44, '#ffb070');
    const r = rng(5);
    let x = -20;
    while (x < 1300) {
      const w = 30 + r() * 70, h = 25 + r() * 95;
      c.fillStyle = '#2a1436'; c.fillRect(x, 470 - h, w, h + 2);
      if (r() < 0.22) shikhara(c, x + w / 2, 470 - h, w * 0.7, 60 + r() * 70, '#2a1436');
      if (r() < 0.6) {
        c.fillStyle = 'rgba(255,200,120,0.75)';
        const n = 1 + Math.floor(r() * 4);
        for (let k = 0; k < n; k++) c.fillRect(x + 5 + r() * (w - 10), 470 - h + 8 + r() * (h - 14), 3, 4);
      }
      x += w - 4;
    }
    c.fillStyle = vgrad(c, 470, 568, [[0, '#8a3a6a'], [0.35, '#4b2559'], [1, '#1a1535']]);
    c.fillRect(0, 470, 1280, 98);
    for (let i = 0; i < 14; i++) {
      const w = 50 - i * 2.6 + r() * 10;
      c.fillStyle = `rgba(255,170,100,${0.55 - i * 0.035})`;
      c.fillRect(470 - w / 2 + (r() - 0.5) * 10, 476 + i * 6.5, w, 2);
    }
    const steps = [[568, 10, '#6e4a5c'], [578, 8, '#3b2738'], [586, 10, '#77525f'], [596, 8, '#412b3c'], [604, 10, '#80596a'], [614, 8, '#47303f']];
    for (const [y, h, col] of steps) { c.fillStyle = col; c.fillRect(0, y, 1280, h); }
    c.fillStyle = vgrad(c, 622, 720, [[0, '#6a4b5b'], [1, '#2a1c28']]);
    c.fillRect(0, 622, 1280, 98);
    c.strokeStyle = 'rgba(20,10,22,0.45)'; c.lineWidth = 2;
    for (let i = -6; i <= 6; i++) { c.beginPath(); c.moveTo(640 + i * 170, 622); c.lineTo(640 + i * 230, 720); c.stroke(); }
    c.beginPath(); c.moveTo(0, 668); c.lineTo(1280, 668); c.stroke();
    umbrella(c, 230, 600, '#2b1733');
    umbrella(c, 1060, 600, '#2b1733');
  },
  dyn(c, t) {
    for (let i = 0; i < 16; i++) {
      const sp = 0.18 + (i % 5) * 0.05, x = ((i * 97 + t * sp) % 1400) - 60, y = 488 + ((i * 37) % 70);
      const fl = 0.75 + Math.sin(t * 0.2 + i) * 0.25;
      glow(c, x, y, 16 * fl, '255,170,70', 0.55);
      c.fillStyle = '#ffd27a'; c.fillRect(x - 1.2, y - 3, 2.4, 3);
      c.fillStyle = 'rgba(255,170,70,0.35)'; c.fillRect(x - 1, y + 3, 2, 8 * fl);
      c.fillStyle = '#3a1f2a'; c.fillRect(x - 4, y, 8, 2.5);
    }
    c.fillStyle = 'rgba(255,190,150,0.10)';
    for (let i = 0; i < 18; i++) c.fillRect(((i * 211 + t * 0.4 * ((i % 3) + 1)) % 1400) - 80, 480 + ((i * 13) % 85), 40 + (i % 4) * 18, 1.5);
  },
};
