let camera; //Camera Object
const camLockBorder = 0.5 //Size of border at top and bottom of screen when camera is locked

function cameraSetup(){
  camera = new Camera()
  //camera.lock()
}

function cameraUpdate(){
  camera.updateOffset()
  if(camera.locked){
    if(camera.groundPosition != 1) camera.animateGround(1) //ground animation
    if(camera.topLock != camera.offsetY) camera.adjustPosition() //Camera is locked but not on position, move it
  }else{
    if(camera.groundPosition != 0) camera.animateGround(-1) //Move ground away if unlocked but still in
  }
  //camera.debug()
}

//Delete data that isnt neccesary anymore when leaving Game
function deleteCamera(){
  camera = {}
}

class Camera{
  constructor(){
    this.offsetX = 0; //Offset from 0 point in x direction in units
    this.offsetY = 0.733*zoom; //Offset from 0 point in y direction in units
    this.movement = true //Says if camera should move or not

    this.yitBorder = 0.375*zoom //Inner Border of the y Axis top
    this.yotBorder = 0.2333*zoom //Outer Border of the y Axis top
    this.yibBorder = 0.265*zoom //Inner Border of the y Axis bottom
    this.yobBorder = 0.13*zoom //Outer Border of the y Axis bottom
    this.xBorder = 4 //at which x coordinate to move player

    this.slowSpeed = 4
    this.fastSpeed = 35

    this.locked = false
    this.topLock = 0
    this.downLock = 0

    this.groundPosition = 0 //Used for animation of ground moving up when locking camera, ranges from 0-1
    this.groundAdjustSpeed = 3 //Determines how quick animation goes
    this.cameraAdjustSpeed = 6 //Determines how quick camera adjusts itself when locking
  }

  updateOffset(){
    if(this.locked || !this.movement) return
    //X position gets moved in player.move()
    
    //If player is inside of Inner Border, move Player with speed matching to distance from Outer Border
    if(player.y-this.offsetY > -this.yitBorder){
      const toMove = map(player.y, -this.yitBorder + this.offsetY, -this.yotBorder + this.offsetY, this.slowSpeed*sdeltaTime, this.fastSpeed*sdeltaTime);
      this.offsetY += toMove
    }else if (player.y - player.width - this.offsetY < -uheight + this.yibBorder){
      const toMove = map(player.y - player.width, -uheight + this.yibBorder + this.offsetY, -uheight + this.yobBorder + this.offsetY, this.slowSpeed*sdeltaTime, this.fastSpeed*sdeltaTime);
      this.offsetY -= toMove
    }
  }

  //Animation of ground moving in when locking camera, dir says if animate in or out
  animateGround(dir){
    this.groundPosition += (this.groundAdjustSpeed*sdeltaTime*dir)
    if(dir == 1 && this.groundPosition > 1) this.groundPosition = 1 //Stop animation
    else if(dir == -1 && this.groundPosition < 0) this.groundPosition = 0 //Stop animation
  }
  
  //Camera is locked but not on position, move it
  adjustPosition(){
    if(this.topLock > this.offsetY){ //Camera is under intended position, move it up
      this.offsetY += (this.cameraAdjustSpeed*sdeltaTime)
      if(this.offsetY > this.topLock) this.offsetY = this.topLock
    }else{ //Camera is above intended position, move it down
      this.offsetY -= (this.cameraAdjustSpeed*sdeltaTime)
      if(this.offsetY < this.topLock) this.offsetY = this.topLock
    }
  }

  debug(){
    //show Borders, for debugging purposes
    fill(0, 255, 0, 120)
    rect(0, 0, width, this.yitBorder * u)
    rect(0, height - this.yibBorder * u, width, this.yibBorder * u)

    fill(255, 0, 0, 120)
    rect(0, 0, width, this.yotBorder * u)
    rect(0, height - this.yobBorder * u, width, this.yobBorder * u)

    line(this.xBorder*u, 0, this.xBorder*u, height)
  }

  //lock y Camera in place, object is the portal which caused the camera to lock
  lock(object = {y:camera.offsetY-4}){
    this.locked = true;
    this.topLock = round(object.y+4)+camLockBorder //Plus 4 because it will be 9 tall, so with 4 added portal will be in the middle

    if(this.topLock < uheight - camLockBorder) {this.topLock = uheight - camLockBorder} //if below camera would be below ground, move it up
    else if(this.topLock > ceilingLimit) {this.topLock = ceilingLimit} //prevent camera from going above ceiling

    this.downLock = this.topLock - uheight
  }

  //unlock y of camera
  unlock(){
    this.locked = false;
  }
}
