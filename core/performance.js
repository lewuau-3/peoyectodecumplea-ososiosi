export function getTier() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return "reduced";

  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const width = innerWidth;

  if (cores <= 4 || memory <= 3 || width < 380) return "medium";
  return "high";
}

export const PRESETS = {
  reduced: { far: 22, mid: 16, near: 8, dust: 0, blur: false },
  medium: { far: 42, mid: 28, near: 15, dust: 7, blur: true },
  high: { far: 70, mid: 45, near: 24, dust: 13, blur: true }
};
