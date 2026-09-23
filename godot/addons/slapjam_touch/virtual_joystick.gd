class_name VirtualJoystick
extends Control
## Portrait-mobile virtual joystick (Godot 4, touch + mouse).
## Drop into a CanvasLayer. Read `direction` or connect to `changed`.
## direction: normalized Vector2, -1..1 on each axis, y positive = down on screen.

signal changed(direction: Vector2)

@export var deadzone := 0.15
## Knob travel in pixels at the 720x1280 reference resolution.
@export var travel := 80.0

var direction := Vector2.ZERO
var _pointer := -1  ## touch index, or -2 while the mouse is driving it

@onready var _knob: Control = $Knob

func _ready() -> void:
	# Events arrive via _input with a region test, so this control never
	# swallows taps meant for the buttons next to it.
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	_reset_knob()

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed and _pointer == -1 and _inside(event.position):
			_pointer = event.index
			_update(event.position)
		elif not event.pressed and event.index == _pointer:
			_release()
	elif event is InputEventScreenDrag and event.index == _pointer:
		_update(event.position)
	elif event is InputEventMouseButton:
		if event.pressed and _pointer == -1 and _inside(event.position):
			_pointer = -2
			_update(event.position)
		elif not event.pressed and _pointer == -2:
			_release()
	elif event is InputEventMouseMotion and _pointer == -2:
		_update(event.position)

func _inside(p: Vector2) -> bool:
	# Generous grab zone around the visual base.
	return get_global_rect().grow(48.0).has_point(p)

func _update(p: Vector2) -> void:
	var offset := p - (global_position + size / 2.0)
	if offset.length() > travel:
		offset = offset.normalized() * travel
	var d: Vector2 = offset / travel
	if d.length() < deadzone:
		d = Vector2.ZERO
	direction = d
	if _knob:
		_knob.position = size / 2.0 + offset - _knob.size / 2.0
	changed.emit(direction)

func _release() -> void:
	_pointer = -1
	direction = Vector2.ZERO
	_reset_knob()
	changed.emit(Vector2.ZERO)

func _reset_knob() -> void:
	if _knob:
		_knob.position = size / 2.0 - _knob.size / 2.0
