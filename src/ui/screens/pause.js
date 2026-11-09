import { CPU_LEVELS } from '../../config.js';
import { S } from '../../state.js';
import { $, cap } from '../../engine/utils.js';
import { newMatch } from '../../engine/match.js';
import { Menu, menuKeys } from '../menu.js';
import { screens, go } from '../router.js';

screens.pause = {
  init() {
    this.menu = new Menu($('#pause-menu'), [
      { label: 'Resume', run: () => go('fight', 'resume') },
      { label: 'Restart match', run: () => { S.match = newMatch(); go('fight'); } },
      { label: 'Change fighters', run: () => go('select') },
      { label: 'Main menu', run: () => go('title') },
    ]);
  },
  enter() {
    this.menu.focus(0, true);
    const M = S.match;
    $('#pause-mode').textContent = M.mode === 'cpu' ? `VS CPU · ${cap(CPU_LEVELS[M.cpuLevel].name)}` : M.mode === 'training' ? 'Training' : '2 Players';
  },
  key(code, act) {
    if (code === 'Escape' || code === 'KeyP' || act === 'back') { go('fight', 'resume'); return; }
    menuKeys(this.menu, act);
  },
  render(c) { S.match.render(c); },
};
