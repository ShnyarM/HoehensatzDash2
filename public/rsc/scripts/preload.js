let icon, images = {bg:[], fg:[]}, objImages=[]
let endlessObstacles = []

function preload(){
  icon = loadImage("rsc/images/icon.png")
  images.bg[0] = loadImage("rsc/images/bg.png")
  images.fg[0] = loadImage("rsc/images/ground.png")
  objImages[0] = loadImage("rsc/images/block.png")
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
