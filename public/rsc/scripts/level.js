let groundObjects, interactObjects, deathObjects//blocks = [], spikes = [], jumpRings = [], jumpPads = []
const groundTileSize = 5 //Size of single groundtile
const backgroundSize = 20, parallaxFactor = 15 //size of background tile and parralax Strength
let bgColor, fgColor, coloredBg, coloredFg
const jumpPadStrength = 1.5
const ceilingLimit = 140

function levelSetup(){
  
  groundObjects = [], interactObjects = [], deathObjects = []

  groundObjects[0] = new gameObject("Block", 16, 1)
  groundObjects[1] = new gameObject("Block", 17, 1)
  groundObjects[2] = new gameObject("Block", 18, 1)
  groundObjects[3] = new gameObject("Block", 19, 1)
  groundObjects[4] = new gameObject("Block", 20, 1)

  groundObjects[5] = new gameObject("Block", 23, 3)

  groundObjects[6] = new gameObject("Block", 26, 5)
  groundObjects[7] = new gameObject("Block", 29, 7)
  groundObjects[11] = new gameObject("Block", 32, 9)
  groundObjects[12] = new gameObject("Block", 35, 11)
  groundObjects[13] = new gameObject("Block", 38, 13)

  groundObjects[14] = new gameObject("Block", 18, 10)
  groundObjects[15] = new gameObject("Block", 19, 10)
  groundObjects[16] = new gameObject("Block", 20, 10)
  groundObjects[17] = new gameObject("Block", 21, 10)
  groundObjects[18] = new gameObject("Block", 22, 10)
  groundObjects[19] = new gameObject("Block", 23, 10)
  groundObjects[20] = new gameObject("Block", 24, 10)
  groundObjects[21] = new gameObject("Block", 25, 10)

  //deathObjects[0] = new gameObject("Spike", 14, 1)
  deathObjects[1] = new gameObject("Spike", 26, 1)
  deathObjects[2] = new gameObject("Spike", 27, 1)
  //deathObjects[3] = new gameObject("Spike", 28, 1)

  groundObjects[8] = new gameObject("Block", 32, 1)
  groundObjects[9] = new gameObject("Block", 32, 2)
  groundObjects[10] = new gameObject("Block", 32, 4)

  interactObjects[0] = new gameObject("JumpOrb", 20, 3)
  interactObjects[3] = new gameObject("JumpOrb", 22, 8)

  interactObjects[1] = new gameObject("GravityOrb", 35, 2, 0)
  interactObjects[2] = new gameObject("GravityOrb", 38, 2, 0)

  interactObjects[0] = new gameObject("JumpPad", 30, 1)

  //interactObjects[4] = new gameObject("GravityOrb", 10, 1)
  interactObjects[5] = new gameObject("GreenOrb", 40, 3)
  
  interactObjects[6] = new gameObject("LowJumpPad", 50, 1)
  interactObjects[7] = new gameObject("HighJumpPad", 60, 1)
  interactObjects[8] = new gameObject("GravityPad", 70, 1)

  interactObjects[9] = new gameObject("LowJumpRing", 80, 1)
  interactObjects[10] = new gameObject("HighJumpRing", 90, 1)

  interactObjects[11] = new gameObject("ShipPortal", 10, 2)

  groundObjects[22] = new gameObject("Block", 10, 3)
  groundObjects[23] = new gameObject("Block", 11, 3)
  groundObjects[24] = new gameObject("Block", 12, 3)

  bgColor = [7, 237, 11]
  fgColor = [0, 74, 1]
  colorBackground()
  colorForeground()

}

function drawLevel(){
  groundObjects.forEach(element => drawObject(element));
  interactObjects.forEach(element => drawObject(element));
  deathObjects.forEach(element => drawObject(element));
  
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