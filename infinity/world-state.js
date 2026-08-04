export class WorldState {
  constructor(memory) {
    this.memory = memory;
    this.state = { phase: "birth", intensity: 0, moonPhase: .18, discoveredPhotos: 0 };
  }
  setPhase(phase) {
    this.state.phase = phase;
    document.body.dataset.infinityPhase = phase;
    window.dispatchEvent(new CustomEvent("worldphase", { detail: { phase } }));
  }
  setIntensity(value) {
    this.state.intensity = Math.max(0, Math.min(1, value));
    document.documentElement.style.setProperty("--world-intensity", this.state.intensity);
  }
  updateMoon(progress) {
    this.state.moonPhase = Math.max(.08, Math.min(1, progress));
    document.documentElement.style.setProperty("--moon-phase", this.state.moonPhase);
  }
  discoverPhoto(index) {
    this.state.discoveredPhotos = Math.max(this.state.discoveredPhotos, index + 1);
    document.documentElement.style.setProperty("--album-progress", this.state.discoveredPhotos / 10);
  }
  complete() { this.setPhase("eternal"); }
}
