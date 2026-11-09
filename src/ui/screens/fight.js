import { S } from '../../state.js';
import { HUD } from '../hud.js';
import { screens, go } from '../router.js';

screens.fight = {
  enter(arg) {
    if (!S.match) { go('title'); return; }
    if (arg !== 'resume') HUD.setup(S.match);
  },
  key(code) { if (code === 'Escape' || code === 'KeyP') go('pause'); },
  update() {
    S.match.update();
    if (S.current === 'fight') HUD.sync(S.match);
  },
  render(c) { S.match.render(c); },
};
