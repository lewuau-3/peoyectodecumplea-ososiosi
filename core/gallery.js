const SCENE_STYLES = [
  {
    className: "memory-polaroid memory-arrival-left",
    label: "La primera estrella",
    decoration: "tape",
    light: "moon-left",
    transition: "drift"
  },
  {
    className: "memory-floating memory-arrival-right",
    label: "Una luz tranquila",
    decoration: "corners",
    light: "moon-right",
    transition: "float"
  },
  {
    className: "memory-film memory-arrival-depth",
    label: "Como una pequeña película",
    decoration: "film",
    light: "center",
    transition: "cinema"
  },
  {
    className: "memory-glass memory-arrival-rise",
    label: "Suspendida en el cielo",
    decoration: "glass",
    light: "below",
    transition: "focus"
  },
  {
    className: "memory-paper memory-arrival-fall",
    label: "Dejé esta aquí para ti",
    decoration: "paper",
    light: "moon-left",
    transition: "fall"
  },
  {
    className: "memory-orbit memory-arrival-orbit",
    label: "Una estrella en su propia órbita",
    decoration: "orbit",
    light: "center",
    transition: "orbit"
  },
  {
    className: "memory-reflection memory-arrival-reflection",
    label: "Un reflejo bajo la luna",
    decoration: "reflection",
    light: "moon-right",
    transition: "reflection"
  },
  {
    className: "memory-postcard memory-arrival-postcard",
    label: "Algo que quisiera guardar",
    decoration: "postcard",
    light: "below",
    transition: "postcard"
  },
  {
    className: "memory-nebula memory-arrival-nebula",
    label: "Nacida de una pequeña nebulosa",
    decoration: "nebula",
    light: "center",
    transition: "nebula"
  },
  {
    className: "memory-constellation memory-arrival-final",
    label: "La estrella que completa el álbum",
    decoration: "constellation",
    light: "moon-left",
    transition: "final"
  }
];

export function renderGallery(container, photos, onOpen) {
  const fragment = document.createDocumentFragment();

  photos.forEach(([src, compliment], index) => {
    const style = SCENE_STYLES[index % SCENE_STYLES.length];
    const scene = document.createElement("section");

    scene.className = `scene scene--photo reveal ${style.className}`;
    scene.dataset.scene = `photo-${index + 1}`;
    scene.dataset.photoIndex = String(index);
    scene.dataset.transition = style.transition;

    scene.innerHTML = `
      <div class="photo-atmosphere photo-atmosphere--${style.light}" aria-hidden="true">
        <span class="photo-atmosphere__halo"></span>
        <span class="photo-atmosphere__dust"></span>
      </div>

      <article class="photo-memory" style="--photo-index:${index}">
        <span class="photo-memory__label">${style.label}</span>

        <button class="photo-card photo-card--${style.decoration}" type="button"
          aria-label="Ampliar fotografía ${index + 1}">
          <span class="photo-card__ambient" aria-hidden="true"></span>
          <span class="photo-card__tape" aria-hidden="true"></span>
          <span class="photo-card__corners" aria-hidden="true"></span>
          <span class="photo-card__film" aria-hidden="true"></span>
          <span class="photo-card__orbit" aria-hidden="true"></span>

          <span class="photo-card__image">
            <img
              src="${src}"
              alt="Fotografía ${index + 1}"
              ${index > 1 ? 'loading="lazy"' : ""}
              decoding="async"
            >
            <span class="photo-card__shine" aria-hidden="true"></span>
          </span>

          <span class="photo-card__reflection" aria-hidden="true"></span>
        </button>

        <p class="photo-memory__compliment">${compliment}</p>

        <div class="photo-memory__footer">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <i></i>
          <span>${String(photos.length).padStart(2, "0")}</span>
        </div>
      </article>
    `;

    const image = scene.querySelector("img");
    const button = scene.querySelector(".photo-card");

    image.addEventListener("error", () => {
      image.hidden = true;
      button.classList.add("is-missing");
    });

    button.addEventListener("click", () => {
      if (!image.hidden) onOpen(src, compliment, index);
    });

    fragment.append(scene);
  });

  container.append(fragment);
}
