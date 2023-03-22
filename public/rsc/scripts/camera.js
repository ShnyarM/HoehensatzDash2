let camera; //Camera Object

function cameraSetup(){
  camera = new Camera()
  //camera.lock()
}

function cameraDraw(){
  camera.updateOffset()
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

    this.yitBorder = 0.375*zoom //Inner Border of the y Axis top
    this.yotBorder = 0.2333*zoom //Outer Border of the y Axis top
    this.yibBorder = 0.265*zoom //Inner Border of the y Axis bottom
    this.yobBorder = 0.13*zoom //Outer Border of the y Axis bottom
    this.xBorder = 4 //at which x coordinate to move player

    this.slowSpeed = 8
    this.fastSpeed = 20

    this.locked = false
  }

  updateOffset(){
    if(this.locked) return
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

  //lock y Camera in place
  lock(){
    this.locked = true;
    this.topLock = this.offsetY
    if(this.topLock < 9) {this.topLock = 9; this.offsetY = 9}
    this.downLock = this.offsetY - uheight
  }

  //unlock y of camera
  unlock(){
    this.locked = false;
  }
}
