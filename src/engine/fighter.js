// One fighter: state machine, physics, attacks and pose animation.
import { GRAVITY } from '../config.js';
import { derive } from '../characters/defaults.js';
import { POSES, movePoses, idlePose, walkPose, lerpPose, solvePose, stoop } from './poses.js';
import { sfx } from './audio.js';
import { FX } from './fx.js';

export class Fighter {
  constructor(ch, pal, side, x, ground) {
    Object.assign(this, { ch, pal, side, x, ground, y: ground, vx: 0, vy: 0, onGround: true, facing: side === 0 ? 1 : -1 });
    this.d = derive(ch);
    this.hp = this.trail = this.d.maxHp; this.trailDelay = 0; this.meter = 0;
    this.attack = null; this.hitstun = 0; this.blockstun = 0; this.flash = 0;
    this.ko = false; this.koLanded = false; this.win = false; this.juggled = false; this.airUsed = false;
    this.blocking = false; this.crouching = false; this.walking = 0; this.walkPh = 0; this.threat = false;
    this.combo = 0; this.comboShow = 0; this.calm = 0;
    this.buf = { punch: 0, kick: 0, special: 0 };   // input buffer (ticks left)
    this.t = side * 37;
    this.pose = Object.assign({}, POSES.idle);
    this.pt = solvePose(stoop(this.pose, ch), this.facing);
  }

  get scale() { return this.ch.body.scale; }

  // World position of a skeleton point (e.g. 'handF', 'footF').
  worldPt(name) {
    const q = this.pt[name], s = this.scale;
    return [this.x + q[0] * s, this.y + (q[1] - this.pt.low) * s];
  }

  hurtbox() {
    const s = this.scale, p = this.pt, top = Math.min(p.head[1] - 18, p.sho[1] - 6);
    const cx = this.x + p.head[0] * 0.5 * s, yTop = this.y + (top - p.low) * s;
    return { x: cx - 25 * s, y: yTop, w: 50 * s, h: this.y - yTop };
  }

  startAttack(name, M) {
    const m = this.ch.moves[name];
    if (!m) return;
    if (name === 'special') {
      if (this.meter < m.cost || M.projectiles.some((p) => p.owner === this.side)) { this.buf.special = 0; return; }
      this.meter -= m.cost;
      M.stats[this.side].specials++;
    }
    this.attack = { name, f: 0, hit: false };
    this.blocking = false; this.walking = 0;
    if (name.startsWith('air')) this.airUsed = true;
    for (const k in this.buf) this.buf[k] = 0;
    if (this.onGround) this.vx = (name === 'punch' || name === 'kick') ? this.facing * 1.2 : 0;
    sfx(name === 'special' ? 'charge' : 'whoosh');
  }

  update(inp, opp, M) {
    this.t++;
    const live = M.controls && !this.ko && !this.win;
    if (this.hitstun > 0) this.hitstun--;
    if (this.blockstun > 0) this.blockstun--;
    if (this.flash > 0) this.flash--;
    for (const k in this.buf) {
      if (this.buf[k] > 0) this.buf[k]--;
      if (live && inp[k + 'P']) this.buf[k] = 8;
    }
    this.walking = 0;
    const free = live && !this.attack && this.hitstun === 0 && this.blockstun === 0;

    if (this.onGround) {
      if (free) {
        this.facing = opp.x >= this.x ? 1 : -1;
        const f = this.facing, fwd = f === 1 ? inp.right : inp.left, back = f === 1 ? inp.left : inp.right;
        this.crouching = !!inp.down;
        this.blocking = !!back;   // holding away from the opponent blocks
        if (this.buf.special && this.meter >= this.ch.moves.special.cost) this.startAttack('special', M);
        else if (this.buf.punch) this.startAttack(this.crouching ? 'lowPunch' : 'punch', M);
        else if (this.buf.kick) this.startAttack(this.crouching ? 'sweep' : 'kick', M);
        else if ((inp.up || inp.upP) && !this.crouching) {
          this.onGround = false; this.vy = -this.d.jumpV;
          this.vx = fwd ? f * this.d.airX : back ? -f * this.d.airX * 0.9 : 0;
          this.blocking = false; sfx('jump');
        } else if (!this.crouching && (fwd || back)) {
          this.vx = fwd ? f * this.d.walk : -f * this.d.walk * 0.8;
          this.walking = fwd ? 1 : -1;
        } else this.vx = 0;
      } else {
        this.vx *= 0.82;
        if (Math.abs(this.vx) < 0.05) this.vx = 0;
        if (!live) { this.crouching = false; if (!this.blockstun) this.blocking = false; }
      }
    } else if (live && !this.attack && this.hitstun === 0 && !this.airUsed) {
      if (this.buf.punch) this.startAttack('airPunch', M);
      else if (this.buf.kick) this.startAttack('airKick', M);
    }

    if (this.attack) {
      const a = this.attack, m = this.ch.moves[a.name];
      a.f++;
      if (a.name === 'special' && a.f === m.startup) M.spawnProjectile(this, m);
      if (a.f >= m.startup + m.active + m.recovery) this.attack = null;
    }

    if (!this.onGround) {
      this.vy += GRAVITY; this.x += this.vx; this.y += this.vy;
      if (this.y >= this.ground) {
        this.y = this.ground; this.vy = 0; this.onGround = true; this.airUsed = false; this.juggled = false;
        if (this.attack && this.attack.name.startsWith('air')) this.attack = null;
        if (this.ko) {
          this.vx *= 0.4;
          if (!this.koLanded) { this.koLanded = true; sfx('thud'); M.shake(6); FX.dust(this.x, this.ground, 14); }
        } else {
          this.vx = 0; FX.dust(this.x, this.ground, 5);
          if (this.hitstun > 0) this.hitstun = Math.min(this.hitstun, 10);
        }
      }
    } else this.x += this.vx;

    this.updatePose();
  }

  basePose() {
    const guard = this.blocking && (this.threat || this.blockstun > 0);
    if (!this.onGround) return this.vy < 0 ? POSES.jumpUp : POSES.jumpDown;
    if (this.crouching) return guard ? POSES.crouchBlock : POSES.crouch;
    if (guard) return POSES.block;
    if (this.walking) return walkPose(this.walkPh);
    if (this.win) return POSES.win;
    return idlePose(this.t);
  }

  updatePose() {
    let target, k;
    if (this.ko) { target = POSES.ko; k = 0.14; }
    else if (this.hitstun > 0) { target = this.onGround ? POSES.hit : POSES.hitAir; k = 0.5; }
    else if (this.attack) {
      const a = this.attack, m = this.ch.moves[a.name], P = movePoses(this.ch, a.name);
      if (a.f < m.startup) { target = P.windup; k = 0.5; }
      else if (a.f < m.startup + m.active + (m.projectile ? 6 : 0)) { target = P.strike; k = 1; }
      else { target = this.basePose(); k = 0.22; }
    } else { target = this.basePose(); k = this.blockstun ? 0.6 : 0.3; }
    if (this.walking) this.walkPh += 0.21 * this.walking * (this.d.walk / 4);
    lerpPose(this.pose, target, k);
    this.pt = solvePose(stoop(this.pose, this.ch), this.facing);
  }
}
