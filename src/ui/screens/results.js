import { S } from '../../state.js';
import { $ } from '../../engine/utils.js';
import { sfx } from '../../engine/audio.js';
import { POSES, idlePose, lerpPose } from '../../engine/poses.js';
import { newMatch } from '../../engine/match.js';
import { Menu, menuKeys } from '../menu.js';
import { screens, go } from '../router.js';
import { drawResults } from '../scenes.js';

screens.results = {
  init() {
    this.menu = new Menu($('#res-menu'), [
      { label: 'Rematch', run: () => { S.match = newMatch(); go('vs'); } },
      { label: 'Change fighters', run: () => go('select') },
      { label: 'Main menu', run: () => go('title') },
    ]);
  },
  enter() {
    const M = S.match, w = M.winner, s0 = M.stats[0], s1 = M.stats[1];
    this.t = 0;
    this.pose = Object.assign({}, POSES.idle);
    $('#res-title').textContent = w === -1 ? 'Draw game' : `${M.chars[w].name} wins`;
    const perf = w >= 0 && M.perfects[w] ? ` · ${M.perfects[w]} perfect round${M.perfects[w] > 1 ? 's' : ''}` : '';
    $('#res-sub').textContent = `Rounds ${M.wins[0]}–${M.wins[1]} on ${M.stage.name}${perf}`;
    const oppTag = M.mode === 'cpu' ? 'CPU' : '2P';
    $('#res-h1').innerHTML = `<small>1P</small><b>${M.chars[0].name}</b>`;
    $('#res-h2').innerHTML = `<small>${oppTag}</small><b>${M.chars[1].name}</b>`;
    const rows = [
      ['Rounds won', M.wins[0], M.wins[1]],
      ['Damage dealt', s0.damage, s1.damage],
      ['Hits landed', s0.hits, s1.hits],
      ['Best combo', s0.bestCombo, s1.bestCombo],
      ['Specials thrown', s0.specials, s1.specials],
      ['Attacks blocked', s0.blocked, s1.blocked],
    ];
    $('#res-body').innerHTML = rows.map(([l, a, b]) => `<tr><td>${l}</td><td class="${a > b ? 'best' : ''}">${a}</td><td class="${b > a ? 'best' : ''}">${b}</td></tr>`).join('');
    this.menu.focus(0, true);
    sfx('win');
  },
  update() {
    this.t++;
    if (S.match.winner !== -1) lerpPose(this.pose, this.t > 14 ? POSES.win : idlePose(S.T), 0.15);
  },
  key(code, act) { menuKeys(this.menu, act, true); },
  render(c) { drawResults(c, S.match, this.pose, this.t); },
};
