export const easing = {
  linear: t => t,
  outCubic: t => 1 - Math.pow(1 - t, 3),
  outQuint: t => 1 - Math.pow(1 - t, 5),
  inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  inOutCubic: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
};

export function tween({ duration = 700, from = 0, to = 1, ease = easing.outCubic, update, complete }) {
  const start = performance.now();

  const frame = now => {
    const raw = Math.min(1, (now - start) / duration);
    update(from + (to - from) * ease(raw));
    if (raw < 1) requestAnimationFrame(frame);
    else complete?.();
  };

  requestAnimationFrame(frame);
}
