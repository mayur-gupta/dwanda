// Story progress, saved in this browser. Losing it (private browsing, cleared storage) only resets the map.
import { CHAPTERS } from './chapters.js';

const KEY = 'dwanda.story.v1';

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || '{}');
    return { mastered: Array.isArray(d.mastered) ? d.mastered : [] };
  } catch (e) { return { mastered: [] }; }
}

let data = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* storage unavailable */ } }

export const progress = {
  isMastered(id) { return data.mastered.includes(id); },
  master(id) { if (!this.isMastered(id)) { data.mastered.push(id); save(); } },
  isUnlocked(i) { return i === 0 || this.isMastered(CHAPTERS[i - 1].id); },
  nextIndex() { const i = CHAPTERS.findIndex((c) => !this.isMastered(c.id)); return i === -1 ? CHAPTERS.length - 1 : i; },
  count() { return CHAPTERS.filter((c) => this.isMastered(c.id)).length; },
  reset() { data = { mastered: [] }; save(); },
};
