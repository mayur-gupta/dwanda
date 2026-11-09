import { ROUNDS_TO_WIN, CPU_LEVELS } from '../../config.js';
import { S } from '../../state.js';
import { $, cap } from '../../engine/utils.js';
import { sfx } from '../../engine/audio.js';
import { screens, go } from '../router.js';
import { drawVS } from '../scenes.js';

screens.vs = {
  enter() {
    this.t = 0;
    const M = S.match;
    $('#vs-n1').textContent = M.chars[0].name;
    $('#vs-n2').textContent = M.chars[1].name;
    $('#vs-s1').textContent = '1P';
    $('#vs-s2').textContent = M.mode === 'cpu' ? `CPU · ${cap(CPU_LEVELS[M.cpuLevel].name)}` : M.mode === 'training' ? 'Training dummy' : '2P';
    $('#vs-stage').textContent = `${M.stage.name} · ${M.mode === 'training' ? 'Training' : 'Best of ' + (ROUNDS_TO_WIN * 2 - 1)}`;
    sfx('vs');
  },
  update() { if (++this.t >= 150) go('fight'); },
  key(code, act) {
    if (act === 'confirm' && this.t > 20) go('fight');
    else if (act === 'back') { sfx('back'); go('stage'); }
  },
  render(c) { drawVS(c, S.match, this.t); },
};
