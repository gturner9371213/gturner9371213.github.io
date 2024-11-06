extends Area2D
signal hit
@export var speed = 400 # How fast the player will move (pixels/sec).
var screen_size # Size of the game window.		

func _ready():
	screen_size = get_viewport_rect().size
	hide()

func _process(delta):
	print("Processing frame...")
	var velocity = Vector2.ZERO # The player's movement vector.
	if Input.is_action_pressed("move_right"):
		#print("Right")
		velocity.x += 1
	if Input.is_action_pressed("move_left"):
		#print("left")
		velocity.x -= 1
	if Input.is_action_pressed("move_down"):
		#print("bury me in smoke")
		velocity.y += 1
	if Input.is_action_pressed("move_up"):
		#print("Can you take me higher")
		velocity.y -= 1

	if velocity.length() > 0:
		velocity = velocity.normalized() * speed
		$AnimatedSprite2D.play()
	else:
		$AnimatedSprite2D.stop()
	position += velocity * delta
	position = position.clamp(Vector2.ZERO, screen_size)
	
	if velocity.x != 0:
		$AnimatedSprite2D.animation = "walk"
		$AnimatedSprite2D.flip_v = false
		# See the note below about the following boolean assignment.
		$AnimatedSprite2D.flip_h = velocity.x < 0
	elif velocity.y != 0:
		$AnimatedSprite2D.animation = "up"
		$AnimatedSprite2D.flip_v = velocity.y > 0
		
func _on_body_entered(body):
	#hide() # Player disappears after being hit.
	hit.emit()	
	await get_tree().create_timer(1.0).timeout # Wait for 1 second before re-enabling
	$CollisionShape2D.set_deferred("disabled", false)  # Re-enable collision after delay
	
  

func start(pos):
	position = pos
	show()
	$CollisionShape2D.disabled = false
