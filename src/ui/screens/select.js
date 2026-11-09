// Character select: roster grid, two preview panels, lock-in for each side.
import { ROSTER_SIZE, CPU_LEVELS } from '../../config.js';
import { CHARACTERS, palFor } from '../../characters/index.js';
import { G, S } from '../../state.js';
import { $, $$, clamp, cap } from '../../engine/utils.js';
import { sfx } from '../../engine/audio.js';
import { POSES, idlePose, lerpPose } from '../../engine/poses.js';
import { drawFighter, drawShadow, drawBust, glowDot } from '../../engine/draw.js';
import { screens, go } from '../router.js';
import { drawSelectBackdrop } from '../scenes.js';

screens.select = {
  init() {
    const grid = $('#roster');
    this.slots = [];
    this.swap = [0, 0];
    for (let i = 0; i < ROSTER_SIZE; i++) {
      const ch = CHARACTERS[i], b = document.createElement('button');
      b.type = 'button'; b.className = 'slot' + (ch ? '' : ' empty');
      if (ch) {
        b.style.setProperty('--rim', ch.colors.rim);
        b.innerHTML = `<canvas width="200" height="200"></canvas><span class="slot-name">${ch.name}</span>`;
        drawBust($('canvas', b), ch, ch.colors, false);
        b.setAttribute('aria-label', ch.name);
      } else {
        b.innerHTML = '<span class="q">?</span><span class="slot-name">Open slot</span>';
        b.setAttribute('aria-label', 'Open slot');
      }
      b.insertAdjacentHTML('beforeend', '<span class="cur c0">1P</span><span class="cur c1">2P</span>');
      b.addEventListener('click', () => { b.blur(); this.clickSlot(i); });
      grid.appendChild(b);
      this.slots.push(b);
    }
    this.panels = [0, 1].map((i) => this.buildPanel($('#pp' + i)));
    this.prev = [Object.assign({}, POSES.idle), Object.assign({}, POSES.idle)];
    $('#roster-note').textContent = `Roster ${CHARACTERS.length} of ${ROSTER_SIZE} · open slots fill as fighters are added`;
  },

  buildPanel(el) {
    el.innerHTML = '<div class="pp-tag"></div><div class="pp-ready">Ready</div><div class="pp-info"><div class="pp-name"></div><div class="pp-tagline"></div><div class="pp-stats">'
      + ['Power', 'Speed', 'Defense'].map((s) => `<div class="stat" data-s="${s.toLowerCase()}"><span>${s}</span><i></i><b></b></div>`).join('')
      + '</div><div class="pp-special"><span>Special</span><b></b></div></div>';
    return { el, tag: $('.pp-tag', el), name: $('.pp-name', el), tagline: $('.pp-tagline', el), stats: $$('.stat', el), special: $('.pp-special b', el) };
  },

  enter(arg, prev) {
    if (prev !== 'stage') this.cur = [clamp(G.picks[0], 0, ROSTER_SIZE - 1), clamp(G.picks[1], 0, ROSTER_SIZE - 1)];
    this.locked = [false, false];
    this.advance = 0;
    this.single = G.mode !== 'versus';
    const opp = G.mode === 'cpu' ? 'CPU' : G.mode === 'training' ? 'Dummy' : '2P';
    $('#sel-mode').textContent = G.mode === 'cpu' ? `VS CPU · ${cap(CPU_LEVELS[G.cpuLevel].name)}` : G.mode === 'training' ? 'Training' : '2 Players';
    $$('.slot .cur.c1').forEach((e) => { e.textContent = opp; });
    this.panels[0].tag.textContent = '1P';
    this.panels[1].tag.textContent = opp;
    this.refresh();
  },

  // In solo modes Player 1 picks both sides in turn.
  activeSide() { return this.locked[0] ? 1 : 0; },

  key(code, act, pl) {
    if (!act || this.advance) return;
    if (act === 'back') {
      if (this.single) {
        if (this.locked[1]) this.locked[1] = false;
        else if (this.locked[0]) this.locked[0] = false;
        else { sfx('back'); go('title'); return; }
      } else if (pl === -1) {
        if (this.locked[0] || this.locked[1]) this.locked = [false, false];
        else { sfx('back'); go('title'); return; }
      } else if (this.locked[pl]) this.locked[pl] = false;
      else return;
      sfx('back'); this.refresh();
      return;
    }
    const side = this.single ? this.activeSide() : pl;
    if (side < 0 || this.locked[side]) return;
    if (act === 'confirm') this.lock(side);
    else this.moveCursor(side, act);
  },

  moveCursor(side, act) {
    const cols = 4, rows = Math.ceil(ROSTER_SIZE / cols);
    let cx = this.cur[side] % cols, cy = Math.floor(this.cur[side] / cols);
    if (act === 'left') cx = (cx + cols - 1) % cols;
    else if (act === 'right') cx = (cx + 1) % cols;
    else if (act === 'up') cy = (cy + rows - 1) % rows;
    else if (act === 'down') cy = (cy + 1) % rows;
    else return;
    this.cur[side] = Math.min(ROSTER_SIZE - 1, cy * cols + cx);
    this.swap[side] = 8;
    sfx('move');
    this.refresh();
  },

  lock(side) {
    const idx = this.cur[side];
    if (!CHARACTERS[idx]) {
      sfx('deny');
      const s = this.slots[idx]; s.classList.remove('nope'); void s.offsetWidth; s.classList.add('nope');
      return;
    }
    this.locked[side] = true;
    sfx('pick');
    if (this.locked[0] && this.locked[1]) { G.picks = this.cur.slice(); this.advance = 40; }
    this.refresh();
  },

  clickSlot(i) {
    if (this.advance) return;
    const side = this.single ? this.activeSide() : (!this.locked[0] ? 0 : !this.locked[1] ? 1 : -1);
    if (side < 0) return;
    this.cur[side] = i; this.swap[side] = 8;
    this.refresh();
    this.lock(side);
  },

  refresh() {
    const showC1 = !this.single || this.locked[0];
    this.slots.forEach((s, i) => {
      s.classList.toggle('on0', this.cur[0] === i);
      s.classList.toggle('on1', showC1 && this.cur[1] === i);
      s.classList.toggle('lk0', this.locked[0] && this.cur[0] === i);
      s.classList.toggle('lk1', this.locked[1] && this.cur[1] === i);
    });
    [0, 1].forEach((side) => {
      const P = this.panels[side], ch = CHARACTERS[this.cur[side]];
      P.el.classList.toggle('locked', this.locked[side]);
      P.el.classList.toggle('waiting', side === 1 && !showC1);
      if (ch) {
        P.el.style.setProperty('--rim', palFor(side, this.cur).rim);
        P.name.textContent = ch.name;
        P.tagline.textContent = ch.tagline;
        P.stats.forEach((st) => { const v = ch.stats[st.dataset.s]; $('i', st).style.setProperty('--v', v); $('b', st).textContent = v; });
        P.special.textContent = ch.moves.special.label;
      } else {
        P.el.style.setProperty('--rim', '#5a4d6b');
        P.name.textContent = 'Open slot';
        P.tagline.textContent = 'This slot is waiting for a new fighter.';
        P.stats.forEach((st) => { $('i', st).style.setProperty('--v', 0); $('b', st).textContent = '–'; });
        P.special.textContent = '–';
      }
    });
    const el = $('#sel-hint');
    if (this.single) {
      const lead = this.locked[1] ? 'Ready' : this.locked[0] ? (G.mode === 'cpu' ? 'Now pick the CPU fighter' : 'Now pick the training dummy') : 'Pick your fighter';
      el.innerHTML = `<span class="lead">${lead}</span><span><kbd>WASD</kbd> or arrows move</span><span><kbd>Enter</kbd> pick</span><span><kbd>Esc</kbd> back</span>`;
    } else {
      el.innerHTML = '<span><b class="t1">1P</b> <kbd>WASD</kbd> + <kbd>F</kbd></span><span><b class="t2">2P</b> arrows + <kbd>1</kbd> or <kbd>,</kbd></span><span><kbd>Esc</kbd> back</span>';
    }
  },

  update() {
    if (this.advance && --this.advance === 0) { go('stage'); return; }
    for (const s of [0, 1]) {
      if (this.swap[s] > 0) this.swap[s]--;
      lerpPose(this.prev[s], this.locked[s] ? POSES.win : idlePose(S.T + s * 40), this.locked[s] ? 0.25 : 0.2);
    }
  },

  render(c) {
    drawSelectBackdrop(c, S.T);
    const showC1 = !this.single || this.locked[0];
    [0, 1].forEach((side) => {
      const ch = CHARACTERS[this.cur[side]];
      if (!ch) return;
      const x = side === 0 ? 206 : 1074, gy = 420, f = side === 0 ? 1 : -1, waiting = side === 1 && !showC1;
      const pal = waiting ? { rim: '#4b405a', accent: '#4b405a' } : palFor(side, this.cur);
      c.save(); c.translate(x, gy); c.scale(1, 0.22); glowDot(c, 0, 0, 170, pal.rim, waiting ? 0.15 : 0.5); c.restore();
      drawShadow(c, x, gy, 1.35 * ch.body.scale, 0);
      drawFighter(c, ch, pal, this.prev[side], x - f * this.swap[side] * 4, gy, f, { scale: 1.35, t: S.T, phase: side * 2 });
    });
  },
};
