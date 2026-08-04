export class Timeline {
  constructor() {
    this.entries = [];
    this.startedAt = 0;
    this.raf = null;
  }

  add(time, action) {
    this.entries.push({ time, action, fired: false });
    this.entries.sort((a, b) => a.time - b.time);
    return this;
  }

  play() {
    this.startedAt = performance.now();

    const tick = now => {
      const elapsed = now - this.startedAt;

      for (const entry of this.entries) {
        if (!entry.fired && elapsed >= entry.time) {
          entry.fired = true;
          entry.action();
        }
      }

      if (this.entries.some(entry => !entry.fired)) {
        this.raf = requestAnimationFrame(tick);
      }
    };

    this.raf = requestAnimationFrame(tick);
  }

  reset() {
    cancelAnimationFrame(this.raf);
    this.entries.forEach(entry => entry.fired = false);
  }
}
