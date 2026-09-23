# slapjam-template

Reusable portrait-mobile web game template for **Slapjam AI #1** (https://itch.io/jam/slapjam-ai-1).
Prep tooling only: no game design, no game content. Game code gets written inside the jam
window (2026-09-28 15:00 UTC -> 2026-09-30 14:59:59 UTC).

Two engine paths, one shared contract:

| Path | What you get |
| --- | --- |
| `threejs/` | Dependency-free HTML5 template (Three.js r170 vendored locally). Open `index.html` and it runs. |
| `godot/` | Godot 4 project skeleton + Web export preset + touch-control addon. |

Shared contract across both paths:

- **720x1280 portrait** logical resolution, scaled to fit any phone screen (letterboxed, centered).
- **Touch input**: virtual joystick (bottom-left) + two buttons, A and B (bottom-right). Mouse works for desktop testing.
- **itch.io iframe ready**: no server calls required to boot, `index.html` at zip root, viewport meta locked, `touch-action: none`.
- **Phone performance guardrails**: see `docs/performance-guardrails.md` (texture sheets at or under 2048px per page, memory budgets, pixel-ratio cap).
- **itch upload pipeline**: see `docs/itch-upload.md`.

## How a jam build consumes this

### Three.js path (fastest to ship)

1. Copy `threejs/` into your game folder (or fork this repo).
2. Write the game in `src/main.js` where marked (`// GAME CODE`). The scaler and input modules
   should not need changes.
3. Read input each frame from `controls.state`: `state.stick` is a normalized `{x, y}`
   (-1..1, y positive down), `state.a` / `state.b` are booleans.
4. Test: `python3 -m http.server` in the folder, open `http://localhost:8000` in a
   mobile-sized browser window (or device toolbar, 720x1280).
5. Ship: zip the folder contents with `index.html` at the zip root, upload per
   `docs/itch-upload.md`.

### Godot path

1. Open `godot/` as a project in Godot 4.3+.
2. The addon in `addons/slapjam_touch/` provides `VirtualJoystick` and `TouchButton`
   controls, already wired in `touch_controls.tscn` and instanced by `main.tscn`.
3. Display settings are preconfigured: 720x1280 viewport, `canvas_items` stretch,
   `expand` aspect (adapts to taller phones), portrait orientation.
4. Export with the included `Web` preset (`export_presets.cfg`) -> zip the output per
   `docs/itch-upload.md`.

## Rules mapping (jam format requirements)

| Jam requirement | How the template meets it |
| --- | --- |
| Mobile portrait, touch controls | 720x1280 logical stage, joystick + A/B buttons, `touch-action: none` |
| Web build, plays in itch.io browser embed | Plain HTML5, `index.html` at zip root, no build step or server needed (Three.js path) |
| Made with AI | List tools on the game page at submission time (jam rule 3) |

## Repo layout

```
threejs/            Three.js r170 template (vendored, offline-friendly)
  index.html        Stage shell: viewport meta, letterbox fit, control overlay DOM
  src/scaler.js     720x1280 fit-to-screen logic
  src/input.js      Virtual joystick + A/B buttons (pointer events, multitouch)
  src/main.js       Boot + placeholder scene proving input/render plumbing
  vendor/           three.module.min.js (r170, MIT)
godot/              Godot 4 project skeleton
  project.godot     Portrait display settings preconfigured
  export_presets.cfg  Web (HTML5) export preset tuned for itch.io
  addons/slapjam_touch/  VirtualJoystick + TouchButton controls
  main.tscn, main.gd     Placeholder scene proving input plumbing
docs/
  itch-upload.md    Zip-and-upload pipeline for itch.io (web + butler)
  performance-guardrails.md  Phone perf budgets (textures <=2048px, memory, draw calls)
```
