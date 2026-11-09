# Dwandva

**द्वंद्व · a browser-based two-player duel game.**

Two fighters, one arena, best of three rounds. You can play against the CPU, against a friend on the same keyboard, or in a training mode. Fighters are silhouettes drawn in code, and every sound is synthesised, so the game ships with no image or audio files.

> Status: build 0.2. The engine, screens and arenas are done. The roster has two placeholder fighters (PROTO A and PROTO B) while real characters are added one by one.

## Quick start

You need **Node.js 20.19 or newer**.

```bash
npm install
npm run dev        # starts the dev server and opens the game in your browser
```

| Command           | What it does                                              |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Dev server with instant reload at http://localhost:5173   |
| `npm run build`   | Production build into `dist/`                             |
| `npm run preview` | Serves the production build locally to check it           |

`dist/` is a plain static site. You can host it on GitHub Pages, Netlify, Vercel or any web server.

## Controls

| Action        | Player 1 | Player 2                 |
| ------------- | -------- | ------------------------ |
| Move          | `A` `D`  | `←` `→`                  |
| Jump / Crouch | `W` `S`  | `↑` `↓`                  |
| Punch         | `F`      | `1` (numpad) or `,`      |
| Kick          | `G`      | `2` (numpad) or `.`      |
| Special       | `H`      | `3` (numpad) or `/`      |
| Block         | Hold away from your opponent | |

- **Low attacks:** crouch, then punch or kick.
- **Air attacks:** jump, then punch or kick.
- **Special:** costs one bar of the **Shakti** meter, which fills as you hit and get hit.
- `Esc` or `P` pauses, `M` mutes, and `` ` `` shows hitboxes.
- In VS CPU and Training, Player 1 can use either key set.

## Adding a character

1. Copy `src/characters/proto-a.js` to a new file, for example `src/characters/arjun.js`.
2. Edit it. You only list what differs from the defaults in `src/characters/defaults.js`:

   ```js
   import { defineCharacter } from './defaults.js';

   export default defineCharacter({
     id: 'arjun',
     name: 'ARJUN',
     tagline: 'Archer turned brawler · long reach',
     colors: { rim: '#4fa3ff', accent: '#ffd23d' },  // outline colour, headband/gloves colour
     alt: { rim: '#ff7ad9', accent: '#7affc8' },     // used in mirror matches
     look: { hair: 'topknot', headband: true, sash: true },
     body: { scale: 1.05, bulk: 1.0 },               // size, limb thickness
     stats: { power: 7, speed: 4, defense: 6 },      // 1–10
     moves: {
       kick: { damage: 80, startup: 8 },             // override any frame data
       special: { label: 'Storm arrow', projectile: 'ring', speed: 12 },
     },
   });
   ```

3. Register it in `src/characters/index.js`:

   ```js
   import arjun from './arjun.js';
   export const CHARACTERS = [protoA, protoB, arjun];
   ```

The roster grid, previews, HUD portrait, VS splash and results screen all pick the new fighter up automatically. Use **Training** with `` ` `` to see hitboxes while you tune the numbers.

**Move data** is counted in frames at 60 per second: `startup` (before the hit), `active` (hit window), `recovery` (after), `hitstun` and `blockstun` (how long the opponent is stuck), `push` (knockback), `radius` (size of the hit circle). You can also override poses per move with `poses: { kick: { windup: mk(...), strike: mk(...) } }`; see `src/engine/poses.js`.

## Project structure

```
index.html                 Screen markup (menus and HUD)
src/
  main.js                  Entry: fonts, input, scaling, game loop
  config.js                Rules, controls, CPU levels
  state.js                 Shared state (current screen, match, settings)
  styles.css               All styling
  characters/
    defaults.js            Default moves and stats, defineCharacter()
    index.js               The roster list
    proto-a.js, proto-b.js Placeholder fighters
  stages/
    art.js                 Drawing helpers (temples, trees, skylines…)
    akhada.js, ghat.js, rooftop.js
    index.js               Arena list and background cache
  engine/
    fighter.js             Fighter state, physics, attacks, animation
    match.js               Rounds, timer, hit detection, KO
    cpu.js                 CPU opponent
    poses.js               Skeleton poses and forward kinematics
    draw.js                Fighter, projectile and portrait drawing
    fx.js                  Particles
    audio.js               WebAudio sound effects
    input.js               Keyboard state
    utils.js
  ui/
    router.js              Screen switching
    hud.js                 Fight HUD
    menu.js                Menu lists
    scenes.js              Canvas backdrops for menu screens
    screens/               title, controls, select, stage-select, vs, fight, pause, results
```

## Tech

- **HTML5 Canvas 2D** for arenas, fighters, projectiles and particles. Fighters are a jointed skeleton posed by angles and blended between poses.
- **HTML + CSS** for menus and the HUD.
- **Web Audio API** for synthesised sound effects.
- **Vanilla JavaScript (ES modules)**, with no game framework.
- **Vite** for the dev server and build. Fonts (Teko, Rozha One, Rajdhani) are bundled from npm via Fontsource, so the game works offline.
- **Fixed 60 Hz game loop** with frame-counted move data, input buffering and hit-stop.
