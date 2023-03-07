let blocks = [], spikes = [], jumpRings = [], jumpPads = []
const groundTileSize = 5 //Size of single groundtile
const backgroundSize = 20, parallaxFactor = 15 //size of background tile and parralax Strength
let bgColor, fgColor, coloredBg, coloredFg
const jumpPadStrength = 1.5
const ceilingLimit = 140

function levelSetup(){
  blocks = []
  blocks[0] = new Block(16, 1)
  blocks[1] = new Block(17, 1)
  blocks[2] = new Block(18, 1)
  blocks[3] = new Block(19, 1)
  blocks[4] = new Block(20, 1)

  blocks[5] = new Block(23, 3)

  blocks[6] = new Block(26, 5)
  blocks[7] = new Block(29, 7)
  blocks[11] = new Block(32, 9)
  blocks[12] = new Block(35, 11)
  blocks[13] = new Block(38, 13)

  blocks[14] = new Block(18, 10)
  blocks[15] = new Block(19, 10)
  blocks[16] = new Block(20, 10)
  blocks[17] = new Block(21, 10)
  blocks[18] = new Block(22, 10)
  blocks[19] = new Block(23, 10)
  blocks[20] = new Block(24, 10)
  blocks[21] = new Block(25, 10)

  spikes[0] = new Spike(14, 1)
  spikes[1] = new Spike(26, 1)
  spikes[2] = new Spike(27, 1)
  spikes[3] = new Spike(28, 1)

  blocks[8] = new Block(32, 1)
  blocks[9] = new Block(32, 2)
  blocks[10] = new Block(32, 4)

  jumpRings[0] = new JumpRing(20, 3, 1)
  jumpRings[3] = new JumpRing(22, 8, 1)

  jumpRings[1] = new JumpRing(35, 2, 0)
  jumpRings[2] = new JumpRing(38, 2, 0)

  //jumpPads[0] = new JumpPad(12, 1)

  jumpRings[4] = new JumpRing(10, 1, 1)

  blocks[22] = new Block(10, 3)
  blocks[23] = new Block(11, 3)
  blocks[24] = new Block(12, 3)

  bgColor = [7, 237, 11]
  fgColor = [0, 74, 1]
  colorBackground()
  colorForeground()
}

function drawLevel(){
  for(const block of blocks){ //Draw all blocks
    block.draw()
    //block.drawHitbox()
  }

  for(const spike of spikes){ //Draw all blocks
    spike.draw()
    //spike.drawHitbox()
  }

  for(const ring of jumpRings){ //Draw all blocks
    ring.draw()
    //ring.drawHitbox()
  }

  for(const pad of jumpPads){ //Draw all blocks
    pad.draw()
    //pad.drawHitbox()
  }
}

//draw background and forground
function drawBackground(){
  const backStart = floor((camera.offsetX/parallaxFactor)/backgroundSize) //Get index of first image
  for(let i = backStart; i <= backStart+ceil(uwidth/backgroundSize); i++){ //Draw all background tiles
    image(coloredBg, (backgroundSize*i-camera.offsetX / parallaxFactor) * u, (10-camera.offsetY / parallaxFactor) * -u, backgroundSize * u, backgroundSize * u)
  } 


  if(camera.offsetY - uheight < 0){ //Draw ground if visible
    const groundStart = floor(camera.offsetX/groundTileSize) //# of first ground tile, increases as player goes forward
    for(let i = groundStart; i <= groundStart+ceil(uwidth/groundTileSize); i++){//Draw all ground tiles
      unitImage(coloredFg, i*groundTileSize, 0, groundTileSize, groundTileSize)
    }

    //Line seperating background and foreground
    stroke("white")
    strokeWeight(0.06*u)
    line(0, camera.offsetY*u, width, camera.offsetY*u)
  }
}

function colorBackground(){
  coloredBg = createGraphics(bg.width, bg.height) //create new canvas which will become bg image
  coloredBg.tint(...bgColor)
  coloredBg.image(bg, 0, 0, bg.width, bg.height) //Draw white bg image to canvas with tint
}

function colorForeground(){
  coloredFg = createGraphics(fg.width, fg.height) //create new canvas which will become bg image
  coloredFg.tint(...fgColor)
  coloredFg.image(fg, 0, 0, fg.width, fg.height) //Draw white bg image to canvas with tint
}

//Delete everything relating to level script
function deleteLevel(){
  coloredBg, coloredBg = null
  bgColor, fgColor = []
  blocks = []
}