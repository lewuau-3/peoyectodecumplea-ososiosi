import { CONFIG } from "./config.js";
import { getTier, PRESETS } from "./performance.js";
import { Timeline } from "./timeline.js";
import { Camera } from "./camera.js";
import { AudioEngine } from "./audio.js";
import { StarField, Universe } from "./universe.js";
import { renderGallery } from "./gallery.js";
import { MemoryEngine } from "./memory.js";
import { AchievementEngine } from "./achievements.js";
import { SecretEngine } from "./secrets.js";
import { ParticleEngine } from "./particles.js";
import { AmbientAI } from "./ambient-ai.js";
import { CelebrationEngine } from "./celebration.js";


import { WorldState } from "./infinity/world-state.js";
import { GalaxyEngine } from "./infinity/galaxy.js";
import { PhotoPaletteEngine } from "./infinity/photo-palette.js";
import { OneTakeDirector } from "./infinity/one-take.js";
import { EternalMode } from "./infinity/eternal-mode.js";
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];


const memory = new MemoryEngine();
const visitNumber = memory.beginVisit();

const particles = new ParticleEngine();

const achievements = new AchievementEngine(
  $("#achievement"),
  $("#achievementIcon"),
  $("#achievementTitle"),
  $("#achievementText")
);

const tier = getTier();
const preset = PRESETS[tier];

const renderOptions = { pixelRatio: preset.pixelRatio, frameInterval: tier === "high" ? 16 : 33 };
const far = new StarField($("#starCanvasFar"), preset.far, .35, [210, 229, 248], renderOptions);
const mid = new StarField($("#starCanvasMid"), preset.mid, .75, [225, 240, 255], renderOptions);
const near = new StarField($("#starCanvasNear"), preset.near, 1.25, [242, 249, 255], renderOptions);

const universe = new Universe({
  far,
  mid,
  near,
  meteorLayer: $("#meteorLayer"),
  constellationLayer: $("#constellationLayer")
});

const camera = new Camera($("#cameraRig"));
camera.update();

const audio = new AudioEngine($("#music"), $("#audioOrb"), $("#audioLabel"), CONFIG);
const world = new WorldState(memory);
const galaxy = new GalaxyEngine($("#galaxyCanvas"), tier, { amount: preset.galaxy, pixelRatio: preset.pixelRatio, frameInterval: tier === "high" ? 20 : 40 });
const palette = new PhotoPaletteEngine();
const oneTake = new OneTakeDirector($("#experience"), camera, world);
const eternal = new EternalMode({ universe, particles });


const secrets = new SecretEngine({
  memory,
  achievements,
  universe,
  particles,
  audio
});

const ambientAI = new AmbientAI({
  universe,
  particles,
  memory
});
if (preset.ambient) ambientAI.start();

const celebration = new CelebrationEngine({
  universe,
  particles,
  audio
});

setupCake();
setupEnvelope();


setupMemoryGreeting();
setupHiddenStar();
setupConstellationGame();
setupLongPressMoon();
setupFiveTapSecret();
if (preset.trails) setupFingerTrail();
setupSecretProgress();


renderGallery($("#galleryScenes"), CONFIG.photos, openPhoto);
renderLetter();
setupCounter();
setupScenes();
setupModals();
setupMoon();
setupProgress();
setupAmbientDust();
setupAmbientEvents();
runIntro();
setupInfinityPhotoPalette();
setupWorldPhases();

function runIntro() {
  const lines = $$("[data-intro]");
  const timeline = new Timeline();

  timeline
    .add(1000, () => lines[0].classList.add("is-visible"))
    .add(4550, () => lines[1].classList.add("is-visible"))
    .add(8100, () => lines[2].classList.add("is-visible"))
    .add(11550, () => {
      lines[3].classList.add("is-visible");
      camera.moveTo({ scale: 1.035, duration: 1800 });
      universe.meteor();
    })
    .add(12800, () => $("#systemNotification").classList.add("is-visible"));

  timeline.play();
}

function setupCounter() {
  const start = new Date(CONFIG.relationshipStart).getTime();

  const update = () => {
    const diff = Math.max(0, Date.now() - start);
    const seconds = Math.floor(diff / 1000);

    $("#days").textContent = Math.floor(seconds / 86400);
    $("#hours").textContent = String(Math.floor((seconds % 86400) / 3600)).padStart(2, "0");
    $("#minutes").textContent = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    $("#seconds").textContent = String(seconds % 60).padStart(2, "0");
  };

  update();
  setInterval(update, 1000);
}

function renderLetter() {
  const fragment = document.createDocumentFragment();

  CONFIG.letter.forEach((text, index) => {
    const p = document.createElement("p");
    p.textContent = text;
    p.style.setProperty("--delay", `${index * 180}ms`);
    fragment.append(p);
  });

  $("#letterBody").append(fragment);
}

function setupScenes() {
  const scenes = $$(".scene");

  const moods = {
    intro: ["sleeping", { scale: 1, x: 0, y: 0 }],
    portal: ["curious", { scale: 1.04, x: -5, y: 3 }],
    counter: ["warm", { scale: 1.06, x: 5, y: -3 }],
    cinematic: ["magical", { scale: 1.08, x: -4, y: 2 }],
    cake: ["magical", { scale: 1.07, x: 0, y: -2 }],
    envelope: ["intimate", { scale: 1.04, x: 0, y: 2 }],
    letter: ["intimate", { scale: 1.03, x: 0, y: 4 }],
    ending: ["celebration", { scale: 1.12, x: 0, y: -4 }]
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      scenes.forEach(scene => scene.classList.remove("is-active"));
      entry.target.classList.add("is-active");

      const name = entry.target.dataset.scene;
      if (name === "intro") world.setPhase("birth");
      else if (name?.startsWith("photo")) world.setPhase("memory");
      else if (name === "ending") world.setPhase("celebration");
      else world.setPhase("journey");
      let [mood, cameraTarget] = moods[name] || (
        name?.startsWith("photo")
          ? ["warm", { scale: 1.07, x: 0, y: -2 }]
          : ["curious", { scale: 1.03, x: 0, y: 0 }]
      );

      if (name?.startsWith("photo")) {
        const index = Number(name.split("-")[1] || 1) - 1;
        const cameraPresets = [
          { scale: 1.075, x: -5, y: -1 },
          { scale: 1.08, x: 5, y: -2 },
          { scale: 1.1, x: 0, y: -3 },
          { scale: 1.065, x: -2, y: 2 },
          { scale: 1.08, x: 3, y: -3 },
          { scale: 1.105, x: 0, y: -1 },
          { scale: 1.075, x: 5, y: 1 },
          { scale: 1.085, x: -5, y: -2 },
          { scale: 1.11, x: 0, y: -4 },
          { scale: 1.13, x: 0, y: -5 }
        ];
        cameraTarget = cameraPresets[index % cameraPresets.length];
        mood = index >= 8 ? "magical" : "warm";
      }

      universe.setMood(mood);
      camera.moveTo({ ...cameraTarget, duration: 1200 });

      if (name === "letter") audio.duck();
      else audio.restore();

      if (name === "ending" && !entry.target.dataset.played) {
        entry.target.dataset.played = "true";
        playEnding();
      }
    });
  }, { root: $("#experience"), threshold: .58 });

  scenes.forEach(scene => observer.observe(scene));
}

function setupProgress() {
  $("#experience").addEventListener("scroll", () => {
    const root = $("#experience");
    const max = root.scrollHeight - root.clientHeight;
    const progress = max > 0 ? root.scrollTop / max : 0;

    $("#progressFill").style.transform = `scaleY(${progress})`;
    camera.setScrollProgress(progress);
  }, { passive: true });
}

function setupAmbientDust() {
  if (preset.dust <= 0) return;

  for (let i = 0; i < preset.dust; i++) {
    const dot = document.createElement("i");
    dot.className = "dust";
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${18 + Math.random() * 78}%`;
    dot.style.setProperty("--x", `${(Math.random() - .5) * 70}px`);
    dot.style.setProperty("--y", `${(Math.random() - .5) * 110}px`);
    dot.style.setProperty("--duration", `${5 + Math.random() * 7}s`);
    dot.style.animationDelay = `${-Math.random() * 8}s`;
    $("#dustLayer").append(dot);
  }
}

function setupAmbientEvents() {
  const loop = () => {
    const delay = 6500 + Math.random() * 8500;

    setTimeout(() => {
      const roll = Math.random();

      if (roll < .56) universe.meteor();
      else if (roll < .82) document.body.classList.add("constellation-pulse");
      else document.body.classList.add("aurora-pulse");

      setTimeout(() => {
        document.body.classList.remove("constellation-pulse", "aurora-pulse");
      }, 2800);

      loop();
    }, delay);
  };

  loop();
}

function setupMoon() {
  $("#moon").addEventListener("click", () => {
    const rect = $("#moon").getBoundingClientRect();
    particles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18, "✦");

    $("#secretText").innerHTML = CONFIG.secret.map(line => `<p>${line}</p>`).join("");
    $("#secretModal").classList.add("is-open");
    $("#secretModal").setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    audio.duck();

    secrets.unlock("moon", {
      icon: "🌙",
      title: "Secreto lunar",
      text: "Encontraste el mensaje escondido en la luna."
    });
  });
}

function setupModals() {
  $$("[data-close-photo]").forEach(button => {
    button.addEventListener("click", () => closeModal($("#photoModal")));
  });

  $$("[data-close-secret]").forEach(button => {
    button.addEventListener("click", () => {
      closeModal($("#secretModal"));
      audio.restore();
    });
  });

  addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    $$(".modal.is-open").forEach(closeModal);
    audio.restore();
  });
}

function openPhoto(src, caption, index) {
  $("#modalImage").src = src;
  $("#modalImage").alt = `Fotografía ${index + 1} ampliada`;
  $("#modalCaption").textContent = caption;
  $("#photoModal").classList.add("is-open");
  $("#photoModal").setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  if (!$(".modal.is-open")) document.body.classList.remove("modal-open");
}

function playEnding() {
  universe.setMood("celebration");
  memory.complete();
  if (tier === "high") celebration.finaleBurst(); else { universe.meteor(true); celebration.confetti({ count: 20 }); }
  camera.moveTo({ scale: 1.16, y: -6, duration: 2200 });
  audio.restore();

  const lines = $$("[data-ending]");
  const finale = CONFIG.finale;

  if (finale) {
    lines[0].textContent = finale.first;
    lines[1].textContent = finale.second;
    lines[2].textContent = finale.third;
    lines[3].textContent = finale.last;
    $("#finalMoonMessage").textContent = finale.moonMessage;
  }

  [500, 4500, 8500, 12500].forEach((delay, index) => {
    setTimeout(() => lines[index].classList.add("is-visible"), delay);
  });

  setTimeout(() => {
    $("#finalMoonMoment").classList.add("is-visible");
    audio.duck();
  }, 17000);

  setTimeout(() => {
    $("#finalMoonMoment").classList.remove("is-visible");
    audio.restore();
  }, 25800);

  setTimeout(() => {
    $("#crystalFinale").classList.add("is-visible");
    $("#crystalFinale").setAttribute("aria-hidden", "false");
    audio.duck();
  }, 27000);

  setTimeout(() => {
    world.complete();
    eternal.start();
    audio.restore();
  }, 44000);
}


function setupMemoryGreeting() {
  if (visitNumber <= 1) return;

  const messages = CONFIG.returnMessages || [];
  const message = messages[(visitNumber - 2) % messages.length];

  if (!message) return;

  setTimeout(() => {
    $("#returnMessage").textContent = message;
    $("#returnMessage").classList.add("is-visible");

    setTimeout(() => {
      $("#returnMessage").classList.remove("is-visible");
    }, 4200);
  }, 3200);
}

function setupHiddenStar() {
  $("#hiddenStar").addEventListener("click", event => {
    const rect = event.currentTarget.getBoundingClientRect();
    particles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20, "✦");

    secrets.unlock("hidden-star", {
      icon: "⭐",
      title: "Estrella escondida",
      text: "Encontraste la estrella que estaba tratando de pasar desapercibida."
    });
  });
}

function setupConstellationGame() {
  const points = $$("[data-constellation-point]");

  points.forEach(point => {
    point.addEventListener("click", () => {
      point.classList.add("is-active");

      const complete = secrets.registerConstellationPoint(point.dataset.constellationPoint);

      if (complete) {
        $("#constellationGame").classList.add("is-complete");
        universe.meteor(true);

        $("#secretText").innerHTML =
          CONFIG.hiddenMessages.constellation.map(line => `<p>${line}</p>`).join("");

        setTimeout(() => {
          $("#secretModal").classList.add("is-open");
          $("#secretModal").setAttribute("aria-hidden", "false");
          document.body.classList.add("modal-open");
        }, 900);
      }
    });
  });

  addEventListener("constellationprogress", event => {
    const { current } = event.detail;
    points.forEach((point, index) => {
      point.classList.toggle("is-active", index < current.length);
    });
  });
}

function setupLongPressMoon() {
  let timer = null;
  let triggered = false;

  const start = event => {
    triggered = false;
    timer = setTimeout(() => {
      triggered = true;

      const rect = $("#moon").getBoundingClientRect();
      particles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 26, "✧");

      $("#secretText").innerHTML =
        CONFIG.hiddenMessages.longPressMoon.map(line => `<p>${line}</p>`).join("");

      $("#secretModal").classList.add("is-open");
      $("#secretModal").setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      audio.duck();

      secrets.unlock("moon-long-press", {
        icon: "🌙",
        title: "Luna paciente",
        text: "Descubriste lo que aparece al quedarte un poquito más."
      });
    }, 1800);
  };

  const cancel = () => clearTimeout(timer);

  $("#moon").addEventListener("pointerdown", start);
  $("#moon").addEventListener("pointerup", cancel);
  $("#moon").addEventListener("pointercancel", cancel);
  $("#moon").addEventListener("pointerleave", cancel);
}

function setupFiveTapSecret() {
  let taps = [];
  const target = document.querySelector(".intro-title h1");

  target?.addEventListener("click", () => {
    const now = Date.now();
    taps = [...taps.filter(time => now - time < 2200), now];

    if (taps.length >= 5) {
      taps = [];

      $("#secretText").innerHTML =
        CONFIG.hiddenMessages.fiveTaps.map(line => `<p>${line}</p>`).join("");

      $("#secretModal").classList.add("is-open");
      $("#secretModal").setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      secrets.unlock("five-taps", {
        icon: "♡",
        title: "Curiosidad desbloqueada",
        text: "Tocaste cinco veces donde nadie te dijo que tocaras."
      });
    }
  });
}

function setupFingerTrail() {
  let last = 0;

  document.addEventListener("pointermove", event => {
    const now = performance.now();
    if (now - last < 55) return;
    last = now;
    particles.trail(event.clientX, event.clientY);
  }, { passive: true });
}

function setupSecretProgress() {
  const required = ["moon", "hidden-star", "constellation", "moon-long-press", "five-taps"];

  const update = () => {
    const discovered = required.filter(key => memory.has(key)).length;
    $("#secretProgressFill").style.transform = `scaleX(${discovered / required.length})`;

    if (discovered === required.length && !memory.has("all-secrets")) {
      memory.discover("all-secrets");

      setTimeout(() => {
        $("#secretText").innerHTML =
          CONFIG.hiddenMessages.finalSecret.map(line => `<p>${line}</p>`).join("");

        $("#secretModal").classList.add("is-open");
        $("#secretModal").setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        achievements.show({
          icon: "🌌",
          title: "Universo completo",
          text: "Encontraste todos los secretos escondidos."
        });
      }, 900);
    }
  };

  update();
  addEventListener("secretunlocked", update);
}


function setupCake() {
  if (CONFIG.cake) {
    $("#cakeTitle").textContent = CONFIG.cake.title;
    $("#cakeSubtitle").textContent = CONFIG.cake.subtitle;
  }

  const candles = $$(".candle");
  let outCount = 0;

  candles.forEach(candle => {
    candle.addEventListener("click", () => {
      if (candle.classList.contains("is-out")) return;

      candle.classList.add("is-out");
      outCount += 1;
      navigator.vibrate?.(12);

      const rect = candle.getBoundingClientRect();
      particles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 6, "✦");

      if (outCount === candles.length) {
        celebration.confetti({ count: 38 });
        universe.meteor(true);

        $("#cakeMessage").textContent =
          CONFIG.cake?.completed ||
          "Espero que todo lo bonito que deseas encuentre la forma de llegar a ti.";

        $("#cakeMessage").classList.add("is-visible");

        secrets.unlock("cake", {
          icon: "🎂",
          title: "Deseo pedido",
          text: "Apagaste todas las velitas."
        });
      }
    });
  });
}

function setupEnvelope() {
  const envelope = $("#envelope");
  if (!envelope) return;

  envelope.addEventListener("click", () => {
    if (envelope.classList.contains("is-open")) return;

    envelope.classList.add("is-open");
    navigator.vibrate?.(15);

    secrets.unlock("envelope", {
      icon: "✉",
      title: "Carta abierta",
      text: "Abriste la carta que estaba esperando por ti."
    });

    setTimeout(() => {
      const letterScene = $('[data-scene="letter"]');
      letterScene?.scrollIntoView({ behavior: "smooth" });
    }, 1250);
  });
}


function setupInfinityPhotoPalette(){
  const observer=new IntersectionObserver(async entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;const img=entry.target.querySelector("img");if(!img||!img.complete||img.hidden)continue;const color=await palette.extract(img);palette.apply(color);world.discoverPhoto(Number(entry.target.dataset.photoIndex||0));}}, {root:$("#experience"),threshold:.62});
  $$(".scene--photo").forEach(scene=>observer.observe(scene));
}
function setupWorldPhases(){addEventListener("worldphase",event=>{const phase=event.detail.phase;if(phase==="birth")universe.setMood("sleeping");else if(phase==="memory")universe.setMood("warm");else if(phase==="celebration"||phase==="eternal")universe.setMood("celebration");});}
