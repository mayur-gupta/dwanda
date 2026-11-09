# Dwandva

**द्वंद्व · a browser-based duel game about a life lived through nine emotions.**

In the Bhagavad Gita, *dvandva* means the pairs of opposites a person struggles with: pleasure and pain, gain and loss. In Dwandva, a boy named **Nayan** grows up chapter by chapter and duels the nine emotions of classical Indian aesthetics, the **Navarasa** from Bharata's *Natyashastra*.

Fighters are silhouettes drawn in code, and every sound is synthesised, so the game ships with no image or audio files.

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

`dist/` is a plain static site. It deploys to Vercel, Netlify, GitHub Pages or any web server (Vercel detects Vite automatically).

## Modes

- **Story:** Nayan's life in nine chapters, from age 6 to 75. Each chapter has story panels, a duel, and a reflection. Progress is saved in your browser, and each chapter unlocks the next.
- **VS CPU:** easy, normal or hard.
- **2 Players:** on the same keyboard.
- **Training:** the dummy's health refills, your Shakti meter is always full, and `` ` `` shows hitboxes.

All ten fighters are playable in VS and Training from the start.

## Story mode

Each chapter pairs an Indian source with a world source. Narration is original; quotations come only from public-domain works and are always credited.

| Ch. | Age | Rasa · emotion (traditional colour) | Arena | Indian source | World source |
|---|---|---|---|---|---|
| 1 | 6 | Bhayanaka · Fear (black) | Aangan at Night | Tagore, *The Hero* | Grimm, *The Youth Who Went Forth to Learn What Fear Was* |
| 2 | 9 | Hasya · Laughter (white) | Village Mela | Tenali Rama tales | Twain, *Tom Sawyer* |
| 3 | 12 | Adbhuta · Wonder (yellow) | Ramgiri Clouds | Kalidasa, *Meghaduta* | Carroll, *Alice in Wonderland* |
| 4 | 15 | Raudra · Anger (red) | Akhada | *Mahabharata*, Bhima's vow | Homer, *Iliad* |
| 5 | 17 | Bibhatsa · Disgust (blue) | Monsoon Rooftop | Kabir's dohas | Dickens, *Oliver Twist* |
| 6 | 21 | Shringara · Love (dark blue-green) | Lotus Garden | Kalidasa, *Shakuntala* | Shakespeare, *Romeo and Juliet* |
| 7 | 30 | Veera · Courage (gold) | Kurukshetra | *Bhagavad Gita* | Tennyson, *Ulysses* |
| 8 | 50 | Karuna · Sorrow (grey) | Ghat at Dusk | Valmiki, the krauncha birds | Chekhov, *Misery* |
| 9 | 75 | Shanta · Peace (moon-white) | The Old Pond | Tagore, *Gitanjali* | Bashō's haiku |

Nayan changes on screen as he ages: size, hair, a beard at 50, a stooped back at 75.

**Chapter 9 is different:** Peace never attacks and can't be hurt. You win by standing still near Shanta until the calm meter fills. Attacking costs calm.

### Adding or editing a chapter

Chapters live in `src/story/chapters.js`. Each one lists its age, emotion, arena, CPU level, sources, intro panels, the duel line, win panels and a loss line. Panel types are `scene` (narration, with `who`/`pose` for the figures shown) and `quote` (`text`, `by`, `work`, and optional `orig` for the original-language line).

## Controls

| Action        | Player 1 | Player 2                 |
| ------------- | -------- | ------------------------ |
| Move          | `A` `D`  | `←` `→`                  |
| Jump / Crouch | `W` `S`  | `↑` `↓`                  |
| Punch         | `F`      | `1` (numpad) or `,`      |
| Kick          | `G`      | `2` (numpad) or `.`      |
| Special       | `H`      | `3` (numpad) or `/`      |
| Block         | Hold away from your opponent | |

- **Low attacks:** crouch, then punch or kick. **Air attacks:** jump, then punch or kick.
- **Special:** costs one bar of the **Shakti** meter, which fills as you hit and get hit.
- `Esc` or `P` pauses, `M` mutes, and `` ` `` shows hitboxes.
- In solo modes, Player 1 can use either key set.

## Adding a fighter

1. Copy a file in `src/characters/` (for example `raudra.js`) and edit it. You only list what differs from the defaults in `src/characters/defaults.js`:

   ```js
   import { defineCharacter } from './defaults.js';

   export default defineCharacter({
     id: 'arjun',
     name: 'ARJUN',
     english: 'The archer',
     tagline: 'The archer · long reach',
     colors: { rim: '#4fa3ff', accent: '#ffd23d' },   // outline colour, headband/gloves colour
     alt: { rim: '#ff7ad9', accent: '#7affc8' },      // used in mirror matches
     look: { hair: 'topknot', headband: true, sash: true, aura: false, beard: false },
     body: { scale: 1.05, bulk: 1.0, stoop: 0 },      // size, limb thickness, forward lean
     stats: { power: 7, speed: 4, defense: 6 },       // 1–10
     moves: {
       kick: { damage: 80, startup: 8 },              // override any frame data
       special: { label: 'Storm arrow', projectile: 'spear', speed: 12 },
     },
   });
   ```

   - Hair styles: `short`, `topknot`, `ponytail`, `tuft`, `long`, `flame`, `horns`, `bald`.
   - Auras: `false`, `'light'` or `'dark'`.
   - Projectiles: `orb`, `ring`, `smoke`, `confetti`, `star`, `flame`, `shard`, `petal`, `spear`, `tear`, `lotus`.

2. Register it in `src/characters/index.js` and raise `ROSTER_SIZE` in `src/config.js` if needed.

**Move data** is counted in frames at 60 per second: `startup`, `active` (hit window), `recovery`, `hitstun` and `blockstun` (how long the opponent is stuck), `push` (knockback) and `radius` (size of the hit circle).

## Project structure

```
index.html                 Screen markup (menus, story panels, HUD)
src/
  main.js                  Entry: fonts, input, scaling, game loop
  config.js                Rules, controls, CPU levels
  state.js                 Shared state
  styles.css               All styling
  characters/              Nayan (at every age), the nine rasas, shared defaults
  stages/                  Nine arenas plus shared drawing helpers
  story/
    chapters.js            The nine chapters: text, quotes, sources, arenas
    progress.js            Saved story progress
  engine/                  Fighter, match rules, CPU, poses, drawing, particles, audio, input
  ui/
    router.js, hud.js, menu.js, scenes.js
    screens/               title, controls, select, stage-select, vs, fight, pause,
                           results, map (story map), story (story panels)
```

## Tech

HTML5 Canvas 2D for arenas, fighters and effects, HTML and CSS for menus and the HUD, the Web Audio API for sound, vanilla JavaScript ES modules, and Vite for the dev server and build. Fonts (Teko, Rozha One, Rajdhani) are bundled from npm via Fontsource. The game loop runs at a fixed 60 Hz, with frame-counted move data, input buffering and hit-stop.
