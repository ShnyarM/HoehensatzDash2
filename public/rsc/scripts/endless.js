let endless = false //Says if current mode is endless or not
let score = 0, highScore = 0
let lastXCoordinate = 3 //xCoordinate of last object
const obstacleDistanceMin = 7, obstacleDistanceMax = 10 //minimum distance between obstacles

//Open endless mode
function openEndless(){
  openLevel("read", "/rsc/levels/endless.hd")
  endless = true
  setupEndless(activeLevel)
}

//Setup new run
function setupEndless(levelObj){
  levelObj.interactObjects = [] //Delete all objects
  levelObj.groundObjects = []
  levelObj.deathObjects = []

  score = 0 //Reset variables
  lastXCoordinate = 3

  while(lastXCoordinate < uwidth) addObstacle(levelObj) //Add obstacles until screen is filled
}

//Stop current run and reset
function resetEndless(levelObj){
  setupEndless(levelObj) //Setup next run
}

function endlessUpdate(levelObj){
  if(!activeLevel.song.isPlaying() && !gamePaused) activeLevel.song.play()

  if(!player.dead) score += sdeltaTime
  if(floor(score) > highScore) highScore = floor(score) 
  if(lastXCoordinate < camera.offsetX+uwidth) addObstacle(levelObj) //add new obstacle if needed
}

function endlessUI(){
  textAlign(CENTER, CENTER)
  textSize(height/20)
  fill("white")
  stroke("black")
  strokeWeight(height/100)
  text(floor(score), width*0.5, height*0.1)

  textSize(height/30)
  text("Highscore:", width*0.1, height*0.05)
  text(highScore, width*0.1, height*0.1)
}

//Add a new random obstacle
function addObstacle(levelObj){
  const obstacleToAdd = endlessObstacles[floor(random(endlessObstacles.length))] //Get random obstacle
  const distance = round(random(obstacleDistanceMin, obstacleDistanceMax)) //Get random distance from last obstacle

  for(let i = 0; i < obstacleToAdd.length; i++){ //Add all objects of obstacle
    levelObj.addObject(new gameObject(parseFloat(obstacleToAdd[i][0]), parseFloat(obstacleToAdd[i][1])+lastXCoordinate+distance, parseFloat(obstacleToAdd[i][2]), parseFloat(obstacleToAdd[i][3])))
  }
  lastXCoordinate = parseFloat(obstacleToAdd[obstacleToAdd.length-1][1])+lastXCoordinate+distance //Get y coordinate of last block
}