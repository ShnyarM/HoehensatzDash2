let player; //Own Player
let modeConstants = {
  "0":{ //cube
    width: 1,
    height: 1,
    gravityStrength: 73.5,
    ceilingDeath: true,
    cameraLock: false,
    rotationActive: true
  },
  "1":{ //Ship
    width: 1.5,
    height: 0.75,
    gravityStrength: 40,
    ceilingDeath: false,
    cameraLock: true,
    rotationActive: false
  },
  "2":{ //Ball
    width: 1,
    height: 1,
    gravityStrength: 73.5,
    ceilingDeath: true,
    cameraLock: true,
    rotationActive: true
  },
  "3":{ //Ufo
    width: 1.5,
    height: 1,
    gravityStrength: 73.5,
    ceilingDeath: false,
    cameraLock: true,
    rotationActive: false
  },
  "4":{ //Wave
    width: 1,
    height: 1,
    gravityStrength: 0,
    ceilingDeath: false,
    cameraLock: true,
    rotationActive: false
  },
  "6":{ //Spider
    width: 1,
    height: 1,
    gravityStrength: 73.5,
    ceilingDeath: true,
    cameraLock: true,
    rotationActive: false
  }
}

function playerSetup(){
  player = new Player()
}

function playerDraw(){
  if(!player.dead){
    player.input = player.checkInput()
    if(player.startJumpDeactivate && player.input) player.input = false //Deactivate player input if jump block active
    player.update();
  }else{
    player.deathAnimation()
  }

  player.draw()
}

function playerMouseClicked(){

}

function playerMouseReleased(){

}

function playerKeyPressed(){

}

function playerMouseWheel(event){

}

//Delete data that isnt neccesary anymore when leaving Game
function deletePlayer(){
  player = {}
}

//Own Player
class Player{
  constructor(){
    this.width = 1
    this.height = 1
    this.x = 0
    this.y = this.height

    this.xVelocity = 9
    this.yVelocity = 0
    this.jumpStrength = 17.5
    this.gravityStrength = 73.5//4.2*this.jumpStrength
    this.gravitySwitch = 1 //-1 is upside down

    this.gameMode = 0 //0 = cube, 1 = ship
    this.ceilingDeath = true

    this.rotation = 0
    this.rotationSpeed = 360

    this.input = false
    this.onGround = true
    this.lowCeiling = 0
    this.highCeiling = ceilingLimit
    this.canUseRing = true

    this.dead = false
    this.deathAnimationTime = 0
    this.deathAnimationTimeMax = 1 //death animation time in seconds

    this.startJumpDeactivate = true //Make player unable to jump at start until letting go to stop jump at start
    Object.assign(this, modeConstants[this.gameMode])
  }
  
  //Draw player on screen
  draw(){
    fill("red")
    //let xDraw = this.x-camera.offsetX <= 3 ? this.x : 3.05+camera.offsetX //if at camera border draw at fixed point to avoid stuttering
    let xDraw = this.x

    if(this.rotation == 0) unitImage(icon, xDraw, this.y, this.width, this.height)
    else rotateUnitImage(icon, xDraw+this.width*0.5, this.y-this.height*0.5, this.width, this.height, this.rotation) //draw rotated image if is rotating

    //unitRect(this.x, this.y, this.width, this.height)
  }

  //Move player according to velocity
  move(){
    this.x += (this.xVelocity*sdeltaTime) //add x
    
    //If player touches border/line, move camera to right
    if(this.x + this.width - camera.offsetX >= camera.xBorder){
      camera.offsetX = player.x - 3.05
    }

    this.y += (this.yVelocity*sdeltaTime) //add y

    if(this.gravitySwitch == 1){//put player on ground if touching ground
      if(this.y-this.height <= this.lowCeiling){ //put player on ground if touching ground
        this.onGround = true
        this.yVelocity = 0
        this.y = this.lowCeiling+this.height
        this.rotation = 0
      }
      if(!this.ceilingDeath && this.y >= this.highCeiling){ //Put player on ceiling if gamemode allows it
        this.yVelocity = 0
        this.y = this.highCeiling
        this.rotation = 0
      }
    }else{//upside down
      if(this.y >= this.highCeiling){ //put player on ground if touching ground, MAYBE EVERYTHING IS BROKEN NOW, CHECK IF NOT ON GROUND
        this.onGround = true
        this.yVelocity = 0
        this.y = this.highCeiling
        this.rotation = 0
      }
      if(!this.ceilingDeath && this.y-this.height <= this.lowCeiling){ //Put player on ceiling if gamemode allows it
        this.yVelocity = 0
        this.y = this.lowCeiling+this.height
        this.rotation = 0
      }
    }
    
    //Kill player if hit ceiling limit or ground when upside down
    if(player.y >= ceilingLimit || this.gravitySwitch == -1 && this.y - this.height <= 0 && this.ceilingDeath){
      this.dead = true
    }
  }

  //Switch to new gamemode
  switchMode(newMode){
    if(newMode == this.gameMode || !modeConstants[newMode]) return //Mode doesnt exist or player is already in that mode

    this.gameMode = newMode //assign new Mode
    Object.assign(this, modeConstants[newMode]) //change variables to fit with new mode
    if(modeConstants[newMode].cameraLock) camera.lock() //Lock or unlock camera depending on gamemode
    else camera.unlock()
  }

  //Check if button to perform action is clicked
  checkInput(){
    if(mouseIsPressed) return true //Check mouse
    if(keyIsDown(32)) return true //check spacebar

    //if here, nothing is being clicked
    if(player.startJumpDeactivate && !player.input) player.startJumpDeactivate = false //Deactivate jump block if player is not pressing
    if(!this.canUseRing) this.canUseRing = true //Make rings available again since player is not pressing

    return false
  }

  //add gravity force to force player back down
  applyGravity(){
    if(this.onGround) return

    if(this.rotationActive) this.rotation += this.rotationSpeed*sdeltaTime*this.gravitySwitch
    this.yVelocity -= this.gravityStrength*sdeltaTime*this.gravitySwitch
  }

  //Switch gravity, if instant velocity also flips (blue jump ring)
  switchGravity(){
    this.gravitySwitch = -this.gravitySwitch
    this.onGround = false
  }

  //Check if player can and wants to jump
  cubeInput(){
    if(!this.input || !this.onGround) return
    
    this.jump()
  }

  //apply ship acceleration when there is input
  shipInput(){
    if(!this.input) return
    
    this.yVelocity += this.gravityStrength*sdeltaTime*this.gravitySwitch*2 //twice as strong as gravity since gravity will be applied either way
    this.canUseRing = false
  }

  //change gravity if on ground and input during ball mode
  ballInput(){
    if(!this.input || !this.onGround || !this.canUseRing) return
    
    this.switchGravity()
    this.canUseRing = false
  }

  //Make player jump when clicked
  ufoInput(){
    if(!this.input || !this.canUseRing) return
    
    this.jump()
  }

  //change velocity to constants
  waveInput(){
    if(this.input) {this.yVelocity = this.xVelocity*this.gravitySwitch; this.canUseRing = false; this.rotation = 45}
    else {this.yVelocity = -this.xVelocity*this.gravitySwitch; this.rotation = 315}
  }

  //teleport up and down when clicked
  spiderInput(){
    if(!this.input || !this.onGround || !this.canUseRing) return
    
    if(this.gravitySwitch == 1) this.y = this.highCeiling //Teleport up
    else this.y = this.lowCeiling + this.height //Teleport down

    this.switchGravity()
    this.canUseRing = false
  }

  //Apply upwards velocity to player, strength is how strong with 1 = normal jump
  jump(strength = 1){
    this.yVelocity = this.jumpStrength*strength*this.gravitySwitch
    this.onGround = false
    this.canUseRing = false
  }
  
  //Check for collision to make player die
  checkCollision(){
    for(const block of blocks){
      if(block.collision()) {this.dead = true; return}
    }

    for(const spike of spikes){
      if(spike.collision()) {this.dead = true; return}
    }
  }

  //Get highest block from under player
  getLowCeiling(){
    let highest = camera.locked ? camera.downLock : 0 //Set lowest possible ceiling
    if(highest < 0) highest = 0 //increase lowest if below ground

    if(this.gameMode==4){this.lowCeiling = highest; console.log(highest); return} //Ignore blocks completly if in wave gamemode

    for(const block of groundObjects){
      //Check if block is under player and higher than highest
      if(block.x < this.x+this.width && block.x+block.width > this.x && block.y-block.boxOffsetY <= this.y-this.height && block.y > highest) 
        highest = block.y
    }
    this.lowCeiling = highest

    if(this.gravitySwitch == 1 && this.onGround && this.y-this.height != highest){ //Make player fall if not on block and in air
      this.onGround = false
    }
  }

  //Get lowest block from above player
  getHighCeiling(){
    let highest = camera.locked ? camera.topLock : ceilingLimit //Set highest possible ceiling
    if(highest > ceilingLimit) highest = ceilingLimit //reduce highest if above ceiling limit

    if(this.gameMode==4) {this.highCeiling = highest; return} //Ignore blocks completly if in wave gamemode

    for(const block of groundObjects){
      //Check if block is under player and higher than highest
      if(block.x < this.x+this.width && block.x+block.width > this.x && block.y-block.boxOffsetY-block.boxHeight >= this.y && block.y-block.height < highest) 
        highest = block.y-block.height
    }
    this.highCeiling = highest

    if(this.gravitySwitch == -1 && this.onGround && this.y != highest){ //Make player fall if not on block and in air
      this.onGround = false
    }
  }


  deathAnimation(){
    this.deathAnimationTime += sdeltaTime
    if(this.deathAnimationTime >= this.deathAnimationTimeMax){
      resetLevel()
    }
  }

  update(){
    interactObjects.forEach(element => {
      collisionObject(this, element)   
    }); //Check for interactable Objects

    switch(this.gameMode){ //Maybe not on right place
      case 0:
        this.cubeInput()
        break;
      case 1:
        this.shipInput()
        break;
      case 2:
        this.ballInput()
        break;
      case 3:
        this.ufoInput()
        break;
      case 4:
        this.waveInput()
        break;
      case 6:
        this.spiderInput()
        break;
    }
    this.applyGravity()
    this.getLowCeiling()
    this.getHighCeiling()
    this.move()

    //check for obsticles
    groundObjects.forEach(element => {
      collisionObject(this, element)   
    });
    deathObjects.forEach(element => {
      collisionObject(this, element)   
    });
  }
}