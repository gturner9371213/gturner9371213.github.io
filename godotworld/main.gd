extends Node

@export var mob_scene: PackedScene
var score
var player_health = 100

func _ready():
	#new_game()
	pass
func show_message(text):
	$Message.text = text
	$Message.show()
	$MessageTimer.start()	

func _on_player_hit():
	player_health -= 20 
	$HealthBar.value = player_health
	if player_health <= 0:
		game_over()
	

func game_over():
	$ScoreTimer.stop()
	$MobTimer.stop()
	$HUD.show_game_over()
	$Music.stop()
	$DeathSound.play()

func update_score(score):
	$ScoreLabel.text = str(score)	
	

func new_game():
	score = 0
	player_health = 100  # Initialize health
	$HealthBar.max_value = 100  # Set max health value
	$HealthBar.value = player_health  # Set current health value
	$Player.start($StartPosition.position)
	$StartTimer.start()
	$HUD.update_score(score)
	$HUD.show_message("Get Ready")
	get_tree().call_group("mobs", "queue_free")
	$Music.play()

func _on_score_timer_timeout():
	score += 1
	$HUD.update_score(score)

func _on_start_timer_timeout():
	$MobTimer.start()
	$ScoreTimer.start()
	$HUD.update_score(score)

func _on_mob_timer_timeout():
	print("Mob Timer Triggered")
	
	if mob_scene == null:
		print("Mob scene is not assigned!")
		return # Exit early if no mob scene
	
	# Create a new instance of the Mob scene.
	var mob = mob_scene.instantiate()
	print("Mob instantiated.")
	
	# Choose a random location on Path2D.
	var mob_spawn_location = $MobPath/MobSpawnLocation
	if mob_spawn_location == null:
		print("MobSpawnLocation is missing!")
		return # Exit early if the spawn location is missing
	
	print("MobSpawnLocation found.")
	mob_spawn_location.progress_ratio = randf()

	# Set the mob's direction perpendicular to the path direction.
	var direction = mob_spawn_location.rotation + PI / 2

	# Set the mob's position to a random location.
	mob.position = mob_spawn_location.position
	print("Mob position: ", mob.position)

	# Add some randomness to the direction.
	direction += randf_range(-PI / 4, PI / 4)
	mob.rotation = direction

	# Choose the velocity for the mob.
	var velocity = Vector2(randf_range(150.0, 250.0), 0.0)
	mob.linear_velocity = velocity.rotated(direction)

	# Spawn the mob by adding it to the Main scene.
	add_child(mob)
	print("Mob added to scene.")


#func _on_health_bar_value_changed(value: float) -> void:
	#pass # Replace with function body.
