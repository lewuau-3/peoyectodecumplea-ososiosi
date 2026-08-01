"use strict";

/*
  ==========================================================
  CONFIGURACIÓN FÁCIL DE EDITAR
  Cambia únicamente este objeto para personalizar el regalo.
  ==========================================================
*/
const CONFIG = {
  relationshipStart: "2026-05-13T15:20:00-06:00",
  audioPath: "audio/dark-beach.mp3",
  initialVolume: 0.42,

  photos: [
    {
      src: "img/foto-01.webp",
      alt: "Fotografía 1 de mi novia",
      compliment: "Eres demasiado bonita, amolcito."
    },
    {
      src: "img/foto-02.webp",
      alt: "Fotografía 2 de mi novia",
      compliment: "Tienes una sonrisa que hace que todo se sienta mejor."
    },
    {
      src: "img/foto-03.webp",
      alt: "Fotografía 3 de mi novia",
      compliment: "No sabes lo especial que eres para mí."
    },
    {
      src: "img/foto-04.webp",
      alt: "Fotografía 4 de mi novia",
      compliment: "Podría verte mil veces y seguirías pareciéndome preciosa."
    },
    {
      src: "img/foto-05.webp",
      alt: "Fotografía 5 de mi novia",
      compliment: "Tienes una forma de ser que me encanta demasiado."
    },
    {
      src: "img/foto-06.webp",
      alt: "Fotografía 6 de mi novia",
      compliment: "Tu manera de existir hace más bonito mi mundo."
    },
    {
      src: "img/foto-07.webp",
      alt: "Fotografía 7 de mi novia",
      compliment: "Eres de las personas más lindas que he conocido."
    },
    {
      src: "img/foto-08.webp",
      alt: "Fotografía 8 de mi novia",
      compliment: "Hay algo en ti que siempre consigue alegrarme."
    },
    {
      src: "img/foto-09.webp",
      alt: "Fotografía 9 de mi novia",
      compliment: "Cada parte de ti tiene algo que adoro."
    },
    {
      src: "img/foto-10.webp",
      alt: "Fotografía 10 de mi novia",
      compliment: "Qué suerte la mía de poder amarte."
    }
  ],

  introMessages: [
    "Hay personas que llegan a tu vida...",
    "...y sin darse cuenta...",
    "...la iluminan por completo."
  ],

  letter: [
    "Feliz cumpleaños, amolcito. Me habría encantado poder estar ahí para abrazarte y decirte todo esto en persona, pero como no puedo, quise hacerte algo que pudieras guardar y volver a ver cuando quisieras.",
    "Gracias por existir y por permitirme compartir contigo una parte de tu vida. Ti quiero demasiado y de verdad espero poder estar a tu lado en muchos cumpleaños más.",
    "Quiero seguir construyendo un futuro contigo, aprendiendo de ti y haciéndote sentir todo lo importante que eres para mí.",
    "Espero que hoy tengas un día muy bonito, mi niña, y que durante todo tu cumpleaños puedas sentir lo mucho que te quiero. Feliz cumpleaños, amol."
  ],

  secretMessage: [
    "Si encontraste esto...",
    "Quería esconder un último regalo aquí.",
    "Feliz cumpleaños, amolcito ❤️",
    "Espero que este sea solo uno de muchos cumpleaños que pueda celebrar contigo."
  ],

  finalMessages: [
    "Gracias por existir.",
    "Feliz cumpleaños, amolcito ❤️",
    "Nos separan algunos kilómetros...",
    "Pero nunca el mismo cielo 🌙"
  ]
};

const state = {
  audioStarted: false,
  audioWasPlayingBeforeSecret: false,
  activeScene: null,
  finalSequencePlayed: false,
  introPlayed: false,
  lastTouchParticleAt: 0,
  shootingStarTimer: null,
  currentVolumeAnimation: null
};

const elements = {
  story: document.getElementById("story"),
  sky: document.getElementById("sky"),
  starsFar: document.getElementById("starsFar"),
  starsNear: document.getElementById("starsNear"),
  constellations: document.getElementById("constellations"),
  shootingStars: document.getElementById("shootingStars"),

  moonButton: document.getElementById("moonButton"),
  audioControl: document.getElementById("audioControl"),
  audioIcon: document.getElementById("audioIcon"),
  audioStatus: document.getElementById("audioStatus"),
  backgroundAudio: document.getElementById("backgroundAudio"),

  giftNotification: document.getElementById("giftNotification"),
  swipeHint: document.getElementById("swipeHint"),

  photoScenes: document.getElementById("photoScenes"),
  letterContent: document.getElementById("letterContent"),

  daysValue: document.getElementById("daysValue"),
  hoursValue: document.getElementById("hoursValue"),
  minutesValue: document.getElementById("minutesValue"),
  secondsValue: document.getElementById("secondsValue"),

  photoModal: document.getElementById("photoModal"),
  photoModalImage: document.getElementById("photoModalImage"),
  photoModalCaption: document.getElementById("photoModalCaption"),
  photoModalClose: document.getElementById("photoModalClose"),
  photoModalBackdrop: document.getElementById("photoModalBackdrop"),

  secretModal: document.getElementById("secretModal"),
  secretText: document.getElementById("secretText"),
  secretClose: document.getElementById("secretClose"),
  secretBackdrop: document.getElementById("secretBackdrop")
};

function init() {
  applyConfigText();
  renderPhotos();
  renderLetter();
  renderSecretMessage();
  createSky();
  setupAudio();
  setupCounter();
  setupObservers();
  setupInteractions();
  playIntroSequence();
  startShootingStarLoop();
}

function applyConfigText() {
  const introLines = document.querySelectorAll("[data-intro-line]");

  CONFIG.introMessages.forEach((message, index) => {
    const line = introLines[index];
    if (line) line.textContent = message;
  });

  document.querySelectorAll("[data-final-line]").forEach((line, index) => {
    if (CONFIG.finalMessages[index]) {
      line.textContent = CONFIG.finalMessages[index];
    }
  });
}

function renderPhotos() {
  const tiltValues = [-1.7, 1.2, -0.8, 1.6, -1.1, 0.7, -1.5, 1.05, -0.6, 1.4];

  const fragment = document.createDocumentFragment();

  CONFIG.photos.forEach((photo, index) => {
    const section = document.createElement("section");
    section.className = "scene photo-scene";
    section.dataset.scene = `photo-${index + 1}`;

    const story = document.createElement("div");
    story.className = "photo-story";

    const button = document.createElement("button");
    button.className = "polaroid";
    button.type = "button";
    button.style.setProperty("--tilt", `${tiltValues[index % tiltValues.length]}deg`);
    button.setAttribute("aria-label", `Ampliar fotografía ${index + 1}`);

    const imageWrap = document.createElement("span");
    imageWrap.className = "polaroid__image-wrap";

    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.alt || `Fotografía ${index + 1}`;
    image.loading = index < 2 ? "eager" : "lazy";
    image.decoding = "async";
    image.fetchPriority = index === 0 ? "high" : "auto";

    image.addEventListener("error", () => {
      button.classList.add("is-missing");
      image.hidden = true;
    });

    imageWrap.append(image);
    button.append(imageWrap);

    const compliment = document.createElement("p");
    compliment.className = "photo-compliment";
    compliment.textContent = photo.compliment;

    const photoIndex = document.createElement("span");
    photoIndex.className = "photo-index";
    photoIndex.textContent = `${String(index + 1).padStart(2, "0")} / ${String(CONFIG.photos.length).padStart(2, "0")}`;

    compliment.append(photoIndex);
    story.append(button, compliment);
    section.append(story);
    fragment.append(section);

    button.addEventListener("click", () => {
      if (!image.hidden) {
        openPhotoModal(photo);
      }
    });
  });

  elements.photoScenes.append(fragment);
}

function renderLetter() {
  const fragment = document.createDocumentFragment();

  CONFIG.letter.forEach((paragraph, index) => {
    const p = document.createElement("p");
    p.className = "letter__paragraph";
    p.textContent = paragraph;
    p.style.setProperty("--delay", `${index * 170}ms`);
    fragment.append(p);
  });

  elements.letterContent.append(fragment);
}

function renderSecretMessage() {
  const fragment = document.createDocumentFragment();

  CONFIG.secretMessage.forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    fragment.append(p);
  });

  elements.secretText.append(fragment);
}

function createSky() {
  const lowPowerDevice =
    window.matchMedia("(max-width: 430px)").matches ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  const farCount = lowPowerDevice ? 42 : 68;
  const nearCount = lowPowerDevice ? 20 : 34;

  createStars(elements.starsFar, farCount, 0.8, 1.8);
  createStars(elements.starsNear, nearCount, 1.3, 2.7);
  createConstellations();
}

function createStars(container, count, minSize, maxSize) {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i += 1) {
    const star = document.createElement("span");
    star.className = "star";

    const size = random(minSize, maxSize);
    star.style.left = `${random(0, 100)}%`;
    star.style.top = `${random(0, 100)}%`;
    star.style.setProperty("--size", `${size}px`);
    star.style.setProperty("--opacity", random(0.28, 0.92).toFixed(2));
    star.style.setProperty("--duration", `${random(2.4, 6.5).toFixed(2)}s`);
    star.style.setProperty("--delay", `${random(-6, 0).toFixed(2)}s`);

    fragment.append(star);
  }

  container.append(fragment);
}

function createConstellations() {
  const positions = [
    { top: "17%", left: "7%" },
    { top: "38%", right: "4%" },
    { bottom: "16%", left: "18%" }
  ];

  positions.forEach((position, index) => {
    const constellation = document.createElement("div");
    constellation.className = "constellation";

    Object.assign(constellation.style, position);
    constellation.style.transform = `rotate(${[-12, 18, -5][index]}deg)`;

    const dots = [
      [10, 26],
      [39, 39],
      [67, 53],
      [83, 25]
    ];

    dots.forEach(([x, y]) => {
      const dot = document.createElement("span");
      dot.style.left = `${x}%`;
      dot.style.top = `${y}%`;
      constellation.append(dot);
    });

    elements.constellations.append(constellation);
  });
}

function startShootingStarLoop() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const scheduleNext = () => {
    const delay = random(6000, 12500);
    state.shootingStarTimer = window.setTimeout(() => {
      createShootingStar(false);
      scheduleNext();
    }, delay);
  };

  window.setTimeout(() => {
    createShootingStar(true);
    scheduleNext();
  }, 2300);
}

function createShootingStar(forceVisible = false) {
  const star = document.createElement("span");
  star.className = "shooting-star";
  star.style.left = `${random(-10, 72)}%`;
  star.style.top = `${random(4, forceVisible ? 28 : 62)}%`;

  elements.shootingStars.append(star);

  star.addEventListener("animationend", () => star.remove(), { once: true });
}

function playIntroSequence() {
  if (state.introPlayed) return;
  state.introPlayed = true;

  const introItems = Array.from(document.querySelectorAll("[data-intro-line]"));
  const timings = [900, 4550, 8200, 11750];

  introItems.forEach((item, index) => {
    window.setTimeout(() => {
      item.classList.add("is-visible");

      if (index === introItems.length - 1) {
        window.setTimeout(() => {
          elements.giftNotification.classList.add("is-visible");
        }, 950);
      }
    }, timings[index]);
  });
}

function setupAudio() {
  const audio = elements.backgroundAudio;
  audio.src = CONFIG.audioPath;
  audio.volume = 0;
  audio.loop = true;

  audio.addEventListener("play", () => {
    state.audioStarted = true;
    updateAudioButton(true);
  });

  audio.addEventListener("pause", () => {
    updateAudioButton(false);
  });

  audio.addEventListener("error", () => {
    elements.audioStatus.textContent = "Sin audio";
    elements.audioIcon.textContent = "!";
    elements.audioControl.setAttribute("aria-label", "No se pudo cargar el audio");
  });

  attemptAudioStart();

  const firstInteraction = () => {
    attemptAudioStart();
    document.removeEventListener("pointerdown", firstInteraction);
    document.removeEventListener("touchstart", firstInteraction);
  };

  document.addEventListener("pointerdown", firstInteraction, { passive: true });
  document.addEventListener("touchstart", firstInteraction, { passive: true });
}

async function attemptAudioStart() {
  const audio = elements.backgroundAudio;

  if (!audio.src || !audio.paused) return;

  try {
    await audio.play();
    fadeAudioTo(CONFIG.initialVolume, 1800);
  } catch {
    updateAudioButton(false);
  }
}

function updateAudioButton(isPlaying) {
  elements.audioControl.setAttribute("aria-pressed", String(isPlaying));
  elements.audioControl.setAttribute(
    "aria-label",
    isPlaying ? "Pausar música" : "Reproducir música"
  );
  elements.audioIcon.textContent = isPlaying ? "Ⅱ" : "▶";
  elements.audioStatus.textContent = isPlaying ? "Sonando" : "Pausada";
  showAudioFeedback();
}

function showAudioFeedback() {
  elements.audioControl.classList.add("is-feedback");
  window.clearTimeout(showAudioFeedback.timeoutId);
  showAudioFeedback.timeoutId = window.setTimeout(() => {
    elements.audioControl.classList.remove("is-feedback");
  }, 1700);
}

function fadeAudioTo(targetVolume, duration = 700) {
  const audio = elements.backgroundAudio;
  const startVolume = audio.volume;
  const safeTarget = clamp(targetVolume, 0, 1);
  const startTime = performance.now();

  if (state.currentVolumeAnimation) {
    cancelAnimationFrame(state.currentVolumeAnimation);
  }

  const step = (now) => {
    const progress = clamp((now - startTime) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    audio.volume = clamp(
      startVolume + (safeTarget - startVolume) * eased,
      0,
      1
    );

    if (progress < 1) {
      state.currentVolumeAnimation = requestAnimationFrame(step);
    } else {
      state.currentVolumeAnimation = null;
    }
  };

  state.currentVolumeAnimation = requestAnimationFrame(step);
}

function setupCounter() {
  const startTime = new Date(CONFIG.relationshipStart).getTime();

  if (Number.isNaN(startTime)) {
    console.error("La fecha relationshipStart no es válida.");
    return;
  }

  const updateCounter = () => {
    const now = Date.now();
    const difference = Math.max(0, now - startTime);

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    elements.daysValue.textContent = String(days);
    elements.hoursValue.textContent = pad(hours);
    elements.minutesValue.textContent = pad(minutes);
    elements.secondsValue.textContent = pad(seconds);
  };

  updateCounter();
  window.setInterval(updateCounter, 1000);
}

function setupObservers() {
  const scenes = Array.from(document.querySelectorAll(".scene"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        scenes.forEach((scene) => scene.classList.remove("is-active"));
        entry.target.classList.add("is-active");
        state.activeScene = entry.target.dataset.scene;

        updateSceneMood(state.activeScene);

        if (state.activeScene === "final" && !state.finalSequencePlayed) {
          state.finalSequencePlayed = true;
          playFinalSequence();
        }
      });
    },
    {
      root: elements.story,
      threshold: 0.58
    }
  );

  scenes.forEach((scene) => observer.observe(scene));
}

function updateSceneMood(sceneName) {
  document.body.classList.toggle("final-active", sceneName === "final");

  if (sceneName === "intro") {
    elements.moonButton.style.opacity = "0.72";
    elements.moonButton.style.transform = "scale(0.88)";
  } else if (sceneName === "letter") {
    elements.moonButton.style.opacity = "0.84";
    elements.moonButton.style.transform = "scale(0.95)";
  } else if (sceneName === "final") {
    elements.moonButton.style.opacity = "1";
    elements.moonButton.style.transform = "scale(1.06)";
  } else {
    elements.moonButton.style.opacity = "0.94";
    elements.moonButton.style.transform = "scale(1)";
  }
}

function setupInteractions() {
  elements.audioControl.addEventListener("click", toggleAudio);

  elements.moonButton.addEventListener("click", openSecretModal);
  elements.secretClose.addEventListener("click", closeSecretModal);
  elements.secretBackdrop.addEventListener("click", closeSecretModal);

  elements.photoModalClose.addEventListener("click", closePhotoModal);
  elements.photoModalBackdrop.addEventListener("click", closePhotoModal);

  elements.story.addEventListener(
    "scroll",
    () => {
      if (elements.story.scrollTop > 30) {
        elements.swipeHint.classList.add("is-hidden");
      }
    },
    { passive: true }
  );

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (elements.secretModal.classList.contains("is-open")) {
      closeSecretModal();
    } else if (elements.photoModal.classList.contains("is-open")) {
      closePhotoModal();
    }
  });

  document.addEventListener("pointerdown", handleDecorativeTouch, { passive: true });
}

async function toggleAudio() {
  const audio = elements.backgroundAudio;

  if (audio.paused) {
    try {
      await audio.play();
      fadeAudioTo(CONFIG.initialVolume, 900);
    } catch {
      elements.audioStatus.textContent = "Toca de nuevo";
      showAudioFeedback();
    }
  } else {
    fadeAudioTo(0, 450);
    window.setTimeout(() => audio.pause(), 470);
  }
}

function openPhotoModal(photo) {
  elements.photoModalImage.src = photo.src;
  elements.photoModalImage.alt = photo.alt || "Fotografía ampliada";
  elements.photoModalCaption.textContent = photo.compliment;

  openModal(elements.photoModal);
  window.setTimeout(() => elements.photoModalClose.focus(), 50);
}

function closePhotoModal() {
  closeModal(elements.photoModal);
  elements.photoModalImage.removeAttribute("src");
  elements.photoModalCaption.textContent = "";
}

function openSecretModal() {
  const audio = elements.backgroundAudio;

  state.audioWasPlayingBeforeSecret = !audio.paused;

  if (state.audioWasPlayingBeforeSecret) {
    fadeAudioTo(Math.max(CONFIG.initialVolume * 0.24, 0.06), 650);
  }

  createMoonDust();
  document.body.classList.add("secret-open");
  openModal(elements.secretModal);
  window.setTimeout(() => elements.secretClose.focus(), 50);
}

function closeSecretModal() {
  closeModal(elements.secretModal);
  document.body.classList.remove("secret-open");

  if (state.audioWasPlayingBeforeSecret && !elements.backgroundAudio.paused) {
    fadeAudioTo(CONFIG.initialVolume, 800);
  }
}

function openModal(modal) {
  document.body.classList.add("modal-open");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");

  if (!document.querySelector(".modal.is-open")) {
    document.body.classList.remove("modal-open");
  }
}

function handleDecorativeTouch(event) {
  const now = Date.now();

  if (now - state.lastTouchParticleAt < 550) return;
  if (event.target.closest("button, .modal, .polaroid, a, input, textarea, select")) return;

  state.lastTouchParticleAt = now;
  createTouchParticle(event.clientX, event.clientY);
}

function createTouchParticle(x, y) {
  const particle = document.createElement("span");
  particle.className = "touch-particle";
  particle.textContent = Math.random() > 0.55 ? "✦" : "♡";
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.setProperty("--particle-size", `${random(0.65, 1.05)}rem`);
  particle.style.setProperty("--drift-x", `${random(-1.8, 1.8)}rem`);
  particle.style.setProperty("--rotation", `${random(-28, 28)}deg`);

  document.body.append(particle);
  particle.addEventListener("animationend", () => particle.remove(), { once: true });
}

function createMoonDust() {
  const rect = elements.moonButton.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 18; i += 1) {
    const particle = document.createElement("span");
    particle.className = "moon-particle";
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;

    const angle = (Math.PI * 2 * i) / 18 + random(-0.18, 0.18);
    const distance = random(34, 88);

    particle.style.setProperty("--dust-x", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dust-y", `${Math.sin(angle) * distance}px`);

    document.body.append(particle);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
  }
}

function playFinalSequence() {
  const lines = Array.from(document.querySelectorAll("[data-final-line]"));
  const delays = [550, 4700, 8850, 12850];

  createFinalMeteorShower();

  lines.forEach((line, index) => {
    window.setTimeout(() => {
      line.classList.add("is-visible");
    }, delays[index]);
  });
}

function createFinalMeteorShower() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  for (let i = 0; i < 9; i += 1) {
    window.setTimeout(() => createShootingStar(false), i * 460);
  }
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function pad(value) {
  return String(value).padStart(2, "0");
}

document.addEventListener("DOMContentLoaded", init);
