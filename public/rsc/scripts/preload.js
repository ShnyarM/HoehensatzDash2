let images = {bg:[], fg:[]}, objImages=[]
let endlessObstacles = [], classicEndlessObstacles = []
let icon, ship, ball, ufo, wave, swingCopter
let robotImgs = [], robotJump
let spiderImgs = [], spiderJump
let objectInfo
let editorImgs = {zoomIn:""};
let customFont
let practiceCheckpointImg, practiceSong
let explodeSound
let settingsIcon

/*document.onkeydown = function (e) {
  return false;
}*/

function preload(){
  icon = loadImage("rsc/images/icon.png")
  ship = loadImage("rsc/images/ship.png")
  ball = loadImage("rsc/images/ball.png")
  ufo = loadImage("rsc/images/ufo.png")
  wave = loadImage("rsc/images/wave.png")
  swingCopter = loadImage("rsc/images/swingCopter.png")
  practiceCheckpointImg = loadImage("rsc/images/checkpoint.png")
  practiceSong = loadSound("rsc/music/Stay Inside Me.mp3")
  explodeSound = loadSound("rsc/sounds/explodeSound.ogg")

  for(let i = 0; i < 5; i++) robotImgs[i] = loadImage("rsc/images/robotFrames/" + i + ".png")
  robotJump = loadImage("rsc/images/robotFrames/jump.png")

  for(let i = 0; i < 5; i++) spiderImgs[i] = loadImage("rsc/images/spiderFrames/" + i + ".png")
  spiderJump = loadImage("rsc/images/spiderFrames/jump.png")

  for(let i = 0; i < 20;i++){
    images.bg[i] = loadImage("rsc/images/backgrounds/"+i+".png")
  }
  
  for(let i = 0; i < 7;i++){
    images.fg[i] = loadImage("rsc/images/foregrounds/"+i+".png")
  }

  loadJSON("rsc/json/objects.json", data => {
    objectInfo = data
    for(const id in objectInfo){
      objImages[id] = loadImage("rsc/images/objects/"+id+".png")
    }
  })

  editorImgs.zoomIn = loadImage("rsc/images/zoomIn.png")
  editorImgs.zoomOut = loadImage("rsc/images/zoomOut.png")
  editorImgs.move = loadImage("rsc/images/moveIcon.png")
  editorImgs.play = loadImage("rsc/images/play.png")
  editorImgs.cursor = loadImage("rsc/images/cursor.png")
  editorImgs.save = loadImage("rsc/images/saveIcon.png")
  editorImgs.options = loadImage("rsc/images/optionsIcon.png")
  editorImgs.leftArrow = loadImage("rsc/images/leftArrow.png")
  editorImgs.rightArrow = loadImage("rsc/images/rightArrow.png")
  editorImgs.close = loadImage("rsc/images/close.png")
  editorImgs.pause = loadImage("rsc/images/pauseIcon.png")

  settingsIcon = loadImage("rsc/images/settings.png")

  customFont = loadFont("rsc/fonts/PixelSplitter-Bold.ttf")

  //get endless obstacles
  loadStrings("rsc/levels/obstacles.txt", obstacles => {
    for(let i = 0; i < obstacles.length; i++){//split blocks
      endlessObstacles[i] = split(obstacles[i], "+")
      for(let j = 0; j < endlessObstacles[i].length; j++){ //split elements of block
        endlessObstacles[i][j] = split(endlessObstacles[i][j], "°")
      }
    }
  })

  //Get classic endless obstacles
  loadStrings("rsc/levels/classicObstacles.txt", obstacles => {
    for(let i = 0; i < obstacles.length; i++){//split blocks
      classicEndlessObstacles[i] = split(obstacles[i], "+")
      for(let j = 0; j < classicEndlessObstacles[i].length; j++){ //split elements of block
        classicEndlessObstacles[i][j] = split(classicEndlessObstacles[i][j], "°")
      }
    }
  })

  songList = loadStrings("rsc/music/songList.txt")
}

//Get saved values from localStorage
function loadLocalStorage(){
  for(const varName in savedVars){
    if(localStorage.getItem(varName) == null) {localStorage.setItem(varName, savedVars[varName]); continue}//save default value if no value exists
    savedVars[varName] = localStorage.getItem(varName)
  }
}

//Save all values into local Storage
function saveLocalStorage(){
  for(const varName in savedVars){
    localStorage.setItem(varName, savedVars[varName])
  }
}
