let gamePaused = false

function openPauseMenu(){
  gamePaused = true
  timescale = 0
  if(activeLevel.song.isPlaying()) activeLevel.song.pause()
  if(practiceMode) practiceSong.pause()
}

function closePauseMenu(){
  gamePaused = false
  timescale = 1
  if(!practiceMode && !activeLevel.song.isPlaying() && !player.dead) activeLevel.song.play()
  else if(practiceMode) practiceSong.play()
  player.startJumpDeactivate = true
}

function drawPauseMenu(){
  if(!gamePaused)return
  strokeWeight(0)
  fill(color(0, 0, 0, 180))
  rect(0, 0, width, height)

  textAlign(CENTER, CENTER)
  textSize(height/12)
  fill("#FFFF00")
  stroke("black")
  strokeWeight(height/60)
  text("Paused", width*0.5, height*0.075)

  if(!endless){
    buttonRect(width*0.5, height*0.5 - height*0.15, width / 5, height/ 10, "Continue", height / 45, closePauseMenu)
    buttonRect(width*0.5, height*0.5, width / 5, height/ 10, (practiceMode ? "Normal Mode" : "Practice Mode"), height / 45, (practiceMode ? () => {closePractice(); closePauseMenu()} : practiceSetup))
    buttonRect(width*0.5, height*0.5 + height*0.15, width / 5, height/ 10, "Exit Game", height / 45, () => {closePauseMenu(); closeLevel()})
  }else{
    buttonRect(width*0.5, height*0.5 - height*0.075, width / 5, height/ 10, "Continue", height / 45, closePauseMenu)
    buttonRect(width*0.5, height*0.5 + height*0.075, width / 5, height/ 10, "Exit Game", height / 45, () => {closePauseMenu(); closeLevel()})
  }
}
