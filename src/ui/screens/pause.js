import { CPU_LEVELS } from '../../config.js';
import { S } from '../../state.js';
import { $, cap } from '../../engine/utils.js';
import { newMatch, newStoryMatch } from '../../engine/match.js';
import { Menu, menuKeys } from '../menu.js';
import { screens, go } from '../router.js';

screens.pause = {
  enter() {
    const M = S.match, ch = M.chapter;
    const items = ch
      ? [
        { label: 'Resume', run: () => go('fight', 'resume') },
        { label: 'Restart chapter', run: () => { S.match = newStoryMatch(ch); go('fight'); } },
        { label: 'Story map', run: () => go('map', { focus: ch.n - 1 }) },
        { label: 'Main menu', run: () => go('title') },
      ]
      : [
        { label: 'Resume', run: () => go('fight', 'resume') },
        { label: 'Restart match', run: () => { S.match = newMatch(); go('fight'); } },
        { label: 'Change fighters', run: () => go('select') },
        { label: 'Main menu', run: () => go('title') },
      ];
    this.menu = new Menu($('#pause-menu'), items);
    $('#pause-mode').textContent = ch ? `Story · Chapter ${ch.n} · ${ch.english}`
      : M.mode === 'cpu' ? `VS CPU · ${cap(CPU_LEVELS[M.cpuLevel].name)}` : M.mode === 'training' ? 'Training' : '2 Players';
  },
  key(code, act) {
    if (code === 'Escape' || code === 'KeyP' || act === 'back') { go('fight', 'resume'); return; }
    menuKeys(this.menu, act);
  },
  render(c) { S.match.render(c); },
};
