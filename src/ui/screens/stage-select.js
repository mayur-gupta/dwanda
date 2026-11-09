// Arena select: the focused arena fills the background, cards along the bottom.
import { STAGES, drawStage } from '../../stages/index.js';
import { G, S } from '../../state.js';
import { $ } from '../../engine/utils.js';
import { sfx } from '../../engine/audio.js';
import { newMatch } from '../../engine/match.js';
import { screens, go } from '../router.js';

screens.stage = {
  init() {
    const wrap = $('#stage-cards');
    this.cards = STAGES.map((st, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'card';
      b.innerHTML = `<canvas width="640" height="360"></canvas><span class="card-name">${st.name}</span><span class="card-sub">${st.sub}</span>`;
      const x = $('canvas', b).getContext('2d');
      x.scale(0.5, 0.5); st.paint(x);
      if (st.dyn) st.dyn(x, 200);
      if (st.fg) st.fg(x, 200);
      b.addEventListener('click', () => { b.blur(); if (this.i === i) this.pick(); else this.focus(i); });
      b.addEventListener('mouseenter', () => this.focus(i, true));
      wrap.appendChild(b);
      return b;
    });
    this.i = 0;
  },
  enter() { this.focus(G.stage, true); },
  focus(i, silent) {
    this.i = (i + STAGES.length) % STAGES.length;
    this.cards.forEach((c, k) => c.classList.toggle('focused', k === this.i));
    $('#stage-name').textContent = STAGES[this.i].name;
    $('#stage-sub').textContent = STAGES[this.i].sub;
    if (!silent) sfx('move');
  },
  pick() { G.stage = this.i; sfx('pick'); S.match = newMatch(); go('vs'); },
  key(code, act) {
    if (act === 'left' || act === 'up') this.focus(this.i - 1);
    else if (act === 'right' || act === 'down') this.focus(this.i + 1);
    else if (act === 'confirm') this.pick();
    else if (act === 'back') { sfx('back'); go('select'); }
  },
  render(c) { drawStage(c, STAGES[this.i], S.T, true); },
};
