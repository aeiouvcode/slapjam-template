# Phone performance guardrails

Budgets for the jam build. Cheap to follow on day one, expensive to retrofit
on the last night.

## Textures

- **No texture or atlas page larger than 2048x2048.** Older phone GPUs cap at
  4096 and memory is the real constraint; 2048 is the safe ceiling. Split
  bigger sheets into more pages, never upscale past it.
- GPU memory for one RGBA8 texture: `w * h * 4 * 1.33` bytes (mipmaps included).
  One 2048x2048 page is about 22 MB. Keep the **total texture budget under
  ~150 MB** so a 2-3 GB phone survives the browser tab.
- Power-of-two sizes. Compress: KTX2/Basis for Three.js, ETC2/ASTC import in
  Godot (the project already enables `import_etc2_astc`).
- Trim transparent padding in sprites before atlasing; padding is paid for in VRAM.

## Rendering

- Pixel ratio is capped at 2 (`scaler.js`): 720x1280 at 2x is 1440x2560, and
  going higher just burns battery and fill-rate.
- Draw calls under ~100 per frame. Atlas sprites, reuse materials, avoid
  per-object shaders.
- Shadows off or a single cheap blob shadow. Real-time shadows on mobile web
  eat the frame budget.
- Cap the frame at 60 fps (requestAnimationFrame / default Godot vsync) and
  pause the loop on `visibilitychange` (already in `main.js`) - a backgrounded
  itch tab rendering at full tilt drains the phone.

## Memory & GC

- Total download under ~20 MB; mobile data and jam-judge patience are both finite.
- No per-frame allocations in the hot loop (no `new Vector3()`, array literals,
  or closures each frame). Pool bullets/particles.
- Keep the JS heap under ~200 MB; mobile Safari kills tabs that balloon.

## Audio

- OGG/MP3, mono for SFX, under ~1 MB per music track. Decode on first use, not at boot.

## Verification

- Test on the real phone, not just devtools. Chrome device toolbar with
  "Mid-tier mobile" + 4x CPU throttle is the floor, not the target.
- Watch for thermal throttle in a 10-minute play session: if frame time climbs
  over time, cut fill-rate (smaller textures, lower pixel ratio) first.
- Handle WebGL context loss (`webglcontextlost` handler is in `main.js`) -
  phone browsers reclaim GPU memory aggressively.
