import { tween } from "./easing.js";

export class AudioEngine {
  constructor(audio, button, label, config) {
    this.audio = audio;
    this.button = button;
    this.label = label;
    this.volume = config.volume;
    this.audio.src = config.audioPath;
    this.audio.loop = true;
    this.audio.volume = 0;
    this.bind();
  }

  bind() {
    this.button.addEventListener("click", () => this.toggle());
    this.audio.addEventListener("play", () => this.ui(true));
    this.audio.addEventListener("pause", () => this.ui(false));

    const firstGesture = () => {
      this.play();
      document.removeEventListener("pointerdown", firstGesture);
    };

    document.addEventListener("pointerdown", firstGesture, { passive: true });
  }

  async play() {
    try {
      await this.audio.play();
      this.fade(this.volume, 1600);
    } catch {}
  }

  pause() {
    this.fade(0, 450, () => this.audio.pause());
  }

  toggle() {
    this.audio.paused ? this.play() : this.pause();
  }

  fade(target, duration = 700, complete) {
    const start = this.audio.volume;

    tween({
      duration,
      from: start,
      to: target,
      update: value => this.audio.volume = Math.max(0, Math.min(1, value)),
      complete
    });
  }

  duck() {
    if (!this.audio.paused) this.fade(Math.max(.06, this.volume * .22), 600);
  }

  restore() {
    if (!this.audio.paused) this.fade(this.volume, 900);
  }

  ui(playing) {
    this.button.classList.toggle("is-playing", playing);
    this.label.textContent = playing ? "Sonando" : "Pausada";
  }
}
