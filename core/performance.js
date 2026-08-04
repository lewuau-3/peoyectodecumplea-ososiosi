export function getTier() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return "reduced";

  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const touchDevice = matchMedia("(pointer: coarse)").matches;
  const narrow = innerWidth < 820;

  // En móviles y tablets priorizamos fluidez.
  if (touchDevice || narrow || cores <= 6 || memory <= 4) return "mobile";
  return "high";
}

export const PRESETS = {
  reduced: {
    far: 16, mid: 10, near: 5, dust: 0, blur: false,
    galaxy: 120, pixelRatio: 1, trails: false, ambient: false
  },
  mobile: {
    far: 28, mid: 17, near: 8, dust: 3, blur: false,
    galaxy: 220, pixelRatio: 1.15, trails: false, ambient: true
  },
  high: {
    far: 52, mid: 31, near: 15, dust: 7, blur: true,
    galaxy: 480, pixelRatio: 1.5, trails: true, ambient: true
  }
};
