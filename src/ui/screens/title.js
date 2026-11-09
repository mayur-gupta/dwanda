import { GAME, ROSTER_SIZE, CPU_LEVELS } from '../../config.js';
import { CHARACTERS } from '../../characters/index.js';
import { STAGES } from '../../stages/index.js';
import { G } from '../../state.js';
import { $ } from '../../engine/utils.js';
import { Menu, menuKeys } from '../menu.js';
import { screens, go, startSelect } from '../router.js';
import { drawTitleScene } from '../scenes.js';

screens.title = {
  init() {
    $('#logo').textContent = GAME.title;
    $('#native-title').textContent = GAME.native;
    $('#tagline').textContent = GAME.tagline;
    $('#roster-count').textContent = `Roster ${CHARACTERS.length} / ${ROSTER_SIZE}`;
    $('#arena-count').textContent = `${STAGES.length} arenas`;
    $('#build').textContent = `Build ${GAME.build}`;
    this.menu = new Menu($('#title-menu'), [
      { label: 'Story', sub: "Nayan's life", run: () => go('map') },
      { label: 'VS CPU', sub: '1 player', run: () => startSelect('cpu') },
      { label: '2 Players', sub: 'Same keyboard', run: () => startSelect('versus') },
      { label: 'Training', sub: 'Practise moves', run: () => startSelect('training') },
      { label: 'CPU level', adjust: (d) => { G.cpuLevel = (G.cpuLevel + d + CPU_LEVELS.length) % CPU_LEVELS.length; }, value: () => CPU_LEVELS[G.cpuLevel].name },
      { label: 'Controls', run: () => go('controls') },
    ]);
  },
  enter() { this.menu.refresh(); },
  key(code, act) { menuKeys(this.menu, act); },
  render(c) { drawTitleScene(c, 0); },
};
