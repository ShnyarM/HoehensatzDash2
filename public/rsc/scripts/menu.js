let menuState = 0 //0 = main menu screen, 1=main level select, 2=classic level select, 3=online level select, 4=settings, 5=tutorialSelect
let menus = [drawMainMenu, drawLevelSelect, drawClassicLevelSelect, , drawSettings, drawTutorialSelect, levelEditorMenu, drawOnlineLevels, loginMenu, registerMenu]
const mainLevels = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6"]
const classicLevels = ["Höhensatz Madness", "Back on Trigonometrie", "Prismageist"]
const tutorialLevels = ["Cube", "Ship", "Ball", "UFO", "Wave", "Robot", "Spider", "Swing Copter"]
let musicVolumeSlider, soundVolumeSlider
let onlinePage = 0;

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
    onlinePage = 0;
    postJSON("/getLevelNames", { "page": onlinePage}, (data)=>{
      menuState = 7;
      onlineLevelNames = data.reverse();
      if(onlineLevelNames.length < 1)lastOnlinePage = 0;
      else lastOnlinePage = ceil(onlineLevelNames[0].id/8)-1
    });
  })

  buttonRect(width*0.5+width*0.125, height*0.5-height*0.15, width / 5, height/ 10, "Classic HD1 Levels   ", height / 45, () => {
    menuState=2
  })

  buttonRect(width*0.5+width*0.125, height*0.5, width / 5, height/ 10, "Classic Endless", height / 45, () => {
    openEndless(true)
  })

  buttonRect(width*0.5+width*0.125, height*0.5+height*0.15, width / 5, height/ 10, "Level Editor", height / 45, () => {
    if(getCookie("username")== ""){
      setupEditor(new Level("empty"))
    }
    onlinePage = 0;
    postJSON("/getPrivateLevelNames", { "page": onlinePage}, (data)=>{
      menuState = 6
      onlineLevelNames = data.reverse();
      if(onlineLevelNames.length < 1)lastOnlinePage = 0;
      else lastOnlinePage = ceil(onlineLevelNames[0].id/8)-1
      console.log(onlineLevelNames)
    });
  })

  buttonRect(width*0.5, height*0.5+height*0.3, width / 5, height/ 10, "Tutorial Levels", height / 45, () => {
    menuState=5
  })

  buttonRect(width*0.145, height*0.93, width*0.25, height/ 10, "Play Höhensatz Dash 1", height / 45, () => {
    window.open("hd1", "_self")
  })

  buttonImg(width-width*0.05, height-width*0.05, width*0.05, width*0.05, editorImgs.options, height / 100, () => {
    openSettingsMenu()
  }, {"curve": [height]})

  buttonImg(width-width*0.05, width*0.05, width*0.05, width*0.05, editorImgs.account, 0, () => {
    menuState = 8;
    usernameInput = createInput("")
    passwordInput = createInput("", "password")
    errorMessage = ""

    usernameInput.position(width / 2 - width/8 + (windowWidth - width) / 2, height / 2 - height/10 + (windowHeight - height) / 2)
    usernameInput.size(width / 4, height / 15)
    usernameInput.style("text-align", "center")
    usernameInput.style("font-size", width / 80 + "px")
    usernameInput.style("font-family", "PixelSplitter")

    passwordInput.position(width / 2 - width/8 + (windowWidth - width) / 2, height / 2 + height/10 + (windowHeight - height) / 2)
    passwordInput.size(width / 4, height / 15)
    passwordInput.style("text-align", "center")
    passwordInput.style("font-size", width / 80 + "px")
    passwordInput.style("font-family", "PixelSplitter")
  
  }, {"curve": [height]})
  text(getCookie("username"), width-width*0.05, width*0.085)
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


function drawOnlineLevels(){
  
  textAlign(CENTER, CENTER)
  textSize(height/12)
  fill("#FFFF00")
  stroke("black")
  strokeWeight(height/60)
  text("Online Levels", width*0.5, height*0.075)

  buttonRect(width*0.06, height*0.05, width / 10, height/ 15, "Back", height / 45, () => {
    menuState = 0
  })

  for(let i = 0; i < ceil(onlineLevelNames.length/4)&& i < 2; i++){
    for(let j = 0; j < (onlineLevelNames.length/4-i)*4&& j < 4; j++){
      buttonRect(width*0.375+i*width*0.25, height*0.35+height*0.15*j, width / 5, height/ 10, onlineLevelNames[i*4+j].levelName, height / 45, () => { 
        postJSON("/getLevel", { "id":  onlineLevelNames[i*4+j].id}, (data)=>{
          openLevel("data", data.level)
        });
      })
    }
  }
  if(onlinePage > 0)
  buttonImg(width/4.5, height/1.75, width / 30, width / 30, editorImgs.leftArrow, width / 200, () => {
    onlinePage--
    postJSON("/getLevelNames", { "page": onlinePage }, (data)=>{
      onlineLevelNames = data.reverse();
    });
  }, {
    colNor: 200
  })
  if(onlinePage < lastOnlinePage)
  buttonImg(width/2 + width/3.75, height/1.75, width / 30, width / 30, editorImgs.rightArrow, width / 200, () => {
    onlinePage++
    postJSON("/getLevelNames", { "page": onlinePage }, (data)=>{
      onlineLevelNames = data.reverse();
    });
  }, {
    colNor: 200
  })

  textSize(width/50)
  text(onlinePage+1 + "/" + (lastOnlinePage+1), width/2, height/1.1)
}