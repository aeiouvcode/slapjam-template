extends Node2D
## Placeholder scene: proves the joystick + buttons plumbing. Replace with jam
## code once the theme drops (2026-09-28 15:00 UTC).

const SPEED := 500.0

@onready var _player: ColorRect = $Player
@onready var _joystick: VirtualJoystick = $TouchControls/Joystick

func _ready() -> void:
	$TouchControls/ButtonA.pressed.connect(func(): _player.color = Color("ffb74d"))
	$TouchControls/ButtonB.pressed.connect(func(): _player.color = Color("4fc3f7"))
	_center_player()

func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_SIZE_CHANGED:
		_center_player()

func _process(delta: float) -> void:
	_player.position += _joystick.direction * SPEED * delta
	var size := get_viewport_rect().size
	_player.position = _player.position.clamp(Vector2(48, 48), size - Vector2(48, 48))

func _center_player() -> void:
	_player.position = get_viewport_rect().size / 2.0
