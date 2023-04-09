let icon, images = {bg:[], fg:[]}, objImages=[]

function preload(){
  icon = loadImage("rsc/images/icon.png")
  images.bg[0] = loadImage("rsc/images/bg.png")
  images.fg[0] = loadImage("rsc/images/ground.png")
  objImages[0] = loadImage("rsc/images/block.png")
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
  images.ShipPortal = loadImage("rsc/images/ShipPortal.png")*/
  console.log(images)
}
