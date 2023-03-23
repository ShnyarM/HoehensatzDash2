let canvas;
let u, uwidth, uheight, zoom = 10; //Units are used instead of pixels, so there are no problems with different resolutions
let sdeltaTime, timescale=1 //sdeltatime says time between frames in seconds, can be scaled up and down time with timescale
let debug = false
let lastFrames, fps = 60
let gameState = 0; //Which state the game is in, 0 = main menu, 1 = in-game
let mouseClick = false //says if mouse was pressed in that frame, updated is used to make it possible

function setup() {
  canvas = createCanvas(1, 1)
  //textFont(pixelDownFont)
  noSmooth()
  windowResized();
  angleMode(DEGREES)

  //Stop contextmenu
  canvas.canvas.addEventListener("contextmenu", (e) => e.preventDefault());

  lastFrames = new Array(fps);
}

function draw() {
  sdeltaTime=(deltaTime/1000)*timescale //convert deltatime into seconds and multiplay with timescale

  background("#1b71c3") 
  switch(gameState){
    case 0:{
      menuDraw()
    }break

    case 1:{
      drawBackground(activeLevel)
      playerUpdate();
      drawLevel(activeLevel);
      cameraUpdate();
      drawUI()
    }break
    case 2:{
      drawEditor();
    }break

    default:{
      text("error", 100, 100);
    }break
  }

  mouseClick = false
}

//Draw the User Interface while in game
function drawUI(){
  if(debug) drawFramerate()
  if(gamePaused) drawPauseMenu()
}

//Join a game, first part of Setup, second part starts in serverClient.js (update player and camera), and then third part starts (map)
function openLevel(){
  gameState = 1;
  playerSetup()
  cameraSetup()
  levelSetup("/rsc/levels/1.json") //ATTENTION
}

//Leave current world and go back to main menu, kicked says if player was kicked by server
function leaveGame(kicked = false){ //ATTENTION
  gameState = 0;
  gamePaused = false
  
  deleteLevel()
  deleteCamera()
  deletePlayer()
}

//reset and restart current level
function resetLevel(){ //ATTENTION
  //Delete everything
  deleteCamera()
  deletePlayer()

  //Setup everything again
  playerSetup()
  cameraSetup()
  levelSetup("/rsc/levels/1.json")  
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
    switch(keyCode){
      case 90: //z, toggle debug mode
        debug = !debug;
        break;
      case 27: //esc, toggle pauseMenu
        gamePaused = !gamePaused
        break;
    }
  }
}


function mousePressed(){
  mouseClick = true
}

function mouseReleased(){
}

function mouseDragged(){
  
}

function mouseWheel(event){
  switch(gameState){
    case 2:{ // Editor to move around
      if(camera.offsetY > 1.5||event.deltaY < 0)camera.offsetY -= event.deltaY/10
      if(camera.offsetX > -1.5||event.deltaX > 0)camera.offsetX += event.deltaX/10
    }break
  }
}

//Creates button with specific design, returnfunction gets called when button was pressed
function buttonRect(x, y, l, h, _text, sizeText, returnFunction, options = {}){
  const defaults = {colNor: color(0, 0, 0, 0), colHigh: color(150, 150, 150, 200), curve: height/20, textCol: "white", strokeW: 0, strokeC: "#414149"} //Default values for options
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
  text(textString, (x-camera.offsetX)*u, (y-camera.offsetY)*-u)
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

//Draw a rotated image in unit coordinates
function rotateUnitImage(img, x, y, l, h, rotAmn){
  rotateImage(img, (x-camera.offsetX)*u, (y-camera.offsetY)*-u, l*u, h*u, rotAmn)
}

//Detect collision between objects with pos and size
function collision(x1, y1, w1, h1, x2, y2, w2, h2){
  return (x1 + w1 > x2 && x1 < x2 + w2 && y1 - h1 < y2 && y1 > y2 - h2)
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
  u = height/zoom //Pixel per Unit
  uwidth = width/u //Width in units
  uheight = zoom //Height in units
}
