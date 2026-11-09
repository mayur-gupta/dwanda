// A match: rounds, timer, hit detection, projectiles, KO and results.
import { VIEW_W, VIEW_H, ROUNDS_TO_WIN, ROUND_TIME, STAGE_LEFT, STAGE_RIGHT } from '../config.js';
import { CHARACTERS, palFor, byId } from '../characters/index.js';
import { nayanAt } from '../characters/nayan.js';
import { STAGES, drawStage, stageIndex } from '../stages/index.js';
import { G, S } from '../state.js';
import { TAU, clamp, circleRect, REDUCED } from './utils.js';
import { readPlayer, blankInput } from './input.js';
import { drawFighter, drawShadow, drawProjectile } from './draw.js';
import { Fighter } from './fighter.js';
import { CPU } from './cpu.js';
import { FX } from './fx.js';
import { sfx } from './audio.js';
import { HUD } from '../ui/hud.js';
import { go } from '../ui/router.js';

export const CALM_MAX = 300;   // ticks of stillness needed in chapter 9 (5 seconds)

export class Match {
  constructor(cfg) {
    this.mode = cfg.mode;                       // 'cpu' | 'versus' | 'training' | 'story'
    this.chapter = cfg.chapter || null;         // story chapter data
    this.rule = cfg.rule || null;               // 'stillness' = chapter 9
    this.picks = (cfg.picks || [0, 1]).slice();
    this.stage = STAGES[cfg.stage] || STAGES[0];
    this.cpuLevel = cfg.cpuLevel;
    this.roundsToWin = cfg.roundsToWin || ROUNDS_TO_WIN;
    this.roundTime = cfg.time || ROUND_TIME;
    this.chars = cfg.chars || [CHARACTERS[this.picks[0]], CHARACTERS[this.picks[1]]];
    this.pals = cfg.pals || [palFor(0, this.picks), palFor(1, this.picks)];
    this.calm = 0;
    this.wins = [0, 0]; this.round = 1; this.perfects = [0, 0]; this.meters = [0, 0]; this.winner = null;
    this.stats = [0, 1].map(() => ({ damage: 0, hits: 0, bestCombo: 0, specials: 0, blocked: 0 }));
    this.lastCombo = [{ hits: 0, damage: 0 }, { hits: 0, damage: 0 }];
    this.cpu = (this.mode === 'cpu' || this.mode === 'story') ? new CPU(this.cpuLevel, { passive: this.rule === 'stillness' }) : null;
    this.startRound();
  }

  startRound() {
    const g = this.stage.ground;
    this.f = [new Fighter(this.chars[0], this.pals[0], 0, 440, g), new Fighter(this.chars[1], this.pals[1], 1, 840, g)];
    this.f[0].meter = this.meters[0]; this.f[1].meter = this.meters[1];
    this.projectiles = []; FX.clear();
    this.time = this.roundTime; this.tick60 = 0; this.calm = 0; this.phase = 'intro'; this.phaseT = 0; this.controls = false;
    this.hitstop = 0; this.shakeMag = 0; this.slowmo = 0; this.annT = 0;
    this.roundWinner = null; this.flashT = 0; this.perfectRound = false;
    HUD.setup(this);
  }

  roundLabel() {
    if (this.mode === 'training') return 'TRAINING';
    if (this.chapter) return this.chapter.rasa.toUpperCase();
    const final = this.wins[0] === this.roundsToWin - 1 && this.wins[1] === this.roundsToWin - 1;
    return final ? 'FINAL ROUND' : 'ROUND ' + this.round;
  }

  announce(text, kind, dur) { HUD.announce(text, kind); this.annT = dur; }
  shake(m) { if (!REDUCED) this.shakeMag = Math.max(this.shakeMag, m); }

  input(side) {
    if (!this.controls) return blankInput();
    if (side === 0) return readPlayer('p1', this.mode !== 'versus');   // solo modes accept both key sets
    if (this.mode === 'versus') return readPlayer('p2', false);
    if (this.cpu) return this.cpu.input(this.f[1], this.f[0], this);
    return blankInput();                                                // training dummy stands still
  }

  update() {
    this.phaseT++;
    if (this.annT > 0 && --this.annT === 0) HUD.hideAnnounce();
    if (this.slowmo > 0) this.slowmo--;
    const train = this.mode === 'training';

    if (this.phase === 'intro') {
      if (this.phaseT === 1) this.announce(this.roundLabel(), 'round', train ? 48 : 70);
      if (this.phaseT === (train ? 48 : 72)) { this.announce(train ? 'GO' : this.rule === 'stillness' ? 'BE STILL' : 'FIGHT!', 'fight', 40); sfx('gong'); }
      if (this.phaseT === (train ? 66 : 100)) { this.phase = 'fight'; this.controls = true; }
    } else if (this.phase === 'fight') {
      if (!train && ++this.tick60 >= 60) {
        this.tick60 = 0; this.time--;
        if (this.time <= 10 && this.time > 0) sfx('tick');
        if (this.time <= 0) this.timeUp();
      }
    } else if (this.phase === 'ko' || this.phase === 'timeup' || this.phase === 'calm') {
      if (this.phaseT === 110) this.awardRound();
      if (this.phaseT === 210) { this.endRound(); return; }
    }

    if (this.hitstop > 0) this.hitstop--;
    else {
      const inp = [this.input(0), this.input(1)];
      for (const fi of this.f) {
        const o = this.f[1 - fi.side];
        fi.threat = (!!o.attack && Math.abs(o.x - fi.x) < 230)
          || this.projectiles.some((p) => p.owner !== fi.side && Math.abs(p.x - fi.x) < 330 && Math.sign(fi.x - p.x) === Math.sign(p.vx));
      }
      this.f[0].update(inp[0], this.f[1], this);
      this.f[1].update(inp[1], this.f[0], this);
      this.push();
      this.checkHit(this.f[0], this.f[1]);
      this.checkHit(this.f[1], this.f[0]);
      this.updateProjectiles();
      if (train) this.trainingTick();
      if (this.rule === 'stillness' && this.phase === 'fight') this.stillnessTick();
    }

    for (const fi of this.f) {
      if (fi.trailDelay > 0) fi.trailDelay--;
      else if (fi.trail > fi.hp) fi.trail = Math.max(fi.hp, fi.trail - 9);
      if (fi.trail < fi.hp) fi.trail = fi.hp;
      if (fi.comboShow > 0) fi.comboShow--;
    }
    FX.update();
    this.shakeMag *= 0.86; if (this.shakeMag < 0.3) this.shakeMag = 0;
    if (this.flashT > 0) this.flashT--;
  }

  // Keep fighters from overlapping and inside the arena.
  push() {
    const [a, b] = this.f;
    if (!a.ko && !b.ko) {
      const minD = 26 * (a.scale + b.scale);
      let dx = b.x - a.x;
      if (Math.abs(a.y - b.y) < 110 && Math.abs(dx) < minD) {
        const s = dx === 0 ? a.facing : Math.sign(dx), over = (minD - Math.abs(dx)) / 2;
        a.x -= s * over; b.x += s * over;
        a.x = clamp(a.x, STAGE_LEFT, STAGE_RIGHT); b.x = clamp(b.x, STAGE_LEFT, STAGE_RIGHT);
        dx = b.x - a.x;
        if (Math.abs(dx) < minD - 0.5) {
          if (a.x <= STAGE_LEFT || a.x >= STAGE_RIGHT) b.x = a.x + s * minD; else a.x = b.x - s * minD;
        }
      }
    }
    a.x = clamp(a.x, STAGE_LEFT, STAGE_RIGHT); b.x = clamp(b.x, STAGE_LEFT, STAGE_RIGHT);
  }

  checkHit(att, def) {
    const a = att.attack;
    if (!a || a.hit || def.ko) return;
    const m = att.ch.moves[a.name];
    if (m.projectile || a.f < m.startup || a.f >= m.startup + m.active) return;
    const [hx, hy] = att.worldPt(m.limb);
    if (circleRect(hx, hy, m.radius * att.scale, def.hurtbox())) { a.hit = true; this.applyHit(att, def, m, hx, hy, att.facing); }
  }

  spawnProjectile(f, m) {
    const s = f.scale;
    this.projectiles.push({ owner: f.side, x: f.x + f.facing * 70 * s, y: f.y - 132 * s, vx: f.facing * m.speed, r: m.radius, move: m, kind: m.projectile, rim: f.pal.rim, accent: f.pal.accent, t: 0, dead: false });
    sfx('cast');
  }

  updateProjectiles() {
    for (const p of this.projectiles) {
      p.x += p.vx; p.t++;
      if (p.t % 2 === 0) FX.ember(p.x - Math.sign(p.vx) * p.r, p.y + (Math.random() - 0.5) * p.r, p.rim);
      const target = this.f[1 - p.owner];
      if (!target.ko && circleRect(p.x, p.y, p.r, target.hurtbox())) { p.dead = true; this.applyHit(this.f[p.owner], target, p.move, p.x, p.y, Math.sign(p.vx)); }
      if (p.x < -60 || p.x > VIEW_W + 60) p.dead = true;
    }
    if (this.projectiles.length === 2) {
      const [p, q] = this.projectiles;
      if (!p.dead && !q.dead && p.owner !== q.owner && Math.hypot(p.x - q.x, p.y - q.y) < p.r + q.r) {
        p.dead = q.dead = true;
        const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2;
        FX.spark(mx, my, 'hit', 1); FX.spark(mx, my, 'block', -1); sfx('block');
      }
    }
    this.projectiles = this.projectiles.filter((p) => !p.dead);
  }

  applyHit(att, def, m, hx, hy, dir) {
    if (this.rule === 'stillness' && def.side === 1) {   // Peace cannot be hurt
      def.blockstun = 8; this.hitstop = 3; FX.spark(hx, hy, 'block', dir); sfx('block');
      return;
    }
    const nearWall = (def.x <= STAGE_LEFT + 30 && dir < 0) || (def.x >= STAGE_RIGHT - 30 && dir > 0);
    const blocked = def.blocking && def.onGround && !def.attack && def.hitstun === 0;
    if (blocked) {
      def.hp = Math.max(1, def.hp - Math.round(m.damage * 0.1)); def.trailDelay = 40;   // chip damage can't KO
      def.blockstun = m.blockstun; def.vx = dir * m.push * 0.8;
      if (!m.projectile && (nearWall || Math.abs(att.x - def.x) < 140)) att.vx = -dir * m.push * (nearWall ? 0.7 : 0.35);
      def.meter = Math.min(100, def.meter + 4); att.meter = Math.min(100, att.meter + 2);
      this.stats[def.side].blocked++;
      this.hitstop = 4; FX.spark(hx, hy, 'block', dir); sfx('block');
      return;
    }
    const counter = !!def.attack;
    const wasStun = def.hitstun > 0 || def.juggled;
    att.combo = wasStun ? att.combo + 1 : 1; att.comboShow = 70;
    const scaleC = Math.max(0.45, 1 - 0.12 * (att.combo - 1));   // later combo hits do less
    const dmg = Math.round(m.damage * att.d.power / def.d.defense * scaleC * (counter ? 1.2 : 1));
    def.hp -= dmg; def.trailDelay = 40; def.attack = null; def.flash = 6;
    def.hitstun = m.hitstun; def.blockstun = 0; def.blocking = false;
    def.vx = dir * m.push;
    if (!m.projectile && nearWall) att.vx = -dir * m.push * 0.6;
    if (!def.onGround || m.launch) { def.vy = m.launch ? -9 : -6; def.onGround = false; def.juggled = true; }
    att.meter = Math.min(100, att.meter + 8); def.meter = Math.min(100, def.meter + 6);
    const st = this.stats[att.side];
    st.damage += dmg; st.hits++; st.bestCombo = Math.max(st.bestCombo, att.combo);
    const lc = this.lastCombo[att.side];
    if (att.combo === 1) { lc.hits = 1; lc.damage = dmg; } else { lc.hits = att.combo; lc.damage += dmg; }
    const heavy = m.damage >= 60;
    this.hitstop = heavy ? 8 : 6; this.shake(heavy ? 7 : 4);
    FX.spark(hx, hy, counter ? 'counter' : 'hit', dir); sfx(m.sfx || 'light');
    if (def.hp <= 0) {
      if (this.mode === 'training') def.hp = 1;
      else { def.hp = 0; this.koFighter(att, def); }
    }
  }

  koFighter(att, def) {
    def.ko = true; def.hitstun = 0; def.attack = null;
    def.vy = -9; def.vx = Math.sign(def.x - att.x || att.facing) * 4.5; def.onGround = false;
    this.phase = 'ko'; this.phaseT = 0; this.controls = false; this.slowmo = 26; this.roundWinner = att.side;
    this.perfectRound = att.hp >= att.d.maxHp; this.flashT = 8; this.shake(10); this.projectiles = [];
    if (this.chapter && att.side === 0) this.announce('MASTERED', 'round', 0);
    else this.announce(this.perfectRound ? 'PERFECT' : 'K.O.', 'ko', 0);
    sfx('ko');
  }

  timeUp() {
    this.controls = false; this.phase = 'timeup'; this.phaseT = 0;
    const [a, b] = this.f, ra = a.hp / a.d.maxHp, rb = b.hp / b.d.maxHp;
    this.roundWinner = this.rule === 'stillness' ? 1 : Math.abs(ra - rb) < 1e-6 ? -1 : (ra > rb ? 0 : 1);
    this.announce('TIME', 'time', 0); sfx('gong');
  }

  awardRound() {
    const w = this.roundWinner;
    if (w === -1) { this.wins[0]++; this.wins[1]++; }
    else { this.wins[w]++; this.f[w].win = true; if (this.perfectRound) this.perfects[w]++; }
    sfx('pip');
  }

  endRound() {
    this.meters = [this.f[0].meter, this.f[1].meter];   // Shakti carries over between rounds
    if (this.wins[0] >= this.roundsToWin || this.wins[1] >= this.roundsToWin) {
      this.winner = this.wins[0] === this.wins[1] ? -1 : (this.wins[0] > this.wins[1] ? 0 : 1);
      if (this.chapter) go('story', { result: this.winner === 0 ? 'win' : 'lose' });
      else go('results');
    } else { this.round++; this.startRound(); }
  }

  // Chapter 9: calm grows while Nayan stands still near Shanta; attacking costs calm.
  stillnessTick() {
    const [h, s] = this.f;
    const still = h.onGround && !h.attack && h.vx === 0 && !h.crouching && h.hitstun === 0 && Math.abs(h.x - s.x) < 320;
    if (still) this.calm++;
    if (h.attack && h.attack.f === 1) this.calm -= 60;
    this.calm = clamp(this.calm, 0, CALM_MAX);
    s.hp = s.trail = Math.round(s.d.maxHp * (1 - this.calm / CALM_MAX));
    if (this.calm >= CALM_MAX) {
      this.phase = 'calm'; this.phaseT = 0; this.controls = false; this.roundWinner = 0;
      this.announce('शान्ति', 'peace', 0); sfx('gong');
    }
  }

  trainingTick() {
    const [p, d] = this.f;
    p.meter = 100;
    if (p.hp < p.d.maxHp) p.hp = p.trail = p.d.maxHp;
    if (d.hitstun === 0 && d.onGround && d.blockstun === 0) {
      d.calm++;
      if (d.calm > 45 && d.hp < d.d.maxHp) d.hp = d.trail = d.d.maxHp;
    } else d.calm = 0;
  }

  render(c) {
    c.save();
    if (this.shakeMag) c.translate((Math.random() - 0.5) * this.shakeMag * 2, (Math.random() - 0.5) * this.shakeMag * 2);
    drawStage(c, this.stage, S.T);
    for (const fi of this.f) drawShadow(c, fi.x, this.stage.ground, fi.scale, fi.ground - fi.y);
    const key = (f) => (f.ko ? -1 : 0) + (f.attack ? 1 : 0);   // attacker drawn on top, KO'd fighter behind
    for (const fi of this.f.slice().sort((a, b) => key(a) - key(b))) {
      drawFighter(c, fi.ch, fi.pal, fi.pose, fi.x, fi.y, fi.facing, { pt: fi.pt, flash: fi.flash > 0, t: fi.t, phase: fi.side * 2 });
    }
    for (const p of this.projectiles) drawProjectile(c, p);
    FX.draw(c);
    if (G.hitboxes) this.drawBoxes(c);
    if (this.stage.fg) this.stage.fg(c, S.T);
    c.restore();
    if (this.flashT > 0) { c.fillStyle = `rgba(255,248,230,${this.flashT / 8 * 0.5})`; c.fillRect(0, 0, VIEW_W, VIEW_H); }
  }

  drawBoxes(c) {
    c.save(); c.lineWidth = 2;
    for (const fi of this.f) {
      if (fi.ko) continue;
      const b = fi.hurtbox();
      c.strokeStyle = 'rgba(80,220,255,0.9)'; c.strokeRect(b.x, b.y, b.w, b.h);
      const a = fi.attack;
      if (a) {
        const m = fi.ch.moves[a.name];
        if (!m.projectile && a.f >= m.startup && a.f < m.startup + m.active) {
          const [hx, hy] = fi.worldPt(m.limb);
          c.strokeStyle = 'rgba(255,60,60,0.95)'; c.beginPath(); c.arc(hx, hy, m.radius * fi.scale, 0, TAU); c.stroke();
        }
      }
    }
    for (const p of this.projectiles) { c.strokeStyle = 'rgba(255,60,60,0.95)'; c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.stroke(); }
    c.restore();
  }
}

// Builds the fight for a story chapter: Nayan at the chapter's age against its emotion.
export function newStoryMatch(ch) {
  const hero = nayanAt(ch.age), emo = byId(ch.emotion);
  return new Match({
    mode: 'story', chapter: ch, rule: ch.rule, time: ch.time, roundsToWin: 1, cpuLevel: ch.cpu,
    chars: [hero, emo],
    pals: [{ rim: hero.colors.rim, accent: hero.colors.accent }, { rim: emo.colors.rim, accent: emo.colors.accent }],
    stage: stageIndex(ch.stage),
  });
}

export function newMatch() {
  return new Match({ mode: G.mode, picks: G.picks, stage: G.stage, cpuLevel: G.cpuLevel });
}
