let menuState = 0 //0 = main menu screen, 1=play, 2=join game, 3=Settings, 4=CreateWorld, 5=Add Friends, 6=errorMessage, 7=How to play
let ownWorlds = [], joinWorlds = [] //Array of worlds than can be joined, only get loaded when requested
let worldNameInput, worldSeedInput; //Inputs for creating new World
let page = 0, selected = false; //Says which page is selected during level select and what level is selected
let searchSelected = true, friendSearchInput //Says if search or friendrequests is selected on add friends screen, input for searching for friends
let userSearchResult = "" //Response of server when searching for user
let friendrequests = [] //List of friendrequests
let errorMessage = "", errorSkipable = true //Error message to pop up when on error message screen and if it is skipable (OK button)

//Draws the menu, buttonRect is a function that creates a button, returnFunction of button gets called when button is clicked
//String in buttonRect usually says what the button does, returnFunction can also help understanding
function menuDraw(){
  switch(menuState){
    case 0:
      drawMainMenu()
      break;
    case 1:
      drawChooseWorld()
      break;
    case 2:
      drawJoinWorld()
      break;
    case 4:
      drawCreateWorld()
      break;
    case 5:
      drawAddFriends()
      break;
    case 6:
      drawErrorMessage()
      break;
    case 7:
      drawGuide()
      break;
  }
}

function drawMainMenu(){
  background("blue")
  fill("white")
  stroke("#414149")
  strokeWeight(height/180)

  textAlign(CENTER, CENTER)
  textSize(height/15)
  text("Höhensatz Dash 2.2", width*0.5, height*0.075)

  buttonRect(width*0.25, height / 2.5 - height / 8, width / 5, height/ 10, "Play", height / 45, () => { //get own world
    openLevel()
  })
  buttonRect(width*0.25, height / 2.5 + height / 8, width / 5, height/ 10, "Level Editor", height / 45, () => { //get own world
    setupEditor()
  })
}

function windowResizedMenu(){

}
