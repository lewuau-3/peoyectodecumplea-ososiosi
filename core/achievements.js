export class AchievementEngine {
  constructor(root, icon, title, text) {
    this.root = root;
    this.icon = icon;
    this.title = title;
    this.text = text;
    this.queue = [];
    this.busy = false;
  }

  show({ icon = "✦", title = "Descubrimiento", text }) {
    this.queue.push({ icon, title, text });
    this.flush();
  }

  flush() {
    if (this.busy || !this.queue.length) return;

    this.busy = true;
    const item = this.queue.shift();

    this.icon.textContent = item.icon;
    this.title.textContent = item.title;
    this.text.textContent = item.text;
    this.root.classList.add("is-visible");

    setTimeout(() => {
      this.root.classList.remove("is-visible");
      setTimeout(() => {
        this.busy = false;
        this.flush();
      }, 400);
    }, 3200);
  }
}
