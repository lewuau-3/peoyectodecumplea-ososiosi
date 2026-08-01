const STORAGE_KEY = "same-sky-directors-cut-v4";

export class MemoryEngine {
  constructor() {
    this.state = this.load();
  }

  load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        visits: 0,
        discoveries: {},
        completed: false,
        lastVisit: null
      };
    } catch {
      return {
        visits: 0,
        discoveries: {},
        completed: false,
        lastVisit: null
      };
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {}
  }

  beginVisit() {
    this.state.visits = (this.state.visits || 0) + 1;
    this.state.lastVisit = new Date().toISOString();
    this.save();
    return this.state.visits;
  }

  discover(key, value = true) {
    const already = Boolean(this.state.discoveries?.[key]);
    this.state.discoveries = this.state.discoveries || {};
    this.state.discoveries[key] = value;
    this.save();
    return !already;
  }

  has(key) {
    return Boolean(this.state.discoveries?.[key]);
  }

  countDiscoveries() {
    return Object.values(this.state.discoveries || {}).filter(Boolean).length;
  }

  complete() {
    this.state.completed = true;
    this.save();
  }
}
