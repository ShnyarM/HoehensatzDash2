let canvas;
const defaultZoom = 10
let u, uwidth, uheight, zoom = defaultZoom; //Units are used instead of pixels, so there are no problems with different resolutions
let sdeltaTime, timescale=1 //sdeltatime says time between frames in seconds, can be scaled up and down time with timescale
let debug = false
let lastFrames, fps = 60
let gameState = 0; //Which state the game is in, 0 = main menu, 1 = in-game
let mouseClick = false //says if mouse was pressed in that frame, updated is used to make it possible
let oldMouseX, oldMouseY, mouseIsDown;
let savedVars = {"musicVolume":0.3, "soundVolume":0.3, "highscore": 0, "classicHighscore": 0} //Variable which will get automatically saved to localstorage
let sliders = {}

function setup() {
  canvas = createCanvas(1, 1)
  loadLocalStorage()
  adjustVolume()
  textFont(customFont)
  noSmooth()
  windowResized();
  angleMode(DEGREES)
  frameRate(144)
  defineModeConstants() //Define modeconstants in modeConstants.js
  menuSetup()

  //Stop contextmenu
  canvas.canvas.addEventListener("contextmenu", (e) => e.preventDefault());

  lastFrames = new Array(fps);
}

function draw() {
  sdeltaTime=(deltaTime/1000)*timescale //convert deltatime into seconds and multiply with timescale

  background("#1b71c3") 
  switch(gameState){
    case 0:{
      menuDraw()
    }break

    case 1:{
      playLevel()
      drawUI();
    }break
    case 2:{
      drawEditor();
    }break

    default:{
      text("error", 100, 100);
    }break
  }

  //Draw loading level text if loading level
  if(openingLevel){
    textSize(height/12)
    fill("white")
    strokeWeight(height/60)
    text("Loading Level...", width*0.5, height*0.9)
  }

  mouseClick = false
  oldMouseX = mouseX;
  oldMouseY = mouseY
  handleSliders()
}

//Draw the User Interface while in game
function drawUI(){
  if(debug) drawFramerate()
  if(endless) endlessUI()
  else levelUI()

  if(practiceMode) practiceUI()
  if(activeLevel.completed) drawCompletionScreen()
  if(gamePaused) drawPauseMenu()
}

function drawFramerate(){
  //Add current frame and remove last
  lastFrames.splice(0, 1)
  const currentFrame = round(frameRate())
  lastFrames.push(currentFrame)

  //Get average of array
  let sum = 0
  for(let i = 0; i < lastFrames.length; i++) sum += lastFrames[i]
  const average =  round(sum / lastFrames.length)

  textSize(height/50)
  textAlign(LEFT)
  stroke("#414149")
  strokeWeight(height/180)
  fill("white")
  text("Framerate: " + currentFrame, width*0.8, height*0.05)
  text("Average: " + average, width*0.8, height*0.1)
  text("Highest: " + Math.max(...lastFrames), width*0.8, height*0.15)
  text("Lowest: " + Math.min(...lastFrames), width*0.8, height*0.2)
}

function keyPressed(){
  if(gameState==1){
    practiceKeyPressed()
    endlessKeyPressed()
    switch(keyCode){
      case 90: //z, toggle debug mode
        debug = !debug;
        break;
      case 27: //esc, toggle pauseMenu
        gamePaused ? closePauseMenu() : openPauseMenu()
        break;
      case 79: //o, toggle time running on and off
        timescale = timescale == 1 ? 0:1
        break
    }
  }else if(gameState==2){ //editor
    editorKeyPressed()
  }
}

function mousePressed(){
  mouseClick = true
  mouseIsDown = true;

}

function mouseReleased(){
  mouseIsDown = false;
}

function mouseDragged(){
}

function mouseClicked(){
}

function mouseWheel(event){
  if(gameState==2){
    editorMouseWheel(event);
  }
}

//Creates button with specific design, returnfunction gets called when button was pressed
function buttonRect(x, y, l, h, _text, sizeText, returnFunction, options = {}){
  const defaults = {colNor: color(0, 200, 0, 255), colHigh: color(0, 150, 0, 255), curve: height/50, textCol: "white", strokeW: height/120, strokeC: "#202020"} //Default values for options
  const calcOptions = Object.assign(defaults, options)
  rectMode(CENTER)
  strokeWeight(calcOptions.strokeW)
  stroke(calcOptions.strokeC)
  if(buttonCenter(x, y, l, h)){
    fill(calcOptions.colHigh)
    if(mouseClick) returnFunction()
  }else fill(calcOptions.colNor)
  rect(x, y, l, h, calcOptions.curve)
  strokeWeight(height/180)
  textSize(sizeText)
  fill(calcOptions.textCol)
  textAlign(CENTER, CENTER)
  text(_text, x, y)
  rectMode(CORNER)
}

function buttonImg(x, y, w, h, img, padding, returnFunction, options = {}){
  const defaults = {colNor: color(0, 140, 0, 255), disabledCol:color(0, 140, 0, 255), colHigh: color(0, 200, 0, 255), curve: [height/20], strokeW: width/750, strokeC: "#000000", enabled:true} //Default values for options
  const calcOptions = Object.assign(defaults, options)
  push()
  fill("green")
  if(buttonCenter(x, y, w, h)&&calcOptions.enabled){
    fill(calcOptions.colHigh)
    if(mouseClick) returnFunction()
  }else if(!calcOptions.enabled){fill(calcOptions.disabledCol)}
  else fill(calcOptions.colNor)
  strokeWeight(calcOptions.strokeW)
  stroke(calcOptions.strokeC)
  rect(x-w/2, y-h/2, w, h, ...calcOptions.curve);
  //image(img, x-w/2+padding, y-h/2+padding, w-padding*2, h-padding*2)
  image(img, x-w/2 + padding, y-h/2 + padding, w- padding*2, h - padding*2, 0, 0, img.width, img.height, CONTAIN)

  pop()
}

//Draws two rects (bigger black one, smaller white one) which resemble a border, used for inventory
function borderRect(x, y, w, h){
  fill(color(0, 0, 0, 0))//Bigger black border around selected
  stroke("#414149")
  strokeWeight(height/100)
  rect(x, y, w, h)
  strokeWeight(height/250) //smaller white border
  stroke("white")
  rect(x, y, w, h)
}

//Check if mouse is over button with Top Left Mode
function button(x, y, l, h){
  return (mouseX > x && mouseX < x + l && mouseY > y && mouseY < y + h)
}

//Check if mouse is over button with center mode
function buttonCenter(x, y, l, h){
  return (mouseX > x - l / 2 && mouseX < x + l / 2 && mouseY > y - h / 2 && mouseY < y + h / 2)
}

//Draw Rect with unit coordinates and cameraOffset
function unitRect(x, y, rWidth, rHeight){
  rect((x-camera.offsetX)*u, (y-camera.offsetY)*-u, rWidth*u, rHeight*u)
}
function unitToPixelX(x){
  return (x-camera.offsetX)*u
}

function unitToPixelY(y){
  return (y-camera.offsetY)*-u
}

function pixelToUnitX(x){
  return x/u+camera.offsetX;
}

function pixelToUnitY(y){
  return y/-u+camera.offsetY;
}

//Draw Image with unit coordinates and cameraOffset, last parameters says if image should be flipped
function unitImage(img, x, y, rWidth, rHeight, flip = false){
  if(!flip) image(img, (x-camera.offsetX)*u, (y-camera.offsetY)*-u, rWidth*u, rHeight*u)
  else {
    push()
    scale(-1, 1)
    image(img, -(x-camera.offsetX)*u, (y-camera.offsetY)*-u, rWidth*u, rHeight*u)
    pop()
  }
}

//Draw Text with unit coordinates and cameraOffset
function unitText(textString, x, y){
  text(textString, unitToPixelX(x)*u, unitToPixelY(y)*-u)
}

//Draw line with unit coordinates and cameraOffset
function unitLine(x1, y1, x2, y2){
  line(unitToPixelX(x1), unitToPixelY(y1), unitToPixelX(x2), unitToPixelY(y2))
}

//Draw a rotated image
function rotateImage(img, x, y, l, h, rotAmn){
  imageMode(CENTER);
  translate(x, y)
  rotate(rotAmn)
  image(img, 0, 0, l, h)
  rotate(-rotAmn)
  translate(-x, -y)
  imageMode(CORNER)
}

//rotate by a specific point and draw image in new coordinateSystem
//rotX and rotY describe rotation point, rest is like rotateImage()
function rotateImageByPointRotation(img, rotX, rotY, x, y, l, h, rotAmn){
  translate(rotX, rotY)
  rotate(rotAmn)
  image(img, x, y, l, h)
  rotate(-rotAmn)
  translate(-rotX, -rotY)
}

//Draw a rotated image in unit coordinates
function rotateUnitImage(img, x, y, l, h, rotAmn){
  rotateImage(img, unitToPixelX(x)+(l*u*0.5), unitToPixelY(y)+(h*u*0.5), l*u, h*u, rotAmn)
}

//rotate by a specific point and draw image in new coordinateSystem in unit coordinates
//rotX and rotY describe rotation point, rest is like rotateUnitImage()
function rotateUnitImageByPointRotation(img, rotX, rotY, x, y, l, h, rotAmn){
  rotateImageByPointRotation(img, unitToPixelX(rotX), unitToPixelY(rotY), x*u, -y*u, l*u, h*u, rotAmn)
}


//Draw a rotated image, flipped
function rotateImageFlipped(img, x, y, l, h, rotAmn){
  imageMode(CENTER);
  translate(x, y)
  rotate(rotAmn)
  push()
  scale(-1, 1)
  image(img, 0, 0, l, h)
  pop()
  rotate(-rotAmn)
  translate(-x, -y)
  imageMode(CORNER)
}

//Draw a rotated image in unit coordinates, flipped
function rotateUnitImageFlipped(img, x, y, l, h, rotAmn){
  rotateImageFlipped(img, (x-camera.offsetX)*u+(l*u*0.5), (y-camera.offsetY)*-u+(h*u*0.5), l*u, h*u, rotAmn)
}


function drawText(value, x, y, size = u, color = 0, strWeight = 0, strColor = 0){
  strokeWeight(strWeight)
  stroke(strColor)
  fill(color)
  textSize(size)
  text(value, x, y)
}

//Detect collision between objects with pos and size
function collision(x1, y1, w1, h1, x2, y2, w2, h2){
  return (x1 + w1 > x2 && x1 < x2 + w2 && y1 - h1 < y2 && y1 > y2 - h2)
}

//Adjust volume of sound effects
function adjustVolume(){
  explodeSound.setVolume(parseFloat(savedVars.soundVolume))
  practiceSong.setVolume(parseFloat(savedVars.musicVolume))
}

function windowResized(){
  //Resize and position canvas so it is always in 16:9 Ratio
  const divisedWidth = windowWidth/16
  const divisedHeight = windowHeight/9
  switch(true){
    case divisedWidth == divisedHeight:
      resizeCanvas(windowWidth, windowHeight)
      canvas.position(0, 0)
      break;
    case divisedWidth > divisedHeight:
      let calculatedWidth = windowHeight / 9 * 16
      resizeCanvas(calculatedWidth, windowHeight)
      canvas.position((windowWidth - calculatedWidth) * 0.5, 0)
      break;
    case divisedWidth < divisedHeight:
      let calculatedHeight = windowWidth / 16 * 9
      resizeCanvas(windowWidth, calculatedHeight)
      canvas.position(0, (windowHeight-calculatedHeight)*0.5)
      break;
  }
  
  changeZoom(zoom);
  if(gameState == 2)resizeEditor();
}

function changeZoom(newZoomValue){
  zoom = newZoomValue

  u = height/zoom //Pixel per Unit
  uwidth = width/u //Width in units
  uheight = zoom //Height in units
}
