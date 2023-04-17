let menuState = 0 //0 = main menu screen
let menus = [drawMainMenu]

//Draws the menu, buttonRect is a function that creates a button, returnFunction of button gets called when button is clicked
//String in buttonRect usually says what the button does, returnFunction can also help understanding
function menuDraw(){
  menus[menuState]();
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
    openLevel("read", "/rsc/levels/1.hd")
  })
  
  buttonRect(width*0.25, height / 2.5 + height / 8, width / 5, height/ 10, "Level Editor", height / 45, () => { //get own world
    setupEditor()
  })

  buttonRect(width*0.25, height / 2.5 + (height / 8)*2, width / 5, height/ 10, "Endless", height / 45, () => { //get own world
    openEndless()
  })

  buttonRect(width*0.5, height / 2.5 - height / 8, width / 5, height/ 10, "Play Level 1", height / 45, () => { //get own world
    openLevel("read", "/rsc/levels/hd1Levels/hd1Level1.hd")
  })

  buttonRect(width*0.5, height / 2.5 + height / 8, width / 5, height/ 10, "Play Level 2", height / 45, () => { //get own world
    openLevel("read", "/rsc/levels/hd1Levels/hd1Level2.hd")
  })

  buttonRect(width*0.5,height / 2.5 + (height / 8)*2, width / 5, height/ 10, "Play Level 3", height / 45, () => { //get own world
    openLevel("read", "/rsc/levels/hd1Levels/hd1Level3.hd")
  })
}
