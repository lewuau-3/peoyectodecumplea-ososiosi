export class StarField {
  constructor(canvas, count, depth, tint = [230, 244, 255]) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.count = count;
    this.depth = depth;
    this.tint = tint;
    this.stars = [];
    this.pointer = { x: 0, y: 0 };
    this.mood = "sleeping";
    this.running = true;

    this.resize();
    this.create();
    this.bind();
    this.draw();
  }

  bind() {
    addEventListener("resize", () => {
      this.resize();
      this.create();
    }, { passive: true });

    addEventListener("pointermove", event => {
      this.pointer.x = (event.clientX / innerWidth - .5) * 2;
      this.pointer.y = (event.clientY / innerHeight - .5) * 2;
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      this.running = !document.hidden;
      if (this.running) this.draw();
    });
  }

  resize() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    this.canvas.width = innerWidth * ratio;
    this.canvas.height = innerHeight * ratio;
    this.canvas.style.width = `${innerWidth}px`;
    this.canvas.style.height = `${innerHeight}px`;
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  create() {
    this.stars = Array.from({ length: this.count }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: .3 + Math.random() * 1.8,
      alpha: .18 + Math.random() * .75,
      phase: Math.random() * Math.PI * 2,
      velocity: .45 + Math.random() * 1.4
    }));
  }

  setMood(mood) {
    this.mood = mood;
  }

  draw = () => {
    if (!this.running) return;

    const ctx = this.ctx;
    const time = performance.now() * .001;
    const boost = this.mood === "celebration" ? .26 : this.mood === "intimate" ? -.08 : 0;

    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (const star of this.stars) {
      const pulse = Math.sin(time * star.velocity + star.phase) * .18;
      const alpha = Math.max(.03, Math.min(1, star.alpha + pulse + boost));
      const x = star.x * innerWidth + this.pointer.x * this.depth * 6;
      const y = star.y * innerHeight + this.pointer.y * this.depth * 4;

      ctx.beginPath();
      ctx.fillStyle = `rgba(${this.tint[0]},${this.tint[1]},${this.tint[2]},${alpha})`;
      ctx.shadowBlur = star.radius * (3 + this.depth * 2);
      ctx.shadowColor = "rgba(150,205,255,.55)";
      ctx.arc(x, y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(this.draw);
  }
}

export class Universe {
  constructor({ far, mid, near, meteorLayer, constellationLayer }) {
    this.fields = { far, mid, near };
    this.meteorLayer = meteorLayer;
    this.constellationLayer = constellationLayer;
    this.mood = "sleeping";
    this.createConstellations();
  }

  setMood(mood) {
    this.mood = mood;
    document.body.dataset.mood = mood;
    Object.values(this.fields).forEach(field => field.setMood(mood));
  }

  meteor(shower = false) {
    const amount = shower ? 14 : 1;

    for (let i = 0; i < amount; i++) {
      setTimeout(() => {
        const meteor = document.createElement("i");
        meteor.className = "meteor";
        meteor.style.left = `${-10 + Math.random() * 78}%`;
        meteor.style.top = `${Math.random() * 52}%`;
        meteor.style.setProperty("--length", `${6 + Math.random() * 5}rem`);
        this.meteorLayer.append(meteor);
        meteor.addEventListener("animationend", () => meteor.remove(), { once: true });
      }, i * 240);
    }
  }

  createConstellations() {
    const positions = [
      ["11%", "14%", -12],
      ["67%", "20%", 18],
      ["22%", "70%", -5]
    ];

    positions.forEach(([left, top, rotate]) => {
      const c = document.createElement("div");
      c.className = "constellation";
      c.style.left = left;
      c.style.top = top;
      c.style.transform = `rotate(${rotate}deg)`;

      [[8,24],[35,40],[64,55],[84,26]].forEach(([x,y]) => {
        const dot = document.createElement("i");
        dot.style.left = `${x}%`;
        dot.style.top = `${y}%`;
        c.append(dot);
      });

      this.constellationLayer.append(c);
    });
  }
}
