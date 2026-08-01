export class SecretEngine {
  constructor({ memory, achievements, universe, particles, audio }) {
    this.memory = memory;
    this.achievements = achievements;
    this.universe = universe;
    this.particles = particles;
    this.audio = audio;
    this.constellationProgress = [];
    this.requiredOrder = ["c1", "c2", "c3", "c4"];
  }

  unlock(key, payload) {
    const firstTime = this.memory.discover(key);

    if (firstTime) {
      this.achievements.show(payload);
    }

    window.dispatchEvent(new CustomEvent("secretunlocked", {
      detail: { key, firstTime }
    }));

    return firstTime;
  }

  registerConstellationPoint(id) {
    const expected = this.requiredOrder[this.constellationProgress.length];

    if (id === expected) {
      this.constellationProgress.push(id);
    } else {
      this.constellationProgress = id === this.requiredOrder[0] ? [id] : [];
    }

    window.dispatchEvent(new CustomEvent("constellationprogress", {
      detail: {
        current: [...this.constellationProgress],
        total: this.requiredOrder.length
      }
    }));

    if (this.constellationProgress.length === this.requiredOrder.length) {
      this.constellationProgress = [];
      this.unlock("constellation", {
        icon: "✧",
        title: "Constelación encontrada",
        text: "Uniste las estrellas que estaban esperando por ti."
      });
      return true;
    }

    return false;
  }
}
