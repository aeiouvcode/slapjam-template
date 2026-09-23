// Template boot. The placeholder scene below exists ONLY to prove the plumbing:
// renderer + scaler + joystick/buttons work. Replace it with jam code at `// GAME CODE`.

import * as THREE from 'three';
import { DESIGN_WIDTH, DESIGN_HEIGHT, watchViewport, effectivePixelRatio } from './scaler.js';
import { TouchControls } from './input.js';

const stage = document.getElementById('stage');
const canvas = document.getElementById('game-canvas');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setSize(DESIGN_WIDTH, DESIGN_HEIGHT, false);
renderer.setPixelRatio(effectivePixelRatio());

// Orthographic camera mapped 1:1 to design pixels: (0,0) center, +x right, +y up.
// World coords == the same 720x1280 space the DOM controls use.
const camera = new THREE.OrthographicCamera(
  -DESIGN_WIDTH / 2, DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2, -DESIGN_HEIGHT / 2, 0.1, 100
);
camera.position.z = 10;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101418);

watchViewport(stage, () => renderer.setPixelRatio(effectivePixelRatio()));

const controls = new TouchControls({
  joystick: document.getElementById('joystick'),
  knob: document.getElementById('knob'),
  buttonA: document.getElementById('btn-a'),
  buttonB: document.getElementById('btn-b'),
});

// --- placeholder actor (delete when the jam starts) ---
const player = new THREE.Mesh(
  new THREE.PlaneGeometry(96, 96),
  new THREE.MeshBasicMaterial({ color: 0x4fc3f7 })
);
scene.add(player);
controls.onPress('a', () => player.material.color.setHex(0xffb74d));
controls.onPress('b', () => player.material.color.setHex(0x4fc3f7));
// --- end placeholder ---

const clock = new THREE.Clock();
let running = true;
document.addEventListener('visibilitychange', () => {
  running = !document.hidden;   // pause when the itch tab/iframe loses focus
  if (running) clock.getDelta();
});

canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();           // let the browser restore instead of dying on phones
});

function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);  // clamp hitches
  if (!running) return;

  // GAME CODE: read controls.state.stick / .a / .b, update your scene here.
  player.position.x = THREE.MathUtils.clamp(player.position.x + controls.state.stick.x * 500 * dt, -DESIGN_WIDTH / 2 + 48, DESIGN_WIDTH / 2 - 48);
  player.position.y = THREE.MathUtils.clamp(player.position.y - controls.state.stick.y * 500 * dt, -DESIGN_HEIGHT / 2 + 48, DESIGN_HEIGHT / 2 - 48);
  player.rotation.z += dt * 0.8;

  renderer.render(scene, camera);
}
tick();
