// Story panels: title card, narration, quotes, the duel, and what follows it.
import { CHAPTERS } from '../../story/chapters.js';
import { progress } from '../../story/progress.js';
import { byId } from '../../characters/index.js';
import { S } from '../../state.js';
import { $ } from '../../engine/utils.js';
import { sfx } from '../../engine/audio.js';
import { newStoryMatch } from '../../engine/match.js';
import { screens, go } from '../router.js';
import { drawStoryScene } from '../scenes.js';

const TYPE_SPEED = 1.5;   // characters per tick
const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const lines = (s) => esc(s).split(' / ').join('<br>');

screens.story = {
  enter(arg) {
    if (arg && arg.chapter) { this.ch = CHAPTERS[arg.chapter - 1]; this.phase = 'intro'; }
    else if (arg && arg.result) {
      this.phase = arg.result;
      if (arg.result === 'win') progress.master(this.ch.id);
    }
    const ch = this.ch, emo = byId(ch.emotion);
    this.emo = emo;
    $('#scr-story').style.setProperty('--c', emo.colors.rim);
    $('#st-chapter').textContent = `Chapter ${ch.n} · Age ${ch.age}`;
    $('#st-rasa').textContent = ch.dev;
    this.panels = this.build();
    this.i = 0;
    this.show();
  },

  build() {
    const ch = this.ch;
    if (this.phase === 'intro') return [{ type: 'title' }, ...ch.intro, { type: 'duel', ...ch.duel }];
    if (this.phase === 'win') return ch.win.some((p) => p.type === 'end') ? [{ type: 'mastered' }, ...ch.win] : [...ch.win, { type: 'mastered' }];
    return [{ type: 'lose', text: ch.lose }];
  },

  show() {
    const p = this.panels[this.i], ch = this.ch;
    this.p = p; this.t = 0; this.typed = 0; this.full = '';
    const on = (id, v) => $(id).classList.toggle('on', v);
    on('#st-title', p.type === 'title' || p.type === 'end');
    on('#st-quote', p.type === 'quote');
    on('#st-box', ['scene', 'duel', 'lose', 'mastered'].includes(p.type));
    on('#st-stamp', p.type === 'mastered');
    $('#st-line').classList.remove('on');

    if (p.type === 'title') {
      const [a, b] = ch.sources;
      $('#t-dev').textContent = ch.dev;
      $('#t-name').textContent = ch.rasa;
      $('#t-en').textContent = ch.english;
      $('#t-src').innerHTML = `Inspired by <b>${esc(a.writer)}</b>, <i>${esc(a.work)}</i> (${esc(a.year)}) and <b>${esc(b.writer)}</b>, <i>${esc(b.work)}</i> (${esc(b.year)})`;
    } else if (p.type === 'end') {
      $('#t-dev').textContent = 'समाप्त';
      $('#t-name').textContent = 'The End';
      $('#t-en').textContent = 'All nine rasas mastered';
      $('#t-src').textContent = "Thank you for living Nayan's life with him.";
    } else if (p.type === 'quote') {
      $('#q-orig').textContent = p.orig || '';
      $('#q-orig').style.display = p.orig ? '' : 'none';
      $('#q-text').innerHTML = lines(p.text);
      $('#q-cite').innerHTML = `<b>${esc(p.by)}</b> · ${esc(p.work)}${p.rendering ? ' · English rendering for Dwandva' : ''}`;
    } else {
      const speaker = p.type === 'duel' ? `${this.emo.name} · ${ch.english}` : '';
      $('#st-speaker').textContent = speaker;
      $('#st-speaker').style.display = speaker ? '' : 'none';
      this.full = p.type === 'mastered'
        ? (ch.n < CHAPTERS.length ? `${ch.rasa} is part of Nayan now, and goes with him into the next chapter of his life.` : 'Nayan has met all nine rasas.')
        : p.text;
      $('#st-text').textContent = '';
      $('#st-line').textContent = p.type === 'duel' ? `“${p.line}”` : '';
      $('#st-stamp-sub').textContent = `${ch.dev} · ${ch.english}`;
    }

    const hint = p.type === 'lose' ? '<span><kbd>Enter</kbd> try again</span><span><kbd>Esc</kbd> story map</span>'
      : p.type === 'duel' ? '<span><kbd>Enter</kbd> fight</span>'
        : this.phase === 'intro' ? '<span><kbd>Enter</kbd> continue</span><span><kbd>Esc</kbd> skip to the fight</span>'
          : '<span><kbd>Enter</kbd> continue</span>';
    $('#st-hint').innerHTML = hint;
  },

  typing() { return this.full && this.typed < this.full.length; },
  finishTyping() {
    this.typed = this.full.length;
    $('#st-text').textContent = this.full;
    if (this.p.type === 'duel') $('#st-line').classList.add('on');
  },

  update() {
    this.t++;
    if (this.typing()) {
      const before = Math.floor(this.typed);
      this.typed = Math.min(this.full.length, this.typed + TYPE_SPEED);
      if (Math.floor(this.typed) !== before) $('#st-text').textContent = this.full.slice(0, Math.floor(this.typed));
      if (!this.typing()) this.finishTyping();
    }
  },

  next() {
    this.i++;
    if (this.i < this.panels.length) { sfx('move'); this.show(); return; }
    if (this.phase === 'win') go('map', { focus: Math.min(this.ch.n, CHAPTERS.length - 1) });
    else this.fight();
  },

  fight() { sfx('pick'); S.match = newStoryMatch(this.ch); go('fight'); },

  key(code, act) {
    if (act === 'confirm') {
      if (this.typing()) this.finishTyping();
      else if (this.p.type === 'lose') this.fight();
      else this.next();
    } else if (act === 'back') {
      if (this.phase === 'intro') this.fight();
      else { sfx('back'); go('map', { focus: this.ch.n - 1 }); }
    }
  },

  render(c) { drawStoryScene(c, this.ch, this.p, this.t); },
};
