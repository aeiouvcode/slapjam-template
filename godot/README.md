# Godot 4 path

Open this folder as a project in Godot 4.3 or newer. Everything needed for a
compliant portrait web build is preconfigured:

- `project.godot` - 720x1280 viewport, `canvas_items` stretch with `expand`
  aspect (adapts to taller phones), portrait orientation, Mobile renderer.
- `export_presets.cfg` - a **Web** preset tuned for itch.io (single-threaded
  WASM, canvas resize, portrait). Export path: `build/web/index.html`.
- `addons/slapjam_touch/` - the touch controls:
  - `VirtualJoystick` (`virtual_joystick.gd`): read `.direction` (normalized
    Vector2, y positive down) or connect to `changed`.
  - `TouchButton` (`touch_button.gd`): read `.is_down` or connect to
    `pressed` / `released`. Set `label` to rename.
  - `touch_controls.tscn`: joystick bottom-left, A/B bottom-right on a
    CanvasLayer, multitouch-safe (each control tracks its own touch index).
- `main.tscn` / `main.gd` - placeholder scene that moves a square with the
  joystick and tints it on button presses. Replace during the jam.

Desktop testing works out of the box: `project.godot` sets
`pointing/emulate_touch_from_mouse=true`, so the mouse drives the touch
controls in an editor run.

Upload the export per `../docs/itch-upload.md`.
