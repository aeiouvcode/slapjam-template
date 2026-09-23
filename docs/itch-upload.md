# itch.io upload pipeline (Slapjam AI #1)

Target: an HTML5 project on itch.io that plays inside the browser embed in
portrait on a phone. The jam page rejects anything that needs a download.

## 1. Build the zip

### Three.js path

```
cd threejs
zip -r ../slapjam-game.zip . -x '.*'
```

Rules that matter:

- `index.html` MUST sit at the zip root, not inside a folder. itch.io looks for
  it there; a nested `threejs/index.html` fails with "no index found".
- All asset paths relative (`./src/main.js`, never `/src/main.js`). The game is
  served from a subpath inside an iframe.
- Keep every dependency in the zip. The template vendors Three.js
  (`vendor/three.module.min.js`) so nothing loads from a CDN at runtime.

### Godot path

1. In Godot 4.3+: `Project > Export`, select the included **Web** preset
   (install export templates when prompted: `Editor > Manage Export Templates`).
2. Export to `build/web/index.html` (the preset already points there).
3. Zip the *contents* of `build/web/` so `index.html` is at the zip root:

```
cd build/web
zip -r ../../../slapjam-game.zip . -x '.*'
```

Preset choices already made for itch:

- `variant/thread_support=false` - single-threaded WASM, so the game boots on
  itch even where cross-origin isolation (SharedArrayBuffer) is unavailable.
- `html/canvas_resize_policy=1` (canvas follows the embed) + project stretch
  `canvas_items`/`expand` - the 720x1280 layout adapts to the iframe size.
- `progressive_web_app/orientation=1` - portrait.

## 2. Create / update the itch project

1. https://itch.io/game/new (needs the itch account; per jam rules the account
  holder may need to do the final upload if itch's browser check stops an agent).
2. **Kind of project: HTML.**
3. Upload the zip, then tick **"This file will be played in the browser"** on
  the uploaded file.
4. **Embed options** (under "Embed in page"):
   - Viewport dimensions: **720 x 1280**.
   - Tick **Fullscreen button** and **Mobile friendly**.
5. Pricing: free (or "No payments") for a jam entry.
6. Game page must **credit every AI tool used** plus all humans on the team
  (jam rule 3). Add a content warning if needed (jam rule 5).
7. Save, open the public page on a real phone in portrait, play one loop.

## 3. Optional: butler (repeat uploads)

For iterating during the jam, `butler` uploads deltas instead of full zips:

```
butler push build/web YOUR-ITCH-NAME/YOUR-GAME:html5
```

Channel `html5` keeps the file browser-playable. Web upload limit is 200 MB
per file; butler raises it to 1 GB. A phone jam game should be far below both.

## 4. Submission checklist

- [ ] Zip has `index.html` at root and boots from a plain static server
- [ ] itch project is HTML kind, embed viewport 720x1280, Mobile friendly ticked
- [ ] Loads over HTTPS inside the itch embed on a real phone, portrait
- [ ] Touch joystick + buttons work with multitouch (stick + A simultaneously)
- [ ] No console errors in mobile Safari AND Chrome/Android
- [ ] AI tools + team credits on the game page
- [ ] Submitted through the jam page before 2026-09-30 14:59:59 UTC

## 5. Common failure modes

- **Black screen / stuck loader (Godot):** usually cross-origin isolation.
  The preset ships `thread_support=false` to avoid this; if you re-enable
  threads, the host MUST send COOP/COEP headers.
- **"No index.html found":** the zip wraps everything in a folder. Re-zip the
  contents, not the folder.
- **Page scrolls instead of steering:** missing `touch-action: none` (already
  in `threejs/index.html`) or the iframe lost pointer focus - the template's
  `html/focus_canvas_on_start` covers the Godot side.
- **Absolute paths:** anything fetched from `/...` 404s inside the embed.
