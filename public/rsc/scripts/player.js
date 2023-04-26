let player; //Own Player
const normalXVelocity = 9

function playerSetup(){
  player = new Player()
}

function playerUpdate(levelObj){
  if(!player.dead){
    if(!player.completedLevel){
      player.input = player.checkInput()
      if(player.startJumpDeactivate && player.input) player.input = false //Deactivate player input if jump block active
      player.update(levelObj);
    }else player.completionAnimation()

    player.draw()
    //player.drawHitbox()
  }else{
    player.deathAnimation(levelObj)
  }
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
    this.width = 1 //Hitbox of player
    this.height = 1
    this.x = 0
    this.y = this.height

    this.blockHitboxSize = 0.4 //Size of hitbox to for block interactions
    this.blockHitboxOffset = (this.height-this.blockHitboxSize)*0.5 //How much it is offset from original player position

    this.drawnWidth = 1 //Size of player as drawn
    this.drawnHeight = 1
    this.drawOffsetX = 0 //By how much draw will be offset in positive X
    this.drawOffsetY = 0 //By how much draw will be offset in positive Y
    this.image = icon

    this.xVelocity = normalXVelocity
    this.yVelocity = 0
    this.jumpStrength = 17.5
    this.gravityStrength = 73.5//4.2*this.jumpStrength
    this.gravitySwitch = 1 //-1 is upside down

    this.terminalVelocity = 30 //Fastest the player can fall down
    this.terminalVelocityActive = true //Says if terminalvelocity is active in current gamemode

    this.gameMode = 0 //check gamemodeconstants to know which number is which gamemode
    this.mini = false //Says if player is in mini gamemode
    this.ceilingDeath = true

    this.rotation = 0
    this.rotationAdjustSpeed = 700 //How fast rotation adjust to get into locked position
    this.rotationSpeed = 360
    this.rotationBackfireThreshold = 30 //If difference from last 90 degrees rotation point is less than this when landing, rotation will be set back instead smoothly increasing till next 90 degrees point

    this.input = false
    this.onGround = true
    this.lowCeiling = 0
    this.highCeiling = ceilingLimit
    this.canUseRing = true

    this.dead = false
    this.deathAnimationTime = 0
    this.deathAnimationTimeMax = 1 //death animation time in seconds

    this.completedLevel = false //If level has been completed
    this.completedAnimationTime = 0 //At which point completion animation is
    this.completedAnimationTimeMax = 2.5 //death animation time in seconds

    this.startJumpDeactivate = true //Make player unable to jump at start until letting go to stop jump at start

    this.wavePoints = [] //List of coordinates where Wave changed direction to draw a line
    this.yVelocityBefore = 0; //says yvelocity in frame before, only used for wavepoints

    //Used for robot gamemode
    this.robotJumpTime = 0 //How long player has been jumping
    this.robotJumpTimeMax = 1  //Max jump time, constant
    this.robotBoostStrength = 107 //How strong jump is, constant
    this.canRobotJump = true  //shows if player is allowed to thrust

    //Used for walking animations of spider and robot
    this.walkAnimation = 0 //At which point walking animation for spider and robot is
    this.walkAnimationSpeed = 15 //how fast animation goes
    this.robotAnimationDirection = 1 //In which direction animation is currently going, changes in this.robotAnimation

    Object.assign(this, modeConstants[0]) //Set default values
    Object.assign(this, modeConstants[this.gameMode])
  }
  
  //Draw player on screen
  draw(){
    fill("red")

    if(this.gravitySwitch == -1 && this.gameMode != 0 && this.gameMode != 2 && this.gameMode != 4 && this.gameMode != 7){ //If upside and not cube, ball, wave or swing copter, flip image upside down
      rotateUnitImageFlipped(this.image, this.x+this.drawOffsetX, this.y+this.drawOffsetY, this.drawnWidth, this.drawnHeight, 180+this.rotation)
      console.log("fsd")
    }else{
      if(this.rotation % 90 == 0) unitImage(this.image, this.x+this.drawOffsetX, this.y+this.drawOffsetY, this.drawnWidth, this.drawnHeight)
      else rotateUnitImage(this.image, this.x+this.drawOffsetX, this.y+this.drawOffsetY, this.drawnWidth, this.drawnHeight, this.rotation) //draw rotated image if is rotating
    }
  }

  //Draws Hitbox of player
  drawHitbox(){
    fill(color(0, 0, 0, 0))
    stroke("red")
    strokeWeight(0.05*u)
    unitRect(this.x, this.y, this.width, this.height) //Normal hitbox

    stroke("blue")
    unitRect(this.x+this.blockHitboxOffset, this.y-this.blockHitboxOffset, this.blockHitboxSize, this.blockHitboxSize)
  }

  //Move player according to velocity
  move(){
    this.x += (this.xVelocity*sdeltaTime) //add x
    
    //If player touches border/line, move camera to right
    if(this.x + this.width - camera.offsetX >= camera.xBorder && camera.movement){
      camera.offsetX = this.x+this.width-camera.xBorder
    }

    this.y += (this.yVelocity*sdeltaTime) //add y

    if(this.gravitySwitch == 1){//put player on ground if touching ground
      if(this.y-this.height <= this.lowCeiling && this.yVelocity <= 0){ //put player on ground if touching ground
        this.groundTouch()
      }
      if(!this.ceilingDeath && this.y >= this.highCeiling){ //Put player on ceiling if gamemode allows it
        this.yVelocity = 0
        this.y = this.highCeiling
      }
    }else{//upside down
      if(this.y >= this.highCeiling && this.yVelocity >= 0){ //put player on ground if touching ground, MAYBE EVERYTHING IS BROKEN NOW, CHECK IF NOT ON GROUND
        this.groundTouch()
      }
      if(!this.ceilingDeath && this.y-this.height <= this.lowCeiling){ //Put player on ceiling if gamemode allows it
        this.yVelocity = 0
        this.y = this.lowCeiling+this.height
      }
    }
    
    //Kill player if hit ceiling limit or ground when upside down
    if(this.y > ceilingLimit || this.gravitySwitch == -1 && this.y - this.height < 0 && this.ceilingDeath){
      this.die()
    }
  }

  //Check if player has completed Level
  checkCompletion(){
    if(!endless && this.x > activeLevel.lastXCoordinate+8){
      if(editorPlaytest) {stopEditorLevel(); return} //Just return if in editorplaytest mode
      
      this.completedLevel = true //Start animation
      this.completedAnimationStartY = this.y
      camera.movement = false
    }
  }

  //Go throough animation for completion
  completionAnimation(){
    fill(color(0, 0, 0, (this.completedAnimationTime/this.completedAnimationTimeMax)*255)) //Make Background Black
    strokeWeight(0)
    rect(0, 0, width, height)
    if(this.completedAnimationTime >= this.completedAnimationTimeMax) return //Dont advance further if animation is already complete

    this.completedAnimationTime += sdeltaTime //Progress animation
    this.y += (this.completedAnimationTime ** 2)* 0.1 //Move player up
    this.rotation += (this.completedAnimationTime ** 2)*3 //Rotate player
    camera.offsetY += (this.completedAnimationTime ** 1.5)*0.05 //move camera up

    if(this.completedAnimationTime >= this.completedAnimationTimeMax) activeLevel.completed = true //Close level at end of frame
  }

  //Code to be executed when player touches ground
  groundTouch(){
    this.onGround = true
    this.yVelocity = 0
    this.y = this.gravitySwitch == 1 ? this.lowCeiling+this.height : this.highCeiling //Add to height depending on if gravity switched or not
    this.canRobotJump = true //For Robot mode
    this.robotJumpTime = 0
    if(this.gameMode == 0 && this.rotation % 90 < this.rotationBackfireThreshold) this.rotation = floor(this.rotation/90)*90 //turn back rotation incase threshold wasnt exceeded
  }

  //Switch to new gamemode, object is the portal which caused the change
  switchMode(newMode, object = {y:camera.offsetY-4}){
    if(!modeConstants[newMode]) return //Mode doesnt exist or player is already in that mode
    const oldWidth = this.width //Save width and height before change
    const oldHeight = this.height

    this.gameMode = newMode //assign new Mode
    Object.assign(this, modeConstants[0]) //Apply default values before applying values of new Mode$
    if(this.mini) Object.assign(this, modeConstants[10]) //Apply default values of mini before applying values of new Mode

    Object.assign(this, modeConstants[newMode]) //change variables to fit with new mode
    if(this.mini) Object.assign(this, modeConstants[newMode+10]) //change specific values to fit with mini mode

    if(modeConstants[newMode].cameraLock) camera.lock(object) //Lock or unlock camera depending on gamemode
    else camera.unlock()

    if(newMode == 4){ //Delete old wave Points and add one if changing to wave
      this.wavePoints = []
      this.wavePoints.push([this.x+0.5*this.width, this.y-0.5*this.height])
    }

    this.adjustXPosition(oldWidth)
    this.adjustYPosition(oldHeight)
  }

  //Make player mini
  switchToMini(){
    if(this.mini) return //Dont do anything if already mini
    const oldWidth = this.width //Save width and height before change
    const oldHeight = this.height

    Object.assign(this, modeConstants[10]) //Apply default values of mini
    Object.assign(this, modeConstants[this.gameMode+10]) //apply mini values of current mode

    this.mini = true
    this.adjustXPosition(oldWidth)
    this.adjustYPosition(oldHeight)
  }

  //Make player Big
  switchToBig(){
    if(!this.mini) return //Dont do anything if already Big
    const oldWidth = this.width //Save width and height before change
    const oldHeight = this.height

    Object.assign(this, modeConstants[0]) //Apply default values
    Object.assign(this, modeConstants[this.gameMode]) //apply values of current mode

    this.mini = false
    this.adjustXPosition(oldWidth)
    this.adjustYPosition(oldHeight)
  }

  //Adjust position after changing width so the players end stays at the same place
  adjustXPosition(oldWidth){
    if(oldWidth == this.width) return
    
    this.x = this.x+(oldWidth-this.width)
  }

  //Adjust position after changing height so the players mid position stays at the same place
  adjustYPosition(oldHeight){
    if(oldHeight == this.height) return
    
    this.y = this.y-((oldHeight-this.height)*0.5)
  }

  //Check if button to perform action is clicked
  checkInput(){
    if(mouseIsPressed) return true //Check mouse
    if(keyIsDown(32)) return true //check spacebar

    //if here, nothing is being clicked
    if(this.startJumpDeactivate && !this.input) this.startJumpDeactivate = false //Deactivate jump block if player is not pressing
    if(!this.canUseRing) this.canUseRing = true //Make rings available again since player is not pressing

    return false
  }

  //add gravity force to force player back down
  applyGravity(){
    if(this.onGround) return

    //if(!this.terminalVelocityActive || this.gravitySwitch == 1 ? -this.yVelocity < this.terminalVelocity : this.yVelocity < this.terminalVelocity) //Apply gravity if terminal velocity not reached
    if(this.terminalVelocityActive == false || (this.gravitySwitch == 1 ? -this.yVelocity < this.terminalVelocity : this.yVelocity < this.terminalVelocity))
      this.yVelocity -= this.gravityStrength*sdeltaTime*this.gravitySwitch
  }

  //Change rotation based on what is happening
  applyRotationChange(){
    if(this.gameMode == 0){ //cube
      if(!this.onGround) this.rotation += this.rotationSpeed*sdeltaTime*this.gravitySwitch //Spin when in air
      else if(this.rotation % 90 != 0){ //Adjust player rotation once ground is hit
        const rotationBefore = this.rotation //Save rotation player had before adding
        this.rotation += this.rotationAdjustSpeed*sdeltaTime*this.gravitySwitch //Spin when in air

        const rotToReach = (floor(rotationBefore/90)+1)*90 //Find next rotation dividable by 90
        if(this.rotation >= rotToReach) this.rotation = rotToReach //Lock in place once number reached
      }

      if(this.rotation >= 360) this.rotation = this.rotation % 360 //loop back rotation to stay within 360 range
      else if(this.rotation < 0) this.rotation = 360 - this.rotation

    }else if((this.gameMode == 1 || this.gameMode == 7)){ //Perform special calculation for rotation if in ship or swing copter mode
      const tanAlpha = -this.yVelocity/this.xVelocity //Get tan of angle
      const alpha = atan(tanAlpha) //Get degree alpha
      this.rotation = alpha
    }else if(this.gameMode == 2){ //Ball
      this.rotation += this.rotationSpeed*sdeltaTime*this.gravitySwitch //constant rotation
    }
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
    const dir = this.input ? 1 : -1; //In which direction wave is going 

    this.yVelocity = this.xVelocity*this.gravitySwitch*dir*(this.mini ? 2:1)

    if(this.y == this.highCeiling || this.y-this.height == this.lowCeiling) this.rotation = 0 //Make rotation 0 if on ceiling or ground
    else this.rotation = -dir*this.gravitySwitch*45*(this.mini ? 1.41:1)

    
    
    if(this.input) this.canUseRing = false
  }

  //add to velocity when boosting
  robotInput(){
    if(!this.input || !this.canRobotJump || (!this.canUseRing && this.robotJumpTime == 0)){this.canRobotJump = false; return} //Last one: if robotJumptime is not 0 a boost is already going on

    if(this.robotJumpTime == 0) this.jump(0.3) //Add small initial jump when starting boost
    this.yVelocity += (this.robotBoostStrength*sdeltaTime*this.gravitySwitch) //Add velocity
    this.robotJumpTime += (4*sdeltaTime) //Decrease remaining boost time
    this.canUseRing = false

    if(this.robotJumpTime >= this.robotJumpTimeMax) this.canRobotJump = false //Stop boosting if max time is reached
  }

  //teleport up and down when clicked
  spiderInput(levelObj){
    if(!this.input || !this.onGround || !this.canUseRing) return
    
    if(this.gravitySwitch == 1) this.y = this.highCeiling //Teleport up
    else this.y = this.lowCeiling + this.height //Teleport down

    //Check if death objects are in way of teleportation to kill player
    let hitDeathObjects = [] //list of y coordinates death objects in way
    levelObj.deathObjects.forEach(element => {
      if(collision(element.x+element.boxOffsetX, element.y-element.boxOffsetY, element.boxWidth, element.boxHeight, this.x, this.highCeiling, this.width, this.highCeiling-this.lowCeiling)){
        hitDeathObjects.push(element.y) //Add to list
      }
    });

    //Go through all found deathobjects and search for closest one, so it wont look like player is teleporting through spike
    if(hitDeathObjects.length != 0){
      let lowestDifference = [0, abs(hitDeathObjects[0]-this.y)] //Store first object as closest, [0] is index of block in hitdeathobjects, [1] is distance from player
      for(let i = 1; i < hitDeathObjects.length; i++){
        const difference = abs(hitDeathObjects[i]-this.y) //calculate distance
        if(difference > lowestDifference[1]) lowestDifference = [i, difference] //set as closest if closer, idk why > but it works :/
      }
      this.y = hitDeathObjects[lowestDifference[0]] //Move player to death object so he dies
    }

    this.switchGravity()
    this.canUseRing = false
  }

  //change gravity when clicking
  swingCopterInput(){
    if(!this.input || !this.canUseRing) return
    
    this.switchGravity()
    this.canUseRing = false;
  }

  //create and draw wavePoints
  makeWavePoints(){
    if(this.yVelocityBefore != this.yVelocity){ //Add another wavepoint if velocity changed
      this.wavePoints.push([this.x+0.5*this.width, this.y-0.5*this.height-(this.yVelocity*sdeltaTime)]) //remove velocity to revert changes made in this.move() and store correct position
    }

    //Delete old ones which are not visible anymore
    for(let i = 0; i < this.wavePoints.length-1; i++){
      if(this.wavePoints[i][0] < camera.offsetX && this.wavePoints[i+1][0] >= camera.offsetX) {this.wavePoints.splice(0, i); break} //Delete all before if current one is last one behind border
      else if(this.wavePoints[i][0] > camera.offsetX) break //Stop loop if already over border (idk if this is even neccesary)
    }

    stroke("white")
    strokeWeight(0.2*u)
    //Draw all lines
    for(let i = 0; i < this.wavePoints.length-1; i++){
      if(this.wavePoints[i][0] < camera.offsetX && this.wavePoints[i+1][0] >= camera.offsetX) this.wavePoints
      unitLine(this.wavePoints[i][0], this.wavePoints[i][1], this.wavePoints[i+1][0], this.wavePoints[i+1][1])
    }
    unitLine(this.x+0.5*this.width, this.y-0.5*this.height, this.wavePoints[this.wavePoints.length-1][0], this.wavePoints[this.wavePoints.length-1][1]) //Draw line from player

    this.yVelocityBefore = this.yVelocity //Store for next frame
  }

  //Animate robot walking animation
  robotAnimation(){
    this.walkAnimation += this.walkAnimationSpeed*this.robotAnimationDirection*sdeltaTime //Progress animation
    if(this.walkAnimation >= 4.5){ //Change direction if an maximum was hit
      this.robotAnimationDirection = -this.robotAnimationDirection
      this.walkAnimation = 4.5
    }else if(this.walkAnimation < 0.5){
      this.robotAnimationDirection = -this.robotAnimationDirection
      this.walkAnimation = 0.5
    }

    //Choose frame to show in current frame
    if(this.onGround) this.image = robotImgs[floor(this.walkAnimation)]
    else this.image = robotJump //If in air show jump frame
  }

  //Animate spider walking animation
  spiderAnimation(){
    this.walkAnimation += this.walkAnimationSpeed*sdeltaTime //Progress animation
    if(this.walkAnimation >= 5){ //reset to zero if max was hit
      this.walkAnimation = 0
    }

    //Choose frame to show in current frame
    if(this.onGround) this.image = spiderImgs[floor(this.walkAnimation)]
    else this.image = spiderJump //If in air show jump frame
  }

  //Apply upwards velocity to player, strength is how strong with 1 = normal jump
  jump(strength = 1){
    this.yVelocity = this.jumpStrength*strength*this.gravitySwitch
    this.onGround = false
    this.canUseRing = false
  }
  
  //Get highest block from under player
  getLowCeiling(levelObj){
    let highest = camera.locked ? camera.downLock+camLockBorder : 0 //Set lowest possible ceiling, add camLockBorder because ground offset from camera border
    if(highest < 0) highest = 0 //increase lowest if below ground

    if(this.gameMode==4){this.lowCeiling = highest; return} //Ignore blocks completly if in wave gamemode

    for(const block of levelObj.groundObjects){
      //Check if block is under player and higher than highest
      if(block.x < this.x+this.width && block.x+block.width > this.x && block.y <= this.y-this.blockHitboxOffset-this.blockHitboxSize && block.y > highest) 
        highest = block.y
    }
    this.lowCeiling = highest

    if(this.gravitySwitch == 1 && this.onGround && this.y-this.height != highest){ //Make player fall if not on block and in air
      this.onGround = false
    }
  }

  //Get lowest block from above player
  getHighCeiling(levelObj){
    if(gameState == 0){this,this.highCeiling = camera.offsetY; return} //Return camera as ceiling if in main menu

    let highest = camera.locked ? camera.topLock-camLockBorder : ceilingLimit //Set highest possible ceiling, add camLockBorder because ground offset from camera border
    if(highest > ceilingLimit) highest = ceilingLimit //reduce highest if above ceiling limit

    if(this.gameMode==4) {this.highCeiling = highest; return} //Ignore blocks completly if in wave gamemode

    for(const block of levelObj.groundObjects){
      //Check if block is under player and higher than highest
      if(block.x < this.x+this.width && block.x+block.width > this.x && block.y-block.height >= this.y-this.blockHitboxOffset && block.y-block.height < highest) 
        highest = block.y-block.height
    }
    this.highCeiling = highest

    if(this.gravitySwitch == -1 && this.onGround && this.y != highest){ //Make player fall if not on block and in air
      this.onGround = false
    }
  }

  //Make player die
  die(){  
    this.dead = true
    if(!endless) activeLevel.song.stop() //Stop music if not in endless
  }

  deathAnimation(levelObj){
    this.deathAnimationTime += sdeltaTime
    circle(unitToPixelX(this.x+this.width*0.5,), unitToPixelY(this.y-this.height*0.5), this.deathAnimationTime*2*u)
    if(this.deathAnimationTime >= this.deathAnimationTimeMax){
      resetLevel(levelObj)
    }
  }

  update(levelObj){
    levelObj.interactObjects.forEach(element => {
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
      case 5:
        this.robotInput()
        this.robotAnimation()
        break;
      case 6:
        this.spiderInput(levelObj)
        this.spiderAnimation()
        break;
      case 7:
        this.swingCopterInput()
        break;
    }
    this.applyGravity()
    this.getLowCeiling(levelObj)
    this.getHighCeiling(levelObj)
    this.move()
    this.applyRotationChange()
    this.checkCompletion()

    if(this.gameMode == 4) this.makeWavePoints() //Draw and create wavepoints, has to be after this.move()

    //check for obsticles
    levelObj.groundObjects.forEach(element => {
      collisionBlockObject(this, element)   
    });
    levelObj.deathObjects.forEach(element => {
      collisionObject(this, element)   
    });
  }
}