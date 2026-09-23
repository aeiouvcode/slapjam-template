class_name TouchButton
extends Control
## Single touch button (A / B) for portrait-mobile Godot 4 web builds.
## Multitouch-safe: tracks its own touch index, so it works while the
## joystick is held. Read `is_down` or connect to `pressed` / `released`.

signal pressed
signal released

@export var label := "A":
	set(value):
		label = value
		if is_inside_tree() and has_node("Label"):
			$Label.text = value

var is_down := false
var _pointer := -1

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	$Label.text = label

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed and _pointer == -1 and _inside(event.position):
			_pointer = event.index
			_set_down(true)
		elif not event.pressed and event.index == _pointer:
			_release()
	elif event is InputEventScreenDrag and event.index == _pointer and not _inside(event.position):
		# Finger slid off the button: treat as release.
		_release()
	elif event is InputEventMouseButton:
		if event.pressed and _pointer == -1 and _inside(event.position):
			_pointer = -2
			_set_down(true)
		elif not event.pressed and _pointer == -2:
			_release()

func _inside(p: Vector2) -> bool:
	return get_global_rect().has_point(p)

func _set_down(down: bool) -> void:
	is_down = down
	if has_node("Base"):
		$Base.modulate = Color(1, 1, 1, 0.5) if down else Color(1, 1, 1, 0.18)
	(pressed if down else released).emit()

func _release() -> void:
	_pointer = -1
	_set_down(false)
