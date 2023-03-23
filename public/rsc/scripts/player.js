let player; //Own Player

function playerSetup(){
  player = new Player()
}

function playerUpdate(){
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
    this.gravityStrength = 4.2*this.jumpStrength
    this.gravitySwitch = 1 //-1 is upside down

    this.rotation = 0
    this.rotationSpeed = 360

    this.input = false
    this.onGround = true
    this.groundHeight = 0
    this.canUseRing = true

    this.dead = false
    this.deathAnimationTime = 0
    this.deathAnimationTimeMax = 1 //death animation time in seconds

    this.startJumpDeactivate = true //Make player unable to jump at start until letting go to stop jump at start
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
      if(!this.onGround && this.y-this.height <= this.groundHeight){ //put player on ground if touching ground
        this.onGround = true
        this.yVelocity = 0
        this.y = this.groundHeight+this.height
        this.rotation = 0
      }
    }else{//upside down
      if(!this.onGround && this.y >= this.groundHeight){ //put player on ground if touching ground
        this.onGround = true
        this.yVelocity = 0
        this.y = this.groundHeight
        this.rotation = 0
      }
    }
    
    //Kill player if hit ceiling limit or ground when upside down
    if(player.y >= ceilingLimit || this.gravitySwitch == -1 && this.y - this.height <= 0){
      this.dead = true
    }
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

    this.rotation += this.rotationSpeed*sdeltaTime*this.gravitySwitch
    this.yVelocity -= this.gravityStrength*sdeltaTime*this.gravitySwitch
  }

  //Switch gravity, if instant velocity also flips (blue jump ring)
  switchGravity(){
    this.gravitySwitch = -this.gravitySwitch
    this.onGround = false
  }

  //Check if player can and wants to jump
  checkJump(){
    if(!this.input || !this.onGround) return
    
    this.jump()
  }

  //Apply upwards velocity to player, strength is how strong with 1 = normal jump
  jump(strength = 1){
    this.yVelocity = this.jumpStrength*strength*this.gravitySwitch
    this.onGround = false
    this.canUseRing = false
  }
  
  //Check if block is under player and change ground height accordingly
  checkGroundHeight(){
    if(this.gravitySwitch == 1){ //normal gravity
      if(activeLevel.groundObjects.length == 0){this.groundHeight = 0; return}

      let highest = 0
      for(const block of activeLevel.groundObjects){
        //Check if block is under player and higher than highest
        if(block.x < this.x+this.width && block.x+block.width > this.x && block.y-block.boxOffsetY <= this.y-this.height && block.y > highest) 
          highest = block.y
      }
      this.groundHeight = highest

      if(this.onGround && this.y-this.height != highest){ //Make player fall if not on block and in air
        this.onGround = false
      }
    }else{ //Upside down
      if(activeLevel.groundObjects.length == 0){this.groundHeight = ceilingLimit; return}

      let highest = ceilingLimit
      for(const block of activeLevel.groundObjects){
        //Check if block is under player and higher than highest
        if(block.x < this.x+this.width && block.x+block.width > this.x && block.y-block.boxOffsetY-block.boxHeight >= this.y && block.y < highest) 
          highest = block.y-block.height
      }
      this.groundHeight = highest

      if(this.onGround && this.y != highest){ //Make player fall if not on block and in air
        this.onGround = false
      }
    }
  }

  deathAnimation(){
    this.deathAnimationTime += sdeltaTime
    if(this.deathAnimationTime >= this.deathAnimationTimeMax){
      resetLevel()
    }
  }

  update(){
    activeLevel.interactObjects.forEach(element => {
      collisionObject(this, element)   
    }); //Check for interactable Objects

    this.checkJump() //Maybe not on right place
    this.applyGravity()
    this.checkGroundHeight()
    this.move()

    //check for obsticles
    activeLevel.groundObjects.forEach(element => {
      collisionObject(this, element)   
    });
    activeLevel.deathObjects.forEach(element => {
      collisionObject(this, element)   
    });
  }
}