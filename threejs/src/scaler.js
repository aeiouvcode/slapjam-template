// 720x1280 portrait design surface, scaled to fit any screen (letterboxed, centered).
// All game/UI coordinates live in the 720x1280 space; this module owns the only transform.

export const DESIGN_WIDTH = 720;
export const DESIGN_HEIGHT = 1280;

// Phones with dense screens: cap pixel ratio so the GPU does not rasterize 3x-4x frames.
// 2x of 720x1280 is already 1440x2560, plenty sharp for a jam build.
export const MAX_PIXEL_RATIO = 2;

export function effectivePixelRatio() {
  return Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
}

export function fitStage(stageEl) {
  const scale = Math.min(window.innerWidth / DESIGN_WIDTH, window.innerHeight / DESIGN_HEIGHT);
  stageEl.style.width = DESIGN_WIDTH + 'px';
  stageEl.style.height = DESIGN_HEIGHT + 'px';
  stageEl.style.left = '50%';
  stageEl.style.top = '50%';
  stageEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
  return scale;
}

// Calls cb({scale, pixelRatio}) on attach, resize, and orientation change.
export function watchViewport(stageEl, cb) {
  const handler = () => cb({ scale: fitStage(stageEl), pixelRatio: effectivePixelRatio() });
  window.addEventListener('resize', handler);
  window.addEventListener('orientationchange', handler);
  handler();
}
