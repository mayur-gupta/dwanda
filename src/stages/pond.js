import { TAU, rng } from '../engine/utils.js';
import { vgrad, glow, disc, ridge } from './art.js';

function lantern(c, x, by, col) {
  c.fillStyle = col;
  c.fillRect(x - 22, by - 12, 44, 12); c.fillRect(x - 7, by - 70, 14, 58); c.fillRect(x - 20, by - 80, 40, 10);
  c.fillRect(x - 16, by - 112, 32, 32);
  c.fillStyle = 'rgba(255,220,160,0.6)'; c.fillRect(x - 8, by - 104, 16, 16);
  c.fillStyle = col; c.beginPath(); c.moveTo(x - 34, by - 112); c.quadraticCurveTo(x, by - 134, x + 34, by - 112); c.lineTo(x + 20, by - 124); c.lineTo(x - 20, by - 124); c.closePath(); c.fill();
  disc(c, x, by - 134, 6, col);
}

// An old pond at dawn, in mist. Basho's frog lives here.
export default {
  id: 'pond',
  name: 'The Old Pond',
  sub: 'Dawn mist, still water',
  ground: 622,
  paint(c) {
    c.fillStyle = vgrad(c, 0, 480, [[0, '#b9c9df'], [0.55, '#e6dfe0'], [1, '#f6e7d2']]); c.fillRect(0, 0, 1280, 720);
    glow(c, 860, 380, 240, '255,230,200', 0.5);
    disc(c, 860, 380, 40, 'rgba(255,242,224,0.95)');
    c.fillStyle = '#a3b4cb'; ridge(c, 440, 110, rng(101));
    c.fillStyle = 'rgba(246,240,236,0.45)'; c.fillRect(0, 420, 1280, 40);
    c.fillStyle = '#8ea3bd'; ridge(c, 470, 70, rng(103));
    c.fillStyle = 'rgba(246,240,236,0.5)'; c.fillRect(0, 456, 1280, 30);
    c.fillStyle = '#7891ad'; ridge(c, 490, 36, rng(107));
    // water
    c.fillStyle = vgrad(c, 486, 596, [[0, '#e3e6ec'], [1, '#a5b6ca']]); c.fillRect(0, 486, 1280, 110);
    glow(c, 860, 520, 120, '255,236,214', 0.4);
    c.fillStyle = 'rgba(120,145,173,0.25)'; c.fillRect(0, 500, 1280, 6);
    const rp = rng(109);
    for (let i = 0; i < 14; i++) { const x = rp() * 1280, y = 530 + rp() * 56, w = 12 + rp() * 12; c.fillStyle = '#5f7a5c'; c.beginPath(); c.ellipse(x, y, w, w * 0.3, 0, 0, TAU); c.fill(); }
    // the frog on its lily pad
    c.fillStyle = '#5f7a5c'; c.beginPath(); c.ellipse(430, 566, 22, 7, 0, 0, TAU); c.fill();
    c.fillStyle = '#2f3a2c'; c.beginPath(); c.ellipse(430, 559, 8, 5, 0, 0, TAU); c.fill(); c.beginPath(); c.arc(436, 555, 3.5, 0, TAU); c.fill();
    // reeds
    const rr = rng(113); c.strokeStyle = '#3b4a3f'; c.lineWidth = 2;
    for (let i = 0; i < 40; i++) { const x = i < 20 ? rr() * 160 : 1120 + rr() * 160, h = 40 + rr() * 70; c.beginPath(); c.moveTo(x, 596); c.quadraticCurveTo(x + 4, 596 - h / 2, x + (rr() - 0.5) * 16, 596 - h); c.stroke(); }
    lantern(c, 1040, 600, '#4a5248');
    // willow from the top-left
    const rw = rng(127);
    for (let i = 0; i < 26; i++) {
      const x0 = rw() * 340, len = 120 + rw() * 200;
      c.strokeStyle = `rgba(74,90,72,${0.5 + rw() * 0.4})`; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(x0, -10); c.quadraticCurveTo(x0 + 30, len * 0.4, x0 + 12, len); c.stroke();
      c.fillStyle = 'rgba(92,112,86,0.6)';
      for (let k = 0; k < 8; k++) { const u = k / 8, lx = x0 + 30 * 2 * u * (1 - u) + 12 * u * u, ly = len * 0.4 * 2 * u * (1 - u) + len * u * u; c.beginPath(); c.ellipse(lx + 3, ly, 2, 6, 0.3, 0, TAU); c.fill(); }
    }
    // mossy bank
    c.fillStyle = vgrad(c, 592, 720, [[0, '#6d7a66'], [1, '#3e4a3c']]); c.fillRect(0, 592, 1280, 128);
    const rs = rng(131); c.fillStyle = 'rgba(52,62,50,0.6)';
    for (let i = 0; i < 18; i++) { c.beginPath(); c.ellipse(rs() * 1280, 600 + rs() * 8, 20 + rs() * 30, 8 + rs() * 6, 0, Math.PI, 0); c.fill(); }
  },
  dyn(c, t) {
    const k = (t % 360) / 120;
    if (k < 1) {
      c.strokeStyle = `rgba(90,110,135,${0.5 * (1 - k)})`; c.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) { const rr = (k * 60) + i * 14; c.beginPath(); c.ellipse(452, 568, rr, rr * 0.25, 0, 0, TAU); c.stroke(); }
    }
    c.fillStyle = 'rgba(255,255,255,0.10)';
    for (let i = 0; i < 3; i++) { const x = ((t * (0.15 + i * 0.05) + i * 500) % 1800) - 300; c.beginPath(); c.ellipse(x, 500 + i * 24, 320, 16, 0, 0, TAU); c.fill(); }
    const lx = ((t * 0.7) % 1500) - 100, ly = 80 + ((t * 0.5) % 520);
    c.save(); c.translate(lx, ly + Math.sin(t * 0.05) * 10); c.rotate(Math.sin(t * 0.04) * 0.8);
    c.fillStyle = 'rgba(110,128,96,0.8)'; c.beginPath(); c.ellipse(0, 0, 6, 2.5, 0, 0, TAU); c.fill(); c.restore();
  },
};
