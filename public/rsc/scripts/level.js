//let groundObjects, interactObjects, deathObjects//blocks = [], spikes = [], jumpRings = [], jumpPads = []
let activeLevel;
const groundTileSize = 5 //Size of single groundtile
const backgroundSize = 20, parallaxFactor = 15 //size of background tile and parralax Strength
const ceilingLimit = 140
let openingLevel = false //says if game is currently opening level, used to prevent multiple levels from opening at oncc

function drawLevel(levelObj){
  levelObj.groundObjects.forEach(element => drawObject(element));
  levelObj.interactObjects.forEach(element => drawObject(element));
  levelObj.deathObjects.forEach(element => drawObject(element));

  //levelObj.groundObjects.forEach(element => drawObjectHitbox(element));
  levelObj.interactObjects.forEach(element => drawObjectHitbox(element));
  //levelObj.deathObjects.forEach(element => drawObjectHitbox(element));
}

function playLevel(){
  drawBackground(activeLevel)
  playerUpdate(activeLevel);
  if(gameState != 1) return //after playerupdate level might've been closed, in this case stop continuing

  drawLevel(activeLevel);
  drawForeground(activeLevel)
  cameraUpdate();
  if(endless) endlessUpdate(activeLevel)
  else activeLevel.placeObjects() //place new objects
  activeLevel.deleteObjects()

  //Draw exit button when in editorPlaytest mode
  if(editorPlaytest) buttonRect(width*0.06, height*0.05, width / 10, height/ 15, "Back", height / 45, () => { //get own world
    stopEditorLevel()
  })
}

function levelUI(){
  const percentage = (player.x/(activeLevel.lastXCoordinate + 8)) //percentage of level completed

  //Draw progress bar background
  strokeWeight(height/350)
  stroke("black")
  fill("gray")
  rect(width*0.3, height*0.03, width*0.4, height*0.02, height*0.1)

  //Draw progress bar
  fill("#00DD00")
  strokeWeight(0)
  rect(width*0.3, height*0.03, width*0.4*percentage, height*0.02, height*0.1)

  //Draw percentage text
  textAlign(CENTER, CENTER)
  textSize(height/30)
  fill("white")
  stroke("black")
  strokeWeight(height/100)
  text(floor(percentage*100) + "%", width*0.73, height*0.04)
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
    if(gameState != 0) line(0, (camLockBorder*camera.groundPosition)*u, width, (camLockBorder*camera.groundPosition)*u) //top, dont draw if in main menu
    line(0, unitToPixelY(yBottom), width, unitToPixelY(yBottom)) //bottom
  }
}

//open a level
function openLevel(type, path = ""){
  if(openingLevel) return //Stop if a level is already being opened

  openingLevel = true
  activeLevel = new Level(type, path, () => {
    gameState = 1;
    playerSetup();
    cameraSetup();
    activeLevel.song.play()
    openingLevel = false
  })
}

function closeLevel(){ //ATTENTION
  gameState = 0;
  menuState = 0;
  gamePaused = false
  endless = false
  editorPlaytest = false
  
  if(activeLevel.song.isPlaying()) activeLevel.song.stop()
  delete activeLevel
  deleteCamera()
  deletePlayer()
  closePractice()
  menuSetup()
}

//reset and restart current level
function resetLevel(levelObj){ //ATTENTION
  levelObj.interactObjects = [] //Delete all objects
  levelObj.groundObjects = []
  levelObj.deathObjects = []
  levelObj.completed = false

  if(endless) resetEndless(levelObj)
  else{
    levelObj.placementIndex = 0
  }

  playerSetup()
  cameraSetup()
  levelObj.placeObjects() //Place all objects that are already in view at start
  if(!endless && !practiceMode) levelObj.song.play() //Start song again if not in endless
  if(practiceMode && checkpoints.length != 0){
    loadCheckpoint()
  }
}

//Draw Level Complete Screen when level completed
function drawCompletionScreen(){
  fill("yellow")
  textSize(height/12)
  text(practiceMode ? "Practice Complete!" : "Level Complete!", width*0.5, height*0.1)

  buttonRect(width*0.5,height*0.4, width*0.3, height*0.1, practiceMode ? "Normal Mode" : "Replay", height*0.05, practiceMode ? closePractice : () => {activeLevel.song.stop(); resetLevel(activeLevel)})
  buttonRect(width*0.5,height*0.6, width*0.3, height*0.1, "Main Menu", height*0.05, closeLevel)

  //Say amount of checkpoint placed
  if(practiceMode){
    textAlign(CENTER, CENTER)
    textSize(height/30)
    fill("white")
    stroke("black")
    strokeWeight(height/150)
    text("Amount of checkpoints placed: " + checkpoints.length, width*0.5, height*0.75)
  }
}

//callback to signalise level has finished loading
class Level{
  constructor(mode, data, callback = () => {}){
    this.allObjects = []
    this.placementIndex = 0 //Which block in allObjects has to be placed next
    this.interactObjects = [];
    this.groundObjects = [];
    this.deathObjects=[];
    this.song = 0
    this.lastXCoordinate = 0 //Xcoordinate of the last block
    this.completed = false //Says if level has been completed
    this.loaded = false //If everything including images has loaded
    
    if(mode == "read"){
      this.readData(data, callback);
    }else if(mode == "menu"){ //menu level
      this.bgSprite = 0
      this.fgSprite = 0
      //get colors for background
      const r = random(0, 360)
      const g = random(0, 255)
      const b = random(0, 100)

      this.bgColor = "#3333ff"
      this.fgColor = "#0000e6"

      this.tintDeco();
      this.loaded=true
    }else{ //empty
      this.bgSprite = 0
      this.fgSprite = 0
      this.bgColor = [136, 136, 221]
      this.fgColor = [136, 136, 221]
      this.levelName = "NewLevel"
      this.songName = "StereoMadness"

      this.tintDeco();
      this.loadSong(callback);
    }
  }

  loadSong(callback =()=>{}){
    loadSound("rsc/music/"+this.songName+".mp3", data => {
      this.song = data
      this.song.setVolume(0.3)
      this.loaded=true
      callback() //Level has finished loading, start game
    })
  }

  readData(path, callback){
    fetch(path)
    .then((response) => response.text())
    .then((txt) => {

      let splitTxt = split(txt, "~");
      let blocks = split(splitTxt[0], "+");

      blocks.forEach((element, index) => {
        blocks[index] = split(element, "°");
        blocks[index].forEach((elem, ind) => {
          blocks[index][ind] = parseFloat(elem)
        })
      })
      this.allObjects = blocks
      this.lastXCoordinate = blocks[blocks.length-1][1] //Get x coordinate of last block

      let metaData = split(splitTxt[1], "+")

      this.bgSprite = parseInt(metaData[0].toString())
      this.fgSprite = parseInt(metaData[1])
      this.bgColor = split(metaData[2], ",")
      this.fgColor = split(metaData[3], ",")
      this.levelName = metaData[4]
      this.songName = metaData[5]

      this.tintDeco();
      this.loadSong(callback)
    });
  }

  //Check if new objects has to be placed
  placeObjects(){
    while(this.placementIndex < this.allObjects.length && this.allObjects[this.placementIndex][1] < camera.offsetX+uwidth){ //place new object if in view of camera
      this.addObject(new gameObject(this.allObjects[this.placementIndex][0], this.allObjects[this.placementIndex][1], this.allObjects[this.placementIndex][2], this.allObjects[this.placementIndex][3]))
      this.placementIndex++
    }
  }

  //Delete objects that arent in view anymore
  deleteObjects(){
    while(this.groundObjects[0] && this.groundObjects[0].x+this.groundObjects[0].width < camera.offsetX){
      delete this.groundObjects[0]
      this.groundObjects.splice(0, 1)
    }

    while(this.interactObjects[0] && this.interactObjects[0].x+this.interactObjects[0].width < camera.offsetX){
      delete this.interactObjects[0]
      this.interactObjects.splice(0, 1)
    }

    while(this.deathObjects[0] && this.deathObjects[0].x+this.deathObjects[0].width < camera.offsetX){
      delete this.deathObjects[0]
      this.deathObjects.splice(0, 1)
    }
  }

  addObject(obj){
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
    
    allObjects.forEach(element => {
      const convertData = convertObjToStringForm(element)
      levelSave += convertData[0] + "°" + convertData[1] + "°" + convertData[2] + "°" + convertData[3] + "+"; 
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
    levelSave += this.bgSprite+"+" + this.fgSprite
    levelSave += "+"+this.bgColor+"+" + this.fgColor
    levelSave += "+"+this.levelName
    levelSave += "+"+this.songName // song link

    download("level.hd", levelSave)
  }

  tintDeco(){
    let bg = images.bg[this.bgSprite];
    let fg = images.fg[this.fgSprite]
    let coloredBg = createGraphics(bg.width, bg.height) //create new canvas which will become bg image
    coloredBg.tint(this.bgColor)
    coloredBg.image(bg, 0, 0, bg.width, bg.height) //Draw white bg image to canvas with tint
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