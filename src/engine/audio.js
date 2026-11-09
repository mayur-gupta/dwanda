// Tiny WebAudio synth. Every sound is generated in code, so there are no audio files.
import { G } from '../state.js';

let AC = null, MASTER = null, NOISE = null;
const VOLUME = 0.45;

export function ensureAudio() {
  if (AC) { if (AC.state === 'suspended') AC.resume().catch(() => {}); return; }
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    MASTER = AC.createGain();
    MASTER.gain.value = G.muted ? 0 : VOLUME;
    MASTER.connect(AC.destination);
    const len = Math.floor(AC.sampleRate * 0.6);
    NOISE = AC.createBuffer(1, len, AC.sampleRate);
    const d = NOISE.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  } catch (err) { AC = null; }
}

export function applyMute() { if (MASTER) MASTER.gain.value = G.muted ? 0 : VOLUME; }

function tone(freq, dur, type = 'sine', vol = 0.3, to = null, delay = 0) {
  const t0 = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(MASTER);
  o.start(t0); o.stop(t0 + dur + 0.03);
}

function noise(dur, vol = 0.3, freq = 1200, type = 'bandpass', delay = 0) {
  const t0 = AC.currentTime + delay, s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
  s.buffer = NOISE; f.type = type; f.frequency.value = freq; f.Q.value = 0.8;
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  s.connect(f).connect(g).connect(MASTER);
  s.start(t0); s.stop(t0 + dur + 0.03);
}

const SFX = {
  light: () => { noise(0.07, 0.45, 2200); tone(190, 0.08, 'sine', 0.45, 90); },
  heavy: () => { noise(0.13, 0.55, 1100); tone(130, 0.15, 'sine', 0.6, 50); },
  special: () => { noise(0.22, 0.5, 700); tone(100, 0.28, 'triangle', 0.55, 40); },
  block: () => { tone(1100, 0.05, 'square', 0.1, 600); noise(0.05, 0.25, 5000, 'highpass'); },
  whoosh: () => noise(0.09, 0.12, 900),
  charge: () => tone(260, 0.2, 'sawtooth', 0.08, 700),
  cast: () => { tone(520, 0.18, 'triangle', 0.18, 180); noise(0.18, 0.15, 1500); },
  jump: () => tone(280, 0.07, 'sine', 0.1, 480),
  thud: () => { tone(70, 0.22, 'sine', 0.65, 38); noise(0.16, 0.35, 380, 'lowpass'); },
  ko: () => { tone(82, 1.0, 'sine', 0.7, 36); noise(0.6, 0.4, 260, 'lowpass'); tone(330, 0.8, 'triangle', 0.12, 160, 0.05); },
  gong: () => { [174, 348, 522, 870].forEach((f, i) => tone(f, 1.8 - i * 0.35, 'sine', 0.22 / (i + 1))); noise(0.05, 0.2, 3000, 'highpass'); },
  tick: () => tone(1400, 0.03, 'square', 0.05),
  pip: () => { tone(880, 0.12, 'sine', 0.15); tone(1320, 0.2, 'sine', 0.1, null, 0.08); },
  move: () => tone(620, 0.035, 'square', 0.045),
  pick: () => { tone(520, 0.06, 'square', 0.07); tone(780, 0.1, 'square', 0.07, null, 0.06); },
  back: () => tone(360, 0.07, 'square', 0.06, 220),
  deny: () => tone(140, 0.12, 'square', 0.08, 110),
  vs: () => { tone(60, 0.5, 'sine', 0.7, 40); noise(0.3, 0.4, 200, 'lowpass'); tone(196, 1.2, 'sine', 0.12, null, 0.25); },
  win: () => { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.35, 'triangle', 0.1, null, i * 0.11)); },
};

export function sfx(name) {
  if (!AC || G.muted || !SFX[name]) return;
  try { SFX[name](); } catch (e) { /* audio is optional */ }
}
