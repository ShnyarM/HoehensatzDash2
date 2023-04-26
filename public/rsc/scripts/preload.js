let images = {bg:[], fg:[]}, objImages=[]
let endlessObstacles = []
let icon, ship, ball, ufo, wave, swingCopter
let robotImgs = [], robotJump
let spiderImgs = [], spiderJump
let objectInfo
let editorImgs = {zoomIn:""};

function preload(){
  icon = loadImage("rsc/images/icon.png")
  ship = loadImage("rsc/images/ship.png")
  ball = loadImage("rsc/images/ball.png")
  ufo = loadImage("rsc/images/ufo.png")
  wave = loadImage("rsc/images/wave.png")
  swingCopter = loadImage("rsc/images/swingCopter.png")

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

  /*objImages[0] = loadImage("rsc/images/block.png")
  objImages[50] = loadImage("rsc/images/spike.png")
  objImages[100] = loadImage("rsc/images/yellowOrb.png")
  objImages[101] = loadImage("rsc/images/pinkOrb.png")
  objImages[102] = loadImage("rsc/images/redOrb.png")
  objImages[103] = loadImage("rsc/images/blueOrb.png")
  objImages[104] = loadImage("rsc/images/greenOrb.png")
  objImages[105] = loadImage("rsc/images/yellowPad.png")
  objImages[106] = loadImage("rsc/images/pinkPad.png")
  objImages[107] = loadImage("rsc/images/redPad.png")
  objImages[108] = loadImage("rsc/images/bluePad.png")

  objImages[120] = loadImage("rsc/images/cubePortal.png")
  objImages[121] = loadImage("rsc/images/miniPortal.png")
  objImages[122] = loadImage("rsc/images/bigPortal.png")
  objImages[123] = loadImage("rsc/images/shipPortal.png")
  objImages[124] = loadImage("rsc/images/ballPortal.png")
  objImages[125] = loadImage("rsc/images/ufoPortal.png")
  objImages[126] = loadImage("rsc/images/wavePortal.png")
  objImages[127] = loadImage("rsc/images/robotPortal.png")
  objImages[128] = loadImage("rsc/images/spiderPortal.png")
  objImages[129] = loadImage("rsc/images/swingcopterPortal.png")
  objImages[130] = loadImage("rsc/images/Speed0.png")
  objImages[131] = loadImage("rsc/images/Speed1.png")
  objImages[132] = loadImage("rsc/images/Speed2.png")
  objImages[133] = loadImage("rsc/images/Speed3.png")
  objImages[134] = loadImage("rsc/images/Speed4.png")

  /*images.Spike = loadImage("rsc/images/spike.png")
  images.Block = loadImage("rsc/images/block.png")
  images.JumpOrb = loadImage("rsc/images/jumpRing.png")
  images.GravityOrb = loadImage("rsc/images/gravityRing.png")
  images.GreenOrb = loadImage("rsc/images/greenRing.png")
  images.JumpPad = loadImage("rsc/images/jumpPad.png")
  images.HighJumpPad = loadImage("rsc/images/highJumpPad.png")
  images.LowJumpPad = loadImage("rsc/images/lowJumpPad.png")
  images.GravityPad = loadImage("rsc/images/gravityPad.png")
  images.LowJumpOrb = loadImage("rsc/images/lowJumpRing.png")
  images.HighJumpOrb = loadImage("rsc/images/highJumpRing.png")
  images.ShipPortal = loadImage("rsc/images/ShipPortal.png")
  images.CubePortal = loadImage("rsc/images/ShipPortal.png")
  images.MiniPortal = loadImage("rsc/images/MiniPortal.png")
  images.BigPortal = loadImage("rsc/images/BigPortal.png")
  console.log(images)*/

  loadStrings("rsc/levels/obstacles.txt", obstacles => {
    for(let i = 0; i < obstacles.length; i++){//split blocks
      endlessObstacles[i] = split(obstacles[i], "+")
      for(let j = 0; j < endlessObstacles[i].length; j++){ //split elements of block
        endlessObstacles[i][j] = split(endlessObstacles[i][j], "°")
      }
    }
  })
}
