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
  if(endless) endlessUpdate(activeLevel)
  else activeLevel.placeObjects() //place new objects
  activeLevel.deleteObjects()
}

//draw background
function drawBackground(levelObj){
  if(!levelObj.bg) return //Fixes bug where game crashes when bg image hasnt loaded, temporary fix
  const backStart = floor((camera.offsetX/parallaxFactor)/backgroundSize) //Get index of first image
  for(let i = backStart; i <= backStart+ceil(uwidth/backgroundSize); i++){ //Draw all background tiles
    image(levelObj.bg, (backgroundSize*i-camera.offsetX / parallaxFactor) * u, (10-camera.offsetY / parallaxFactor) * -u, backgroundSize * u, backgroundSize * u)
  } 
}

//Draw Foreground
function drawForeground(levelObj){
  if(!levelObj.fg) return //Fixes bug where game crashes when fg image hasnt loaded, temporary fix
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

//open a level
function openLevel(levelObj){
  gameState = 1;
  playerSetup();
  cameraSetup();
  activeLevel = levelObj;
}

function closeLevel(){ //ATTENTION
  gameState = 0;
  gamePaused = false
  endless = false
  
  delete activeLevel
  deleteCamera()
  deletePlayer()
}

//reset and restart current level
function resetLevel(levelObj){ //ATTENTION
  /*if(endless){ //Delete everything if in endless mode
    resetEndless(levelObj)
  }else{
    //Setup everything again
    levelObj.interactObjects.forEach(element => {
      element.used = false   
    });
  }*/

  levelObj.interactObjects = [] //Delete all objects
  levelObj.groundObjects = []
  levelObj.deathObjects = []

  if(endless) resetEndless(levelObj)
  else{
    levelObj.placementIndex = 0
  }

  playerSetup()
  cameraSetup()
  levelObj.placeObjects() //Place all objects that are already in view at start
}

class Level{
  constructor(mode, data){
    this.allObjects = []
    this.placementIndex = 0 //Which block in allObjects has to be placed next
    this.interactObjects = [];
    this.groundObjects = [];
    this.deathObjects=[];
    this.decoration={"bgSprite":0, "fgSprite":0, "bgColor": "#FFFF00", "fgColor": "FF00FF"}
    
    if(mode == "read"){
      this.readData(data);
    }else{
      this.bgSprite = 0
      this.fgSprite = 0
      this.bgColor = "#FFFF00"
      this.fgColor = "FF00FF"
      this.levelName = "NewLevel"
      this.musicLink = "/rsc/music/StereoMadness.mp4"

      this.tintDeco();
    }
  }

  readData(path){
    fetch(path)
    .then((response) => response.text())
    .then((txt) => {

      let splitTxt = split(txt, "~");
      let blocks = split(splitTxt[0], "+");

      blocks.forEach((element, index) => {
        blocks[index] = split(element, "°");
        blocks[index].forEach((elem, ind) => {
          blocks[index][ind] = parseInt(elem)
        })
      })
      this.allObjects = blocks
      console.log(this.allObjects)

      let metaData = split(splitTxt[1], "+")

      this.bgSprite = parseInt(metaData[0].toString())
      this.fgSprite = parseInt(metaData[1])
      this.bgColor = metaData[2]
      this.fgColor = metaData[3]
      this.levelName = metaData[4]
      this.musicLink = metaData[5]
      this.placeObjects() //place all objects that are already in view at start


      /*blocks.forEach(element => {
        console.log(element)
        this.addObject(new gameObject(element[0], element[1], element[2]))
      })*/
      this.tintDeco();
    });
  }

  //Check if new objects has to be placed
  placeObjects(){
    while(this.placementIndex < this.allObjects.length && this.allObjects[this.placementIndex][1] < camera.offsetX+uwidth){ //place new object if in view of camera
      this.addObject(new gameObject(this.allObjects[this.placementIndex][0], this.allObjects[this.placementIndex][1], this.allObjects[this.placementIndex][2]))
      this.placementIndex++
      console.log("new object placed")
    }
  }

  //Delete objects that arent in view anymore
  deleteObjects(){
    while(this.groundObjects[0] && this.groundObjects[0].x+this.groundObjects[0].width < camera.offsetX){
      delete this.groundObjects[0]
      this.groundObjects.splice(0, 1)
      console.log("deleted")
    }

    while(this.interactObjects[0] && this.interactObjects[0].x+this.interactObjects[0].width < camera.offsetX){
      delete this.interactObjects[0]
      this.interactObjects.splice(0, 1)
      console.log("deleted")
    }

    while(this.deathObjects[0] && this.deathObjects[0].x+this.deathObjects[0].width < camera.offsetX){
      delete this.deathObjects[0]
      this.deathObjects.splice(0, 1)
      console.log("deleted")
    }
  }

  addObject(obj){
    //console.log(obj)
    switch(true){
      case obj.id < 50:
        this.groundObjects.push(obj);
        break;
      
      case obj.id < 100:
        this.deathObjects.push(obj); 
        break
      case obj.id >= 100:
        this.interactObjects.push(obj)
        break
    }
  }

  saveLevel(path){ // TEMPORARY: get e txt file with useable level data
    /*let levelSave = {
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
    console.log(levelJson)*/
    let levelSave = ""

    //put all objects in one array and sort by x coordinate
    let allObjects = [...this.deathObjects, ...this.interactObjects, ...this.groundObjects]
    allObjects.sort((a, b) => (a.x > b.x) ? 1 : -1)
    console.log(allObjects)
    
    allObjects.forEach(element => {
      levelSave += element.id + "°" + element.x + "°" + element.y + "+"; 
    });
    /*this.deathObjects.forEach(element => {
      levelSave += element.id + "°" + element.x + "°" + element.y + "+"; 
    });

    this.interactObjects.forEach(element => {
      levelSave += element.id + "°" + element.x + "°" + element.y + "+"; 
    });

    this.groundObjects.forEach(element => {
      levelSave += element.id + "°" + element.x + "°" + element.y + "+"; 
    });*/
    levelSave = levelSave.substring(0,levelSave.length-1);

    levelSave += "~"
    levelSave += this.decoration.bgSprite+"+" + this.decoration.fgSprite
    levelSave += "+"+this.decoration.bgColor+"+" + this.decoration.fgColor
    levelSave += "+LevelName+/rsc/music/StereoMadness.mp4" // song link

    download("level.hd", levelSave)
  }

  tintDeco(){
    let bg = images.bg[this.bgSprite];
    let fg = images.fg[this.fgSprite]
    let coloredBg = createGraphics(bg.width, bg.height) //create new canvas which will become bg image
    coloredBg.tint(this.bgColor)
    coloredBg.image(bg, 0, 0, bg.width, bg.height) //Draw white bg image to canvas with tint
    console.log(this.fgColor)
    let coloredFg = createGraphics(fg.width, fg.height) //create new canvas which will become bg image
    coloredFg.tint(this.fgColor)
    coloredFg.image(fg, 0, 0, fg.width, fg.height) //Draw white bg image to canvas with tint

    this.bg = coloredBg;
    this.fg = coloredFg;
  }
  
}

function download(filename, text) { //TEMPORARY: used to download files
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}