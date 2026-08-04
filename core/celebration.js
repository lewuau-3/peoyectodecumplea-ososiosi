export class CelebrationEngine {
  constructor({ universe, particles, audio }) {
    this.universe = universe;
    this.particles = particles;
    this.audio = audio;
  }

  confetti({ count = 46 } = {}) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      piece.className = "celebration-confetti";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.setProperty("--fall", `${85 + Math.random() * 35}vh`);
      piece.style.setProperty("--drift", `${(Math.random() - .5) * 12}rem`);
      piece.style.setProperty("--rotate", `${360 + Math.random() * 720}deg`);
      piece.style.setProperty("--delay", `${Math.random() * 900}ms`);
      piece.style.setProperty("--duration", `${3.8 + Math.random() * 2.4}s`);
      document.body.append(piece);
      piece.addEventListener("animationend", () => piece.remove(), { once: true });
    }
  }

  starRain() {
    this.universe.meteor(true);
    setTimeout(() => this.universe.meteor(true), 900);
    setTimeout(() => this.universe.meteor(true), 1800);
  }

  finaleBurst() {
    this.starRain();
    this.confetti({ count: 58 });

    const x = innerWidth / 2;
    const y = innerHeight * .46;
    this.particles.burst(x, y, 32, "✦");
  }
}
