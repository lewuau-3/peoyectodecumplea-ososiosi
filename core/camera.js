import { tween, easing } from "./easing.js";

export class Camera {
  constructor(rig) {
    this.rig = rig;
    this.x = 0;
    this.y = 0;
    this.scale = 1;
    this.pointer = { x: 0, y: 0 };
    this.scrollDepth = 0;
    this.bind();
  }

  bind() {
    addEventListener("pointermove", event => {
      this.pointer.x = (event.clientX / innerWidth - .5) * 2;
      this.pointer.y = (event.clientY / innerHeight - .5) * 2;
    }, { passive: true });
  }

  setScrollProgress(progress) {
    this.scrollDepth = progress;
  }

  moveTo({ x = 0, y = 0, scale = 1, duration = 1100 }) {
    const start = { x: this.x, y: this.y, scale: this.scale };

    tween({
      duration,
      ease: easing.inOutCubic,
      update: t => {
        this.x = start.x + (x - start.x) * t;
        this.y = start.y + (y - start.y) * t;
        this.scale = start.scale + (scale - start.scale) * t;
      }
    });
  }

  update() {
    const px = this.pointer.x * 8;
    const py = this.pointer.y * 6;
    const scrollY = this.scrollDepth * -12;

    this.rig.style.transform =
      `translate3d(${this.x + px}px, ${this.y + py + scrollY}px, 0) scale(${this.scale})`;

    requestAnimationFrame(() => this.update());
  }
}
