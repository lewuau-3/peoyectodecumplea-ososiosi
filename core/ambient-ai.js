export class AmbientAI {
  constructor({ universe, particles, memory }) {
    this.universe = universe;
    this.particles = particles;
    this.memory = memory;
    this.running = true;
  }

  start() {
    const loop = () => {
      if (!this.running) return;

      const visitBoost = Math.min(2500, (this.memory.state.visits || 1) * 280);
      const delay = 6500 + Math.random() * 8500 - visitBoost;

      setTimeout(() => {
        const roll = Math.random();

        if (roll < .5) {
          this.universe.meteor(false);
        } else if (roll < .72) {
          document.body.classList.add("constellation-pulse");
          setTimeout(() => document.body.classList.remove("constellation-pulse"), 2800);
        } else if (roll < .9) {
          document.body.classList.add("aurora-pulse");
          setTimeout(() => document.body.classList.remove("aurora-pulse"), 2800);
        } else {
          const x = innerWidth * (.2 + Math.random() * .6);
          const y = innerHeight * (.2 + Math.random() * .5);
          this.particles.burst(x, y, 5, "✦");
        }

        loop();
      }, Math.max(4000, delay));
    };

    loop();
  }

  stop() {
    this.running = false;
  }
}
