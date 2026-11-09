// Defaults every fighter inherits. A character file only lists what differs.

// Frame data is in 60 fps ticks. radius = size of the strike hit circle.
// limb = which body point strikes (handF = front fist, footF = front foot).
export const DEFAULT_MOVES = {
  punch:    { label: 'Punch',      damage: 45,  startup: 4,  active: 3, recovery: 9,  hitstun: 17, blockstun: 10, push: 4, radius: 17, limb: 'handF', sfx: 'light' },
  kick:     { label: 'Kick',       damage: 70,  startup: 7,  active: 4, recovery: 14, hitstun: 19, blockstun: 13, push: 7, radius: 20, limb: 'footF', sfx: 'heavy' },
  lowPunch: { label: 'Low punch',  damage: 35,  startup: 4,  active: 3, recovery: 8,  hitstun: 16, blockstun: 9,  push: 3, radius: 16, limb: 'handF', sfx: 'light' },
  sweep:    { label: 'Sweep',      damage: 60,  startup: 8,  active: 4, recovery: 17, hitstun: 22, blockstun: 12, push: 6, radius: 20, limb: 'footF', sfx: 'heavy', launch: true },
  airPunch: { label: 'Air punch',  damage: 40,  startup: 3,  active: 6, recovery: 6,  hitstun: 16, blockstun: 10, push: 4, radius: 17, limb: 'handF', sfx: 'light' },
  airKick:  { label: 'Air kick',   damage: 60,  startup: 5,  active: 8, recovery: 8,  hitstun: 19, blockstun: 12, push: 6, radius: 21, limb: 'footF', sfx: 'heavy' },
  special:  { label: 'Energy orb', damage: 100, cost: 50, startup: 12, active: 1, recovery: 20, hitstun: 22, blockstun: 16, push: 9, radius: 22, speed: 9, projectile: 'orb', sfx: 'special' },
};

export const DEFAULT_CHARACTER = {
  id: 'fighter',
  name: 'FIGHTER',
  tagline: '',
  placeholder: false,
  colors: { rim: '#ffc23d', accent: '#ff4b33', ink: '#120d1a', inkBack: '#2b2339' },
  alt: { rim: '#9d8cff', accent: '#4fe0d0' },          // used when both players pick the same fighter
  look: { hair: 'short', headband: true, sash: true },  // hair: short | topknot | ponytail
  body: { scale: 1, bulk: 1 },                          // overall size and limb thickness
  stats: { power: 5, speed: 5, defense: 5 },            // 1–10, shown as bars on the select screen
  moves: {},
  poses: {},                                            // optional per-move { windup, strike } overrides
};

export function deepMerge(t, s) {
  for (const k in s) {
    const v = s[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) t[k] = deepMerge(t[k] && typeof t[k] === 'object' ? t[k] : {}, v);
    else t[k] = v;
  }
  return t;
}

export function defineCharacter(c) {
  const base = deepMerge({}, DEFAULT_CHARACTER);
  const moves = deepMerge(deepMerge({}, DEFAULT_MOVES), c.moves || {});
  return deepMerge(base, Object.assign({}, c, { moves }));
}

// Turns 1–10 stats into physics and damage numbers.
export function derive(ch) {
  const s = ch.stats;
  return {
    walk: 2.6 + s.speed * 0.28,
    jumpV: 15.5 + s.speed * 0.15,
    airX: 3 + s.speed * 0.22,
    power: 0.75 + s.power * 0.05,
    defense: 0.75 + s.defense * 0.05,
    maxHp: 1000,
  };
}
