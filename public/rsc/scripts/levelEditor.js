let editorList = [
    [0],
    [50],
    [100, 101, 102, 103, 104, 105, 106, 107, 108, 120, 121, 122, 123, 124, 125, 126],
    [120, 121, 122, 123, 124, 125, 126, 127, 128, 129]
]
let editorLevel;
let editor = {type:50, category:"Orbs", rowNumb: 2, columNumb: 8}
let editorPlaytest = false

let editorWindow = {}

function setupEditor(){
    editorWindow = {"x": 0,
        get y(){ return height*0.73},
        get height(){ return height-this.y},
        get width(){ return width}
    }
    gameState = 2;
    editorLevel = new Level("empty")
    cameraSetup()
}

function drawEditor(){
    background("blue")

    drawGrid();
    drawLevel(editorLevel)
    drawEditorUI();
    if(mouseY < editorWindow.y){
        fill(255, 255, 255, 100)
        unitImage(objImages[editor.type], floor(pixelToUnitX(mouseX)), ceil(pixelToUnitY(mouseY)), 1, 1)
        if(mouseClick)editorLevel.addObject(new gameObject(editor.type, floor(pixelToUnitX(mouseX)), ceil(pixelToUnitY(mouseY))))
    }else{
        if(mouseClick){
            for(let j = 0; j < editor.rowNumb; j++){
                for(let i = 0; i < editor.columNumb; i++){
                    let boxHeight = editorWindow.height/editor.rowNumb - editorWindow.height/20 - editorWindow.height/10
                    if(button(width/2 + i* (boxHeight+editorWindow.height/20) -boxHeight * (editor.columNumb+1)/2, editorWindow.y + editorWindow.height/20 + j*(editorWindow.height/20 + boxHeight), boxHeight, boxHeight))editor.type = editorList[2][j*editor.columNumb+i]
                }
            }
        }
    }
}

function drawEditorUI(){
    fill(120, 130, 1400)
    strokeWeight(0)
    rect(editorWindow.x, editorWindow.y, editorWindow.width, editorWindow.height)
    fill("green")

    fill(40)
    for(let j = 0; j < editor.rowNumb; j++){
        for(let i = 0; i < editor.columNumb; i++){
            let boxHeight = editorWindow.height/editor.rowNumb - editorWindow.height/20 - editorWindow.height/10
            rect(width/2 + i* (boxHeight+editorWindow.height/20) -boxHeight * (editor.columNumb+1)/2, editorWindow.y + editorWindow.height/20 + j*(editorWindow.height/20 + boxHeight), boxHeight, boxHeight)
            image(objImages[editorList[2][j*editor.columNumb+i]], width/2 + i* (boxHeight+editorWindow.height/20) -boxHeight * (editor.columNumb+1)/2, editorWindow.y + editorWindow.height/20 + j*(editorWindow.height/20 + boxHeight), boxHeight, boxHeight)
        }
    }
    editorList[2].forEach((element, index) => {
        for(let i = 0; i < editor.rowNumb; i++){
            //let dim = {"x":width/4 +width/8*index, "y":editorWindow.y + editorWindow.height/10 + editorWindow.height/2*parentIndex, "width": editorWindow.height/3, "height": editorWindow.height/3}
            //rect(dim.x, dim.y, dim.width, dim.height);
            //image(objImages[element], dim.x + (objectList[element].xOffset * dim.width), dim.y - (objectList[element].yOffset * dim.height), dim.width * objectList[element].width, dim.height * objectList[element].height)
        }
    })

    strokeWeight(0.04*u)
    stroke(0)
    fill("red")
    rect(width*0.8, height*0.9, width*0.2, height*0.1)

    drawText("Save Level", width*0.9, height*0.95, 0.5*u)
    if(mouseClick&&button(width*0.8, height*0.9, width*0.2, height*0.1))editorLevel.saveLevel();

    strokeWeight(0.04*u)
    stroke(0) 
    fill("red")
    rect(0, height*0.9, width*0.2, height*0.1)
    drawText("Play Level", width*0.1, height*0.95, 0.5*u)

    if(mouseClick&&button(0, height*0.9, width*0.2, height*0.1)){
      startEditorLevel()
    }
}

//Playtest level in editor
function startEditorLevel(){
  //convert three arrays into one allobjects array which can be read to place blocks
  let allObjects = [...editorLevel.deathObjects, ...editorLevel.interactObjects, ...editorLevel.groundObjects]
  allObjects.sort((a, b) => (a.x > b.x) ? 1 : -1)
  for(const o in allObjects){
    const convertedData = convertObjToStringForm(allObjects[o])
    editorLevel.allObjects.push(convertedData)
  }

  //Delete all objects
  editorLevel.interactObjects = [];
  editorLevel.groundObjects = [];
  editorLevel.deathObjects=[];

  //Start game
  gameState = 1;
  editorPlaytest = true
  activeLevel = editorLevel;
  activeLevel.song.play()
  playerSetup()
  cameraSetup()
}

function stopEditorLevel(){
  //open editor
  gameState = 2;
  editorPlaytest = false
  editorLevel.song.stop()
  
  //Delete all objects
  editorLevel.interactObjects = [];
  editorLevel.groundObjects = [];
  editorLevel.deathObjects=[];

  //Place all blocks again
  for(const obj of editorLevel.allObjects){
    console.log(obj)
    editorLevel.addObject(new gameObject(obj[0], obj[1], obj[2]))
  }

  editorLevel.allObjects = [] //Clear
  editorLevel.placementIndex = 0
}

function drawGrid(){
    stroke("grey")
    strokeWeight(0.04*u)
    for(let i = ceil(pixelToUnitX(0));i < ceil(pixelToUnitX(width));i++){
        line(unitToPixelX(i), 0, unitToPixelX(i), height)
    }
    for(let i = ceil(pixelToUnitY(height));i < ceil(pixelToUnitY(0));i++){
        line(0, unitToPixelY(i), width, unitToPixelY(i))
    }
    strokeWeight(0.1*u)
    stroke("black")
    line(0, unitToPixelY(0), width, unitToPixelY(0))
    line(unitToPixelX(0), 0, unitToPixelX(0), height)
}

function drawText(value, x, y, size = u, color = 0, strWeight = 0, strColor = 0){
    strokeWeight(strWeight)
    stroke(strColor)
    fill(color)
    textSize(size)
    text(value, x, y)
}