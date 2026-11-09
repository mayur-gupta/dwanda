import { $ } from '../../engine/utils.js';
import { sfx } from '../../engine/audio.js';
import { screens, go } from '../router.js';
import { drawTitleScene } from '../scenes.js';

screens.controls = {
  init() {
    $('#ctl-back').addEventListener('click', (e) => { e.currentTarget.blur(); sfx('back'); go('title'); });
  },
  key(code, act) { if (act === 'back' || act === 'confirm') { sfx('back'); go('title'); } },
  render(c) { drawTitleScene(c, 0.72); },
};
