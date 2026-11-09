// Story map: Nayan's life as a path of nine chapters.
import { CHAPTERS } from '../../story/chapters.js';
import { progress } from '../../story/progress.js';
import { byId } from '../../characters/index.js';
import { S } from '../../state.js';
import { $, clamp } from '../../engine/utils.js';
import { sfx } from '../../engine/audio.js';
import { screens, go } from '../router.js';
import { drawMap } from '../scenes.js';

export const MAP_NODES = [[110, 632], [240, 574], [370, 626], [500, 556], [630, 612], [760, 542], [890, 596], [1020, 530], [1150, 584]];

const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));

screens.map = {
  init() {
    const wrap = $('#map-nodes');
    this.sel = 0;
    this.btns = CHAPTERS.map((ch, i) => {
      const [x, y] = MAP_NODES[i];
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'map-node';
      b.style.left = `${x}px`; b.style.top = `${y}px`;
      b.style.setProperty('--c', byId(ch.emotion).colors.rim);
      b.textContent = ch.n;
      b.setAttribute('aria-label', `Chapter ${ch.n}: ${ch.english}, age ${ch.age}`);
      b.addEventListener('click', () => { b.blur(); if (this.sel === i) this.start(); else this.select(i); });
      b.addEventListener('mouseenter', () => this.select(i, true));
      const lbl = document.createElement('div');
      lbl.className = 'map-label'; lbl.style.left = `${x}px`; lbl.style.top = `${y + 34}px`;
      lbl.innerHTML = `${esc(ch.english)}<small>Age ${ch.age}</small>`;
      wrap.append(b, lbl);
      return b;
    });
  },
  enter(arg) {
    this.sel = arg && arg.focus != null ? clamp(arg.focus, 0, CHAPTERS.length - 1) : progress.nextIndex();
    this.refresh();
  },
  select(i, silent) {
    const n = clamp(i, 0, CHAPTERS.length - 1);
    if (n === this.sel) return;
    this.sel = n; this.refresh();
    if (!silent) sfx('move');
  },
  refresh() {
    const next = progress.nextIndex();
    this.btns.forEach((b, i) => {
      const ch = CHAPTERS[i], done = progress.isMastered(ch.id);
      b.classList.toggle('done', done);
      b.classList.toggle('locked', !progress.isUnlocked(i));
      b.classList.toggle('next', i === next && !done);
      b.classList.toggle('sel', i === this.sel);
    });
    const ch = CHAPTERS[this.sel], emo = byId(ch.emotion);
    $('#map-card').style.setProperty('--c', emo.colors.rim);
    $('#mc-eyebrow').textContent = `Chapter ${ch.n} · Age ${ch.age}`;
    $('#mc-dev').textContent = ch.dev;
    $('#mc-name').innerHTML = `${esc(ch.rasa)} <span>· ${esc(ch.english)}</span>`;
    $('#mc-tag').textContent = emo.tagline.split('·').pop().trim();
    $('#mc-src').innerHTML = ch.sources.map((s) => `<li><b>${esc(s.writer)}</b> · <i>${esc(s.work)}</i> <span>(${esc(s.year)}, ${esc(s.from)})</span></li>`).join('');
    const status = progress.isMastered(ch.id) ? 'Mastered · play again'
      : progress.isUnlocked(this.sel) ? 'Ready · press Enter'
        : `Locked · master ${CHAPTERS[this.sel - 1].rasa} first`;
    $('#mc-status').textContent = status;
    $('#map-count').textContent = `${progress.count()} of ${CHAPTERS.length} mastered`;
  },
  start() {
    if (!progress.isUnlocked(this.sel)) {
      sfx('deny');
      const b = this.btns[this.sel]; b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope');
      return;
    }
    sfx('pick');
    go('story', { chapter: this.sel + 1 });
  },
  key(code, act) {
    if (act === 'left' || act === 'up') this.select(this.sel - 1);
    else if (act === 'right' || act === 'down') this.select(this.sel + 1);
    else if (act === 'confirm') this.start();
    else if (act === 'back') { sfx('back'); go('title'); }
  },
  render(c) { drawMap(c, S.T, MAP_NODES, this.sel, CHAPTERS.map((ch) => progress.isMastered(ch.id)), CHAPTERS); },
};
