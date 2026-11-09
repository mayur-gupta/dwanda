// Particles: hit sparks, block sparks, landing dust and projectile embers.
import { TAU } from './utils.js';

export const FX = {
  list: [],
  clear() { this.list.length = 0; },
  spark(x, y, kind, dir) {
    const cols = kind === 'block' ? ['#d6f1ff', '#8fd0ff', '#ffffff'] : kind === 'counter' ? ['#ff6fb1', '#ffffff', '#ffc23d'] : ['#ffc23d', '#fff1c2', '#ff8a2a'];
    const n = kind === 'block' ? 9 : 15;
    for (let i = 0; i < n; i++) {
      const a = (Math.random() - 0.5) * 2.2 + (dir > 0 ? 0 : Math.PI), sp = 3 + Math.random() * 7;
      this.list.push({ k: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, life: 14 + Math.random() * 8, max: 22, col: cols[i % 3], w: 2 + Math.random() * 2 });
    }
    this.list.push({ k: 'ring', x, y, r: 8, vx: 0, vy: 0, life: 12, max: 12, col: cols[0] });
  },
  dust(x, y, n) {
    for (let i = 0; i < n; i++) this.list.push({ k: 'dust', x: x + (Math.random() - 0.5) * 50, y: y - 2, vx: (Math.random() - 0.5) * 2.2, vy: -Math.random() * 1.2, life: 26 + Math.random() * 14, max: 40, r: 4 + Math.random() * 6 });
  },
  ember(x, y, col) {
    this.list.push({ k: 'ember', x, y, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8, life: 16, max: 16, r: 3 + Math.random() * 4, col });
  },
  update() {
    for (const p of this.list) {
      p.life--; p.x += p.vx; p.y += p.vy;
      if (p.k === 'spark') { p.vx *= 0.88; p.vy = p.vy * 0.88 + 0.25; }
      else if (p.k === 'ring') p.r += 5;
      else if (p.k === 'dust') { p.vx *= 0.95; p.r += 0.3; }
    }
    this.list = this.list.filter((p) => p.life > 0);
  },
  draw(c) {
    c.save();
    for (const p of this.list) {
      const a = p.life / p.max;
      if (p.k === 'dust') {
        c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
        c.fillStyle = `rgba(214,184,160,${a * 0.35})`; c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.fill();
        continue;
      }
      c.globalCompositeOperation = 'lighter'; c.globalAlpha = a;
      if (p.k === 'spark') { c.strokeStyle = p.col; c.lineWidth = p.w; c.lineCap = 'round'; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - p.vx * 2.2, p.y - p.vy * 2.2); c.stroke(); }
      else if (p.k === 'ring') { c.strokeStyle = p.col; c.lineWidth = 3 * a + 1; c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.stroke(); }
      else { c.fillStyle = p.col; c.beginPath(); c.arc(p.x, p.y, p.r * a, 0, TAU); c.fill(); }
    }
    c.restore();
  },
};
