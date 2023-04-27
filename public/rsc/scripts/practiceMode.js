let practiceMode = false //Says if practiceMode is active
let checkpoints = [] //List of checkpoints, in it player, level and camera copy are stored
const levelSave = ["placementIndex"] //What values from level object to save
const playerSave = ["x", "y", "xVelocity", "yVelocity", "gravitySwitch", "gameMode", "mini", "rotation"]
const cameraSave = ["offsetX", "offsetY", "movement", "locked", "topLock", "downLock"]

function practiceSetup(){
  practiceMode = true
  resetLevel(activeLevel)
  activeLevel.song.stop()
  closePauseMenu()
  checkpoints = []
}

function closePractice(){
  practiceMode = false
  checkpoints = []
  practiceSong.stop()
  if(gameState==1) resetLevel(activeLevel) //Reset level if still in game
}

function practiceUI(){
  if(!practiceSong.isPlaying() && !gamePaused) {practiceSong.play(); console.log("started")}

  for(let i = 0; i < checkpoints.length; i++){
    checkpoints[i].draw()
  }

  textAlign(CENTER, CENTER)
  textSize(height/50)
  fill("white")
  stroke("black")
  strokeWeight(height/150)
  text("Y to place Checkpoint", width*0.4, height*0.95)
  text("X to delete Checkpoint", width*0.6, height*0.95)
}

function practiceKeyPressed(){
  if(!practiceMode || player.completedLevel) return //prevent from deleting or placing checkpoints if level already complete

  if(keyCode == 89 && !player.dead) checkpoints.push(new Checkpoint(player.x, player.y)) //y, place another checkpoint
  else if(keyCode == 88) checkpoints.pop()//x, delete last checkpoint  
}

function loadCheckpoint(){
  if(checkpoints.length == 0) return
  const checkpoint = checkpoints[checkpoints.length-1] //get last checkpoint

  //apply player values
  player = Object.assign(player, checkpoint.player)
  player.switchMode(player.gameMode)
  player.startJumpDeactivate = false
  player.onGround = false

  //get correct placementindex
  let placementIndex = checkpoint.level.placementIndex
  if(placementIndex >= activeLevel.allObjects.length) placementIndex = activeLevel.allObjects.length-1 //correct placement index if above object length

  while(activeLevel.allObjects[placementIndex][1] > camera.offsetX && placementIndex > 0) placementIndex-- //go back until placement index is behind camera, this way all in view objects get spawned again
  activeLevel.placementIndex = placementIndex

  //Apply camera values
  Object.assign(camera, checkpoint.camera)
}

class Checkpoint{
  constructor(x, y){
    this.x = x
    this.y = y

    //Save player data
    this.player = {}
    for(const value of playerSave){
      this.player[value] = player[value]
    }
    
    //Save Level data
    this.level = {}
    for(const value of levelSave){
      this.level[value] = activeLevel[value]
    }

    //Save camera data
    this.camera = {}
    for(const value of cameraSave){
      this.camera[value] = camera[value]
    }
  }

  draw(){
    unitImage(practiceCheckpointImg, this.x, this.y, 1, 1)
  }
}