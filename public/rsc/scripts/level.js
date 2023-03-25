//let groundObjects, interactObjects, deathObjects//blocks = [], spikes = [], jumpRings = [], jumpPads = []
let activeLevel;
const groundTileSize = 5 //Size of single groundtile
const backgroundSize = 20, parallaxFactor = 15 //size of background tile and parralax Strength
const jumpPadStrength = 1.5
const ceilingLimit = 140

function drawLevel(levelObj){
  levelObj.groundObjects.forEach(element => drawObject(element));
  levelObj.interactObjects.forEach(element => drawObject(element));
  levelObj.deathObjects.forEach(element => drawObject(element));
}

function playLevel(){
  drawBackground(activeLevel)
  playerUpdate(activeLevel);
  drawLevel(activeLevel);
  drawForeground(activeLevel)
  cameraUpdate();
}

//draw background
function drawBackground(levelObj){
  const backStart = floor((camera.offsetX/parallaxFactor)/backgroundSize) //Get index of first image
  for(let i = backStart; i <= backStart+ceil(uwidth/backgroundSize); i++){ //Draw all background tiles
    image(levelObj.bg, (backgroundSize*i-camera.offsetX / parallaxFactor) * u, (10-camera.offsetY / parallaxFactor) * -u, backgroundSize * u, backgroundSize * u)
  } 
}

//Draw Foreground
function drawForeground(levelObj){
  if(!camera.locked){ //Camera not locked (for example cube), draw ground normally
    if(camera.offsetY - uheight < 0){ //Draw ground if visible
      const groundStart = floor(camera.offsetX/groundTileSize) //# of first ground tile, increases as player goes forward
      for(let i = groundStart; i <= groundStart+ceil(uwidth/groundTileSize); i++){//Draw all ground tiles
        unitImage(levelObj.fg, i*groundTileSize, 0, groundTileSize, groundTileSize)
      }
  
      //Line seperating background and foreground
      stroke("white")
      strokeWeight(0.06*u)
      line(0, camera.offsetY*u, width, camera.offsetY*u)
    }
  }
  
  if(camera.locked || camera.groundPosition != 0){ //Camera locked (Ship) or borders are still animating out, draw ground at bottom and top at fixed posititons
    const groundStart = floor(camera.offsetX/groundTileSize) //# of first ground tile, increases as player goes forward
    const yBottom = camera.downLock == -camLockBorder ? 0 : camera.offsetY-uheight+(camLockBorder*camera.groundPosition) //Position of bottom ground, if its like normal ground just render at 0, else play animation and etc

    for(let i = groundStart; i <= groundStart+ceil(uwidth/groundTileSize); i++){//Draw all ground tiles
      unitImage(levelObj.fg, i*groundTileSize, yBottom, groundTileSize, groundTileSize) //Bottom, +0.5 because cround is up by 0.5 from camera border, groundposition for animation
      rotateUnitImage(levelObj.fg, i*groundTileSize, camera.offsetY-(camLockBorder*camera.groundPosition)+groundTileSize, groundTileSize, groundTileSize, 180) //Top, rotate so "up" of image is at the bottom
    }

    //Line seperating background and foreground
    stroke("white")
    strokeWeight(0.06*u)
    line(0, (camLockBorder*camera.groundPosition)*u, width, (camLockBorder*camera.groundPosition)*u) //top
    line(0, unitToPixelY(yBottom), width, unitToPixelY(yBottom)) //bottom
  }
}

//Join a game, first part of Setup, second part starts in serverClient.js (update player and camera), and then third part starts (map)
function openLevel(levelObj){
  gameState = 1;
  playerSetup();
  cameraSetup();
  activeLevel = levelObj;
}

//Leave current world and go back to main menu, kicked says if player was kicked by server
function closeLevel(){ //ATTENTION
  gameState = 0;
  gamePaused = false
  
  delete activeLevel
  deleteCamera()
  deletePlayer()
}

//reset and restart current level
function resetLevel(levelObj){ //ATTENTION

  //Setup everything again
  levelObj.interactObjects.forEach(element => {
    element.used = false   
  });

  playerSetup()
  cameraSetup()
}

class Level{
  constructor(mode, data){
    this.interactObjects = [];
    this.groundObjects = [];
    this.deathObjects=[];
    this.decoration={"bgSprite":0, "fgSprite":0, "bgColor": [7, 237, 11], "fgColor": [0, 74, 1]}
    if(mode == "read"){
      this.readData(data);
    }
    this.tintDeco();
  }

  readData(path){
    fetch(path)
    .then((response) => response.json())
    .then((json) => {
      json.objects.forEach(element => {
        this.addObject(new gameObject(element.type, element.x, element.y))
      })
      this.decoration = json.decoration
      /*json.deathObjects.forEach(element => {
        this.deathObjects.push(new gameObject(element.type, element.x, element.y)); 
      });

      json.interactObjects.forEach(element => {
        this.interactObjects.push(new gameObject(element.type, element.x, element.y)); 
      });

      json.groundObjects.forEach(element => {
        this.groundObjects.push(new gameObject(element.type, element.x, element.y)); 
      });*/
    });
  }

  addObject(obj){
    switch(obj.type){
      case "Spike":
        this.deathObjects.push(obj); 
        break
      case "Block":
        this.groundObjects.push(obj);
        break;
        case "JumpOrb":
        case "LowJumpOrb":
        case "HighJumpOrb":
        case "GravityOrb":
        case "GreenOrb":
        case "JumpPad":
        case "HighJumpPad":
        case "LowJumpPad":
        case "GravityPad":
        case "ShipPortal":
        case "CubePortal":
        this.interactObjects.push(obj)
        break
        }
  }

  saveLevel(path){
    let levelSave = {
      "objects":[],
      "decoration": this.decoration
    }
    this.deathObjects.forEach(element => {
      levelSave.objects.push({"type":element.type, "x":element.x-element.xOffset, "y":element.y-element.yOffset}) 
    });
    this.groundObjects.forEach(element => {

      levelSave.objects.push({"type":element.type, "x":element.x-element.xOffset, "y":element.y-element.yOffset}) 
    });
    this.interactObjects.forEach(element => {
      levelSave.objects.push({"type":element.type, "x":element.x-element.xOffset, "y":element.y-element.yOffset}) 
    });
    var levelJson = JSON.stringify(levelSave);
    console.log(levelJson)
    download("level.txt", levelJson)
  }

  tintDeco(){
    let bg = images.bg[this.decoration.bgSprite];
    let fg = images.fg[this.decoration.fgSprite]
    let coloredBg = createGraphics(bg.width, bg.height) //create new canvas which will become bg image
    coloredBg.tint(...this.decoration.bgColor)
    coloredBg.image(bg, 0, 0, bg.width, bg.height) //Draw white bg image to canvas with tint
    console.log(this.decoration.fgColor)
    let coloredFg = createGraphics(fg.width, fg.height) //create new canvas which will become bg image
    coloredFg.tint(...this.decoration.fgColor)
    coloredFg.image(fg, 0, 0, fg.width, fg.height) //Draw white bg image to canvas with tint

    this.bg = coloredBg;
    this.fg = coloredFg;
  }
  
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}