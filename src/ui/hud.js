// Fight HUD: health bars, timer, round lamps, Shakti meter, combo counter, announcer.
import { $, $$, clamp } from '../engine/utils.js';
import { drawBust } from '../engine/draw.js';

const DIYA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="flame" d="M12 2c2.6 3.2 3 5.4 1.8 7.2-.6.9-1.2 1.2-1.8 1.2s-1.2-.3-1.8-1.2C9 7.4 9.4 5.2 12 2z"/><path class="bowl" d="M3 13h18c-.6 4.4-4.4 7.5-9 7.5S3.6 17.4 3 13z"/></svg>';

export const HUD = {
  init() {
    this.side = [1, 2].map((n) => {
      const root = $(`.hud-side.s${n}`);
      return {
        root, fill: $('.hp .fill', root), trail: $('.hp .trail', root), name: $('.hud-name', root),
        pips: $('.pips', root), cv: $('canvas', root), meter: $(`.shakti.s${n}`), segs: $$(`.shakti.s${n} .seg i`),
        combo: $(`.combo.s${n}`), comboN: $(`.combo.s${n} b`),
      };
    });
    this.clock = $('#clock'); this.roundLbl = $('#round-label'); this.ann = $('#announce');
    this.train = $('#train-readout'); this.root = $('#scr-fight');
  },

  setup(M) {
    M.f.forEach((f, i) => {
      const h = this.side[i];
      for (const el of [h.root, h.meter, h.combo]) el.style.setProperty('--rim', f.pal.rim);
      h.name.textContent = f.ch.name;
      drawBust(h.cv, f.ch, f.pal, i === 1);
      h.pips.innerHTML = Array.from({ length: M.roundsToWin }, () => `<span class="pip">${DIYA}</span>`).join('');
      h._r = h._tr = h._m = h._w = h._c = undefined;
      h.combo.classList.remove('on');
    });
    this.root.classList.toggle('training', M.mode === 'training');
    this.root.classList.toggle('hinted', M.mode === 'training' || M.rule === 'stillness');
    this._time = this._rl = this._tx = undefined;
    this.hideAnnounce();
    this.sync(M);
  },

  // Called every tick; only touches the DOM when a value changes.
  sync(M) {
    M.f.forEach((f, i) => {
      const h = this.side[i], max = f.d.maxHp, r = clamp(f.hp / max, 0, 1), tr = clamp(f.trail / max, 0, 1);
      if (h._r !== r) { h.fill.style.transform = `scaleX(${r})`; h.root.classList.toggle('low', r > 0 && r <= 0.25); h._r = r; }
      if (h._tr !== tr) { h.trail.style.transform = `scaleX(${tr})`; h._tr = tr; }
      if (h._m !== f.meter) {
        const m = f.meter;
        h.segs[0].style.transform = `scaleX(${clamp(m / 50, 0, 1)})`;
        h.segs[1].style.transform = `scaleX(${clamp((m - 50) / 50, 0, 1)})`;
        h.meter.classList.toggle('one', m >= 50); h.meter.classList.toggle('two', m >= 100);
        h._m = m;
      }
      const w = M.wins[i];
      if (h._w !== w) { [...h.pips.children].forEach((p, k) => p.classList.toggle('lit', k < w)); h._w = w; }
      const c = f.combo >= 2 && f.comboShow > 0 ? f.combo : 0;
      if (h._c !== c) {
        if (c) { h.comboN.textContent = c; h.combo.classList.remove('on'); void h.combo.offsetWidth; h.combo.classList.add('on'); }
        else h.combo.classList.remove('on');
        h._c = c;
      }
    });
    const train = M.mode === 'training';
    const tm = train ? '∞' : String(Math.max(0, M.time));
    if (this._time !== tm) { this.clock.textContent = tm; this.clock.parentElement.classList.toggle('hurry', !train && M.time <= 10); this._time = tm; }
    const rl = train ? 'Training' : M.chapter ? `Age ${M.chapter.age}` : `Round ${M.round}`;
    if (this._rl !== rl) { this.roundLbl.textContent = rl; this._rl = rl; }
    if (train || M.rule === 'stillness') {
      const lc = M.lastCombo[0];
      const tx = M.rule === 'stillness'
        ? `Stand still near Shanta · calm ${Math.round(M.calm / 3)}%`
        : lc.hits ? `Last combo · ${lc.hits} hit${lc.hits > 1 ? 's' : ''} · ${lc.damage} damage` : 'Hit the dummy to see combo damage';
      if (this._tx !== tx) { this.train.textContent = tx; this._tx = tx; }
    }
  },

  announce(text, kind) {
    const a = this.ann;
    a.className = 'announce'; a.textContent = text; void a.offsetWidth; a.className = 'announce show ' + kind;
  },
  hideAnnounce() { this.ann.className = 'announce'; },
};
