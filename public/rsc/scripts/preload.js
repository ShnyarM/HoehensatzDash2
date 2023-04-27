let images = {bg:[], fg:[]}, objImages=[]
let endlessObstacles = []
let icon, ship, ball, ufo, wave, swingCopter
let robotImgs = [], robotJump
let spiderImgs = [], spiderJump
let objectInfo
let editorImgs = {zoomIn:""};
let customFont
let practiceCheckpointImg, practiceSong

function preload(){
  icon = loadImage("rsc/images/icon.png")
  ship = loadImage("rsc/images/ship.png")
  ball = loadImage("rsc/images/ball.png")
  ufo = loadImage("rsc/images/ufo.png")
  wave = loadImage("rsc/images/wave.png")
  swingCopter = loadImage("rsc/images/swingCopter.png")
  practiceCheckpointImg = loadImage("rsc/images/checkpoint.png")
  practiceSong = loadSound("rsc/music/StayInsideMe.mp3")

  for(let i = 0; i < 5; i++) robotImgs[i] = loadImage("rsc/images/robotFrames/" + i + ".png")
  robotJump = loadImage("rsc/images/robotFrames/jump.png")

  for(let i = 0; i < 5; i++) spiderImgs[i] = loadImage("rsc/images/spiderFrames/" + i + ".png")
  spiderJump = loadImage("rsc/images/spiderFrames/jump.png")

  images.bg[0] = loadImage("rsc/images/bg.png")
  images.fg[0] = loadImage("rsc/images/ground.png")

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

  customFont = loadFont("rsc/fonts/PixelSplitter-Bold.ttf")

  loadStrings("rsc/levels/obstacles.txt", obstacles => {
    for(let i = 0; i < obstacles.length; i++){//split blocks
      endlessObstacles[i] = split(obstacles[i], "+")
      for(let j = 0; j < endlessObstacles[i].length; j++){ //split elements of block
        endlessObstacles[i][j] = split(endlessObstacles[i][j], "°")
      }
    }
  })
}
