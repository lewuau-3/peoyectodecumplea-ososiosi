export class ParticleEngine {
  burst(x, y, count = 14, symbol = "✦") {
    const safeCount = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : count;

    for (let i = 0; i < safeCount; i++) {
      const p = document.createElement("span");
      p.className = "v4-particle";
      p.textContent = symbol;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.setProperty("--x", `${(Math.random() - .5) * 170}px`);
      p.style.setProperty("--y", `${(Math.random() - .5) * 170}px`);
      p.style.setProperty("--r", `${(Math.random() - .5) * 130}deg`);
      p.style.animationDelay = `${Math.random() * 120}ms`;
      document.body.append(p);
      p.addEventListener("animationend", () => p.remove(), { once: true });
    }
  }

  trail(x, y) {
    const p = document.createElement("span");
    p.className = "finger-trail";
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    document.body.append(p);
    p.addEventListener("animationend", () => p.remove(), { once: true });
  }
}
