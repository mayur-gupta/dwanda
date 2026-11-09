import { rng } from '../engine/utils.js';
import { vgrad, glow, disc, ridge, shikhara, mudgar, banyan } from './art.js';

// Traditional wrestling pit at dawn: shrine, wooden clubs, banyan tree.
export default {
  id: 'akhada',
  name: 'Akhada',
  sub: 'Wrestling pit at dawn',
  ground: 622,
  paint(c) {
    c.fillStyle = vgrad(c, 0, 600, [[0, '#2a1d4d'], [0.42, '#7d3a66'], [0.72, '#e2714f'], [1, '#ffc27a']]);
    c.fillRect(0, 0, 1280, 720);
    glow(c, 760, 500, 320, '255,214,150', 0.55);
    disc(c, 760, 500, 62, '#ffe2b0');
    c.fillStyle = 'rgba(132,58,92,0.55)'; ridge(c, 548, 34, rng(4));
    c.fillStyle = 'rgba(78,30,66,0.88)'; ridge(c, 574, 22, rng(11));
    shikhara(c, 205, 585, 110, 250, '#26132e', '#ff8a2a');
    mudgar(c, 332, 590, 70, -0.12, '#26132e');
    mudgar(c, 356, 590, 62, 0.08, '#26132e');
    banyan(c, 1095, 590, '#21102a', rng(21));
    c.fillStyle = vgrad(c, 575, 720, [[0, '#4b2230'], [0.12, '#7c3f2f'], [0.5, '#9a5434'], [1, '#5a2a22']]);
    c.fillRect(0, 575, 1280, 145);
    c.fillStyle = 'rgba(40,14,24,0.7)'; c.fillRect(0, 575, 1280, 8);
    const r = rng(7);
    for (let i = 0; i < 900; i++) {
      const yy = 585 + Math.pow(r(), 1.4) * 135;
      c.fillStyle = r() < 0.5 ? 'rgba(255,200,150,0.07)' : 'rgba(40,10,10,0.12)';
      c.fillRect(r() * 1280, yy, 2 + r() * 6 * (yy - 570) / 150, 1.2);
    }
  },
  dyn(c, t) {
    c.strokeStyle = 'rgba(40,16,40,0.8)'; c.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const x = ((t * (0.5 + i * 0.07) + i * 260) % 1500) - 110;
      const y = 170 + i * 26 + Math.sin(t * 0.03 + i) * 8, w = Math.sin(t * 0.25 + i * 2) * 5;
      c.beginPath(); c.moveTo(x - 9, y - w); c.quadraticCurveTo(x - 4, y - 3, x, y); c.quadraticCurveTo(x + 4, y - 3, x + 9, y - w); c.stroke();
    }
  },
};
