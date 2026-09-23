// Virtual joystick + A/B buttons. Pointer Events: one code path for touch, pen, mouse.
// Multitouch works because every pointer is tracked by its own pointerId.
//
// Usage:
//   const controls = new TouchControls({ joystick, knob, buttonA, buttonB });
//   controls.state.stick  -> {x, y} normalized -1..1 (y positive = down on screen)
//   controls.state.a / .b -> boolean held state
//   controls.onPress('a', () => {...})  -> edge-triggered callbacks

export class TouchControls {
  constructor({ joystick, knob, buttonA, buttonB }) {
    this.state = { stick: { x: 0, y: 0 }, a: false, b: false };
    this._pressHandlers = { a: [], b: [] };
    this._stickPointerId = null;
    this._joystick = joystick;
    this._knob = knob;
    this._bindJoystick();
    this._bindButton(buttonA, 'a');
    this._bindButton(buttonB, 'b');
  }

  onPress(button, fn) { this._pressHandlers[button].push(fn); }

  _bindJoystick() {
    const zone = this._joystick;
    const radius = () => zone.clientWidth / 2;

    zone.addEventListener('pointerdown', (e) => {
      if (this._stickPointerId !== null) return;   // one finger on the stick
      this._stickPointerId = e.pointerId;
      zone.setPointerCapture(e.pointerId);
      this._moveStick(e);
      e.preventDefault();
    });
    zone.addEventListener('pointermove', (e) => {
      if (e.pointerId === this._stickPointerId) this._moveStick(e);
    });
    const release = (e) => {
      if (e.pointerId !== this._stickPointerId) return;
      this._stickPointerId = null;
      this.state.stick.x = 0;
      this.state.stick.y = 0;
      this._knob.style.transform = '';
    };
    zone.addEventListener('pointerup', release);
    zone.addEventListener('pointercancel', release);

    this._moveStick = (e) => {
      const rect = zone.getBoundingClientRect();
      // getBoundingClientRect is post-scale; normalize by rect size so the
      // stick feels identical at any letterbox scale.
      let dx = e.clientX - (rect.left + rect.width / 2);
      let dy = e.clientY - (rect.top + rect.height / 2);
      const r = rect.width / 2;
      const len = Math.hypot(dx, dy);
      if (len > r) { dx = (dx / len) * r; dy = (dy / len) * r; }
      this.state.stick.x = dx / r;
      this.state.stick.y = dy / r;
      const px = (dx / r) * radius();
      const py = (dy / r) * radius();
      this._knob.style.transform = `translate(${px}px, ${py}px)`;
    };
  }

  _bindButton(el, name) {
    const set = (down, e) => {
      this.state[name] = down;
      el.classList.toggle('down', down);
      if (down) this._pressHandlers[name].forEach((fn) => fn());
      if (e) e.preventDefault();
    };
    el.addEventListener('pointerdown', (e) => { el.setPointerCapture(e.pointerId); set(true, e); });
    el.addEventListener('pointerup', (e) => set(false, e));
    el.addEventListener('pointercancel', (e) => set(false, e));
  }
}
