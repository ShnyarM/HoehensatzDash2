//let groundObjects, interactObjects, deathObjects//blocks = [], spikes = [], jumpRings = [], jumpPads = []
let activeLevel;
const groundTileSize = 5 //Size of single groundtile
const backgroundSize = 20, parallaxFactor = 15 //size of background tile and parralax Strength
const jumpPadStrength = 1.5
const ceilingLimit = 140

function levelSetup(path){
  activeLevel = new Level("read", path)
}

function drawLevel(levelObj){
  levelObj.groundObjects.forEach(element => drawObject(element));
  levelObj.interactObjects.forEach(element => drawObject(element));
  levelObj.deathObjects.forEach(element => drawObject(element));
}

//draw background and forground
function drawBackground(levelObj){
  const backStart = floor((camera.offsetX/parallaxFactor)/backgroundSize) //Get index of first image
  for(let i = backStart; i <= backStart+ceil(uwidth/backgroundSize); i++){ //Draw all background tiles
    image(levelObj.bg, (backgroundSize*i-camera.offsetX / parallaxFactor) * u, (10-camera.offsetY / parallaxFactor) * -u, backgroundSize * u, backgroundSize * u)
  } 


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