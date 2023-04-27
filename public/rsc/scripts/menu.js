let menuState = 0 //0 = main menu screen
let menus = [drawMainMenu]

let menuLevel

//Draws the menu, buttonRect is a function that creates a button, returnFunction of button gets called when button is clicked
//String in buttonRect usually says what the button does, returnFunction can also help understanding
function menuSetup(){
  if(!menuLevel) menuLevel = new Level("menu", "/rsc/levels/endless.hd")
  activeLevel = menuLevel
  cameraSetup()
  camera.movement = false
  playerSetup()
}

function menuDraw(){
  drawMenuBackground()
  menus[menuState]();
}

function drawMenuBackground(){
  if(menuLevel.loaded){ //Draw Level
    drawBackground(menuLevel)
    drawForeground(menuLevel)
  }

  //Player behaviour
  player.input = player.checkInput()
  player.update(menuLevel)
  player.draw()

  if(player.x > uwidth+3){ //Reset Player if not on screen
    player.switchMode(floor(random(0, 8))) //Choose random gamemode
    player.gravitySwitch = 1 //reset gravity
    player.wavePoints = [[0, player.height*0.5]] //Reset wavepoint incase player is in wave mode
    player.y = player.height //reset position
    player.x = -player.width
  }
}

function drawMainMenu(){
  textAlign(CENTER, CENTER)
  textSize(height/12)
  fill("#FFFF00")
  stroke("black")
  strokeWeight(height/60)
  text("Höhensatz Dash 2", width*0.5, height*0.075)

  buttonRect(width*0.5-width*0.125, height*0.5-height*0.15, width / 5, height/ 10, "Play", height / 45, () => { //get own world
    openLevel("read", "/rsc/levels/1.hd")
  })
  
  buttonRect(width*0.5-width*0.125, height*0.5, width / 5, height/ 10, "Endless", height / 45, () => { //get own world
    openEndless()
  })

  buttonRect(width*0.5-width*0.125, height*0.5+height*0.15, width / 5, height/ 10, "Online Levels", height / 45, () => { //get own world
    openEndless()
  })

  buttonRect(width*0.5+width*0.125, height*0.5-height*0.15, width / 5, height/ 10, "Classic HD1 Levels   ", height / 45, () => { //get own world
    openLevel("read", "/rsc/levels/hd1Levels/hd1Level1.hd")
  })

  buttonRect(width*0.5+width*0.125, height*0.5, width / 5, height/ 10, "Classic Endless", height / 45, () => { //get own world
    openLevel("read", "/rsc/levels/hd1Levels/hd1Level2.hd")
  })

  buttonRect(width*0.5+width*0.125, height*0.5+height*0.15, width / 5, height/ 10, "Level Editor", height / 45, () => { //get own world
    setupEditor()
  })
}
