let menuState = 0 //0 = main menu screen, 1=main level select, 2=classic level select, 3=online level select, 4=settings, 5=tutorialSelect
let menus = [drawMainMenu, drawLevelSelect, drawClassicLevelSelect, , drawSettings, drawTutorialSelect]
const mainLevels = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6"]
const classicLevels = ["Höhensatz Madness", "Back on Trigonometrie", "Prismageist"]
const tutorialLevels = ["Cube", "Ship", "Ball", "UFO", "Wave", "Robot", "Spider", "Swing Copter"]
let musicVolumeSlider, soundVolumeSlider

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

  buttonRect(width*0.5-width*0.125, height*0.5-height*0.15, width / 5, height/ 10, "Play", height / 45, () => {
    menuState=1
  })
  
  buttonRect(width*0.5-width*0.125, height*0.5, width / 5, height/ 10, "Endless", height / 45, () => {
    openEndless()
  })

  buttonRect(width*0.5-width*0.125, height*0.5+height*0.15, width / 5, height/ 10, "Online Levels", height / 45, () => {
    openEndless()
  })

  buttonRect(width*0.5+width*0.125, height*0.5-height*0.15, width / 5, height/ 10, "Classic HD1 Levels   ", height / 45, () => {
    menuState=2
  })

  buttonRect(width*0.5+width*0.125, height*0.5, width / 5, height/ 10, "Classic Endless", height / 45, () => {
    openEndless(true)
  })

  buttonRect(width*0.5+width*0.125, height*0.5+height*0.15, width / 5, height/ 10, "Level Editor", height / 45, () => {
    setupEditor()
  })

  buttonRect(width*0.5, height*0.5+height*0.3, width / 5, height/ 10, "Tutorial Levels", height / 45, () => {
    menuState=5
  })

  buttonRect(width-width*0.05, height-width*0.05, width*0.05, width*0.05, "", height / 45, () => {
    openSettingsMenu()
  }, {"curve": height})
  imageMode(CENTER)
  image(settingsIcon, width-width*0.05, height-width*0.05, width*0.03, width*0.03)
  imageMode(CORNER)
}

function drawLevelSelect(){
  textAlign(CENTER, CENTER)
  textSize(height/12)
  fill("#FFFF00")
  stroke("black")
  strokeWeight(height/60)
  text("Level Select", width*0.5, height*0.075)

  buttonRect(width*0.06, height*0.05, width / 10, height/ 15, "Back", height / 45, () => {
    menuState = 0
  })

  for(let i = 0; i < 2; i++){
    for(let j = 0; j < 3; j++){
      
      buttonRect(width*0.375+i*width*0.25, height*0.35+height*0.15*j, width / 5, height/ 10, i*3+j+1 +". " + mainLevels[i*3+j], height / 45, () => { 
        openLevel("read", "rsc/levels/" + mainLevels[i*3+j] + ".hd")
      })
    }
  }
}

function drawClassicLevelSelect(){
  textAlign(CENTER, CENTER)
  textSize(height/12)
  fill("#FFFF00")
  stroke("black")
  strokeWeight(height/60)
  text("Classic Levels", width*0.5, height*0.075)

  buttonRect(width*0.06, height*0.05, width / 10, height/ 15, "Back", height / 45, () => {
    menuState = 0
  })

  for(let i = 0; i < 3; i++){
    buttonRect(width*0.5, height*0.35+height*0.15*i, width / 4, height/ 9, classicLevels[i], height / 45, () => {
      openLevel("read", "rsc/levels/hd1Levels/" + classicLevels[i] + ".hd")
    })
  }
}

function drawSettings(){
  textAlign(CENTER, CENTER)
  textSize(height/12)
  fill("#FFFF00")
  stroke("black")
  strokeWeight(height/60)
  text("Settings", width*0.5, height*0.075)

  buttonRect(width*0.06, height*0.05, width / 10, height/ 15, "Back", height / 45, closeSettingsMenu)

  textSize(height/15)
  text("Music Volume", width*0.5, height*0.35)
  text("Sound Volume", width*0.5, height*0.55)
}

function drawTutorialSelect(){
  textAlign(CENTER, CENTER)
  textSize(height/12)
  fill("#FFFF00")
  stroke("black")
  strokeWeight(height/60)
  text("Tutorial Levels", width*0.5, height*0.075)

  buttonRect(width*0.06, height*0.05, width / 10, height/ 15, "Back", height / 45, () => {
    menuState = 0
  })

  for(let i = 0; i < 2; i++){
    for(let j = 0; j < 4; j++){
      buttonRect(width*0.375+i*width*0.25, height*0.35+height*0.15*j, width / 5, height/ 10, i*3+j+1 +". " + tutorialLevels[i*3+j], height / 45, () => { 
        openLevel("read", "rsc/levels/tutorialLevels/" + tutorialLevels[i*3+j] + ".hd")
      })
    }
  }
}

function openSettingsMenu(){
  menuState=4
  musicVolumeSlider = addSlider("musicVolume", 0.5, 0.45, 0.3, 0.03, savedVars.musicVolume, 0, 1)
  soundVolumeSlider = addSlider("soundVolume", 0.5, 0.65, 0.3, 0.03, savedVars.soundVolume, 0, 1)

  musicVolumeSlider.input(() => {savedVars.musicVolume = musicVolumeSlider.value})
  soundVolumeSlider.input(() => {savedVars.soundVolume = soundVolumeSlider.value})
}

function closeSettingsMenu(){
  menuState = 0

  saveLocalStorage() //Save values into localStorage
  adjustVolume()
  removeSlider("musicVolume")
  removeSlider("soundVolume")
}

