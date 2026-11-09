// Keyboard- and mouse-driven menu list. Items: { label, sub?, run() } or { label, adjust(dir), value() }.
import { sfx } from '../engine/audio.js';

export class Menu {
  constructor(el, items) {
    this.el = el; this.items = items; this.i = 0;
    el.innerHTML = '';
    this.btns = items.map((it, idx) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'mi';
      b.innerHTML = `<span class="mi-l">${it.label}</span>`
        + (it.sub ? `<small>${it.sub}</small>` : '')
        + (it.adjust ? '<span class="mi-v"><em>◀</em><b></b><em>▶</em></span>' : '');
      b.addEventListener('click', (e) => {
        this.focus(idx, true); b.blur();
        if (it.adjust) { const r = b.getBoundingClientRect(); this.adjust(e.clientX < r.left + r.width * 0.75 ? -1 : 1); }
        else this.activate();
      });
      b.addEventListener('mouseenter', () => this.focus(idx, true));
      el.appendChild(b);
      return b;
    });
    this.refresh();
    this.focus(0, true);
  }
  focus(i, silent) {
    this.i = (i + this.items.length) % this.items.length;
    this.btns.forEach((b, k) => b.classList.toggle('focused', k === this.i));
    if (!silent) sfx('move');
  }
  move(d) { this.focus(this.i + d); }
  adjust(d) { const it = this.items[this.i]; if (it.adjust) { it.adjust(d); this.refresh(); sfx('move'); } }
  activate() { const it = this.items[this.i]; if (it.adjust) { this.adjust(1); return; } sfx('pick'); it.run(); }
  refresh() { this.items.forEach((it, k) => { if (it.value) this.btns[k].querySelector('.mi-v b').textContent = it.value(); }); }
}

// Maps menu actions to a Menu. horizontal = left/right move between items.
export function menuKeys(menu, act, horizontal) {
  if (act === 'up' || (horizontal && act === 'left')) menu.move(-1);
  else if (act === 'down' || (horizontal && act === 'right')) menu.move(1);
  else if (act === 'left') menu.adjust(-1);
  else if (act === 'right') menu.adjust(1);
  else if (act === 'confirm') menu.activate();
}
