// CPU opponent: makes a decision every few ticks and produces the same input shape a player does.
import { CPU_LEVELS } from '../config.js';
import { blankInput } from './input.js';

export class CPU {
  constructor(level) {
    this.L = CPU_LEVELS[level];
    this.hold = { fwd: false, back: false, down: false, up: false };
    this.timer = 20;
    this.press = null;
  }

  input(me, opp, M) {
    const out = blankInput(), dx = opp.x - me.x, dist = Math.abs(dx);
    if (--this.timer <= 0) this.decide(me, opp, M, dist);
    if (!me.onGround && !me.attack && !me.airUsed && dist < 150 && me.vy > -4 && Math.random() < 0.2) this.press = 'kick';
    const fwdKey = dx >= 0 ? 'right' : 'left', backKey = dx >= 0 ? 'left' : 'right';
    if (this.hold.fwd) out[fwdKey] = true;
    if (this.hold.back) out[backKey] = true;
    if (this.hold.down) out.down = true;
    if (this.hold.up) { out.up = true; this.hold.up = false; }
    if (this.press) { out[this.press] = true; out[this.press + 'P'] = true; this.press = null; }
    return out;
  }

  decide(me, opp, M, dist) {
    const L = this.L, r = Math.random();
    this.hold = { fwd: false, back: false, down: false, up: false };
    this.timer = L.react + Math.floor(Math.random() * L.react);
    const proj = M.projectiles.find((p) => p.owner !== me.side && Math.sign(me.x - p.x) === Math.sign(p.vx) && Math.abs(me.x - p.x) < 380);
    const threat = opp.attack && dist < 200;

    if ((threat || proj) && r < L.block) {
      this.hold.back = true;
      this.hold.down = !!(opp.attack && (opp.attack.name === 'sweep' || opp.attack.name === 'lowPunch'));
      this.timer = 18 + Math.floor(Math.random() * 12);
      return;
    }
    if (proj && r < L.block + 0.25) { this.hold.up = true; this.hold.fwd = true; return; }

    if (dist > 330) {
      if (me.meter >= 50 && r < L.special) { this.press = 'special'; return; }
      if (r < 0.1 * L.aggro + 0.03) { this.hold.up = true; this.hold.fwd = true; return; }
      this.hold.fwd = r < 0.4 + L.aggro * 0.6;
      return;
    }
    if (dist > 125) {
      if (r < L.aggro * 0.8) { this.hold.fwd = true; this.timer = Math.min(this.timer, 12); return; }
      if (r < L.aggro * 0.8 + 0.12) { this.hold.up = true; this.hold.fwd = true; return; }
      if (me.meter >= 50 && Math.random() < L.special * 0.5) { this.press = 'special'; return; }
      if (r < 0.92) { this.hold.back = true; this.timer = 10; }
      return;
    }
    // Close range.
    if (r < 0.34) this.press = 'punch';
    else if (r < 0.56) this.press = 'kick';
    else if (r < 0.66) { this.hold.down = true; this.press = 'kick'; }
    else if (r < 0.74) { this.hold.down = true; this.press = 'punch'; }
    else { this.hold.back = true; this.timer = r < 0.74 + (1 - L.aggro) * 0.3 ? 14 : 8; }
    this.timer = Math.max(4, Math.floor(this.timer * (1.2 - L.aggro)));
  }
}
