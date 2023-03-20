let icon, bg, fg
let spike, block, jumpRing, jumpPad
let images = {}
function preload(){
  icon = loadImage("rsc/images/icon.png")
  bg = loadImage("rsc/images/bg.png")
  fg = loadImage("rsc/images/ground.png")
  images.Spike = loadImage("rsc/images/spike.png")
  images.Block = loadImage("rsc/images/block.png")
  images.JumpOrb = loadImage("rsc/images/jumpRing.png")
  images.GravityOrb = loadImage("rsc/images/gravityRing.png")
  images.GreenOrb = loadImage("rsc/images/greenRing.png")
  images.JumpPad = loadImage("rsc/images/jumpPad.png")
  images.HighJumpPad = loadImage("rsc/images/highJumpPad.png")
  images.LowJumpPad = loadImage("rsc/images/lowJumpPad.png")
  console.log(images)
}
