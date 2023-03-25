let list = [["Spike", "Block", "JumpOrb", "JumpPad"], ["GravityOrb", "GravityPad", "LowJumpOrb", "LowJumpPad"]]
let editorLevel;
let editor = {type:"ShipPortal"}

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
    //drawBackground(editorLevel)
    drawGrid();
    drawLevel(editorLevel)
    drawEditorUI();
    if(mouseY < editorWindow.y){
        fill(255, 255, 255, 100)
        unitImage(images[editor.type], floor(pixelToUnitX(mouseX)), ceil(pixelToUnitY(mouseY)), 1, 1)
        if(mouseClick)editorLevel.addObject(new gameObject(editor.type, floor(pixelToUnitX(mouseX)), ceil(pixelToUnitY(mouseY))))
    }else{
        if(mouseClick){
            list.forEach((elem, parentIndex) => {
                elem.forEach((element, index) => {
                    let dim = {"x":width/4 +width/8*index, "y":editorWindow.y + editorWindow.height/10 + editorWindow.height/2*parentIndex, "width": editorWindow.height/3, "height": editorWindow.height/3}
                    if(button(dim.x, dim.y, dim.width, dim.height))editor.type = element;
                })
            })
        }
    }
}

function drawEditorUI(){
    fill(120, 130, 1400)
    strokeWeight(0)
    rect(editorWindow.x, editorWindow.y, editorWindow.width, editorWindow.height)
    fill("green")
    strokeWeight(0.04*u)
    stroke(100, 200, 150)
    list.forEach((elem, parentIndex) => {
        elem.forEach((element, index) => {
            let dim = {"x":width/4 +width/8*index, "y":editorWindow.y + editorWindow.height/10 + editorWindow.height/2*parentIndex, "width": editorWindow.height/3, "height": editorWindow.height/3}
            rect(dim.x, dim.y, dim.width, dim.height);
            image(images[element], dim.x + (objectList[element].xOffset * dim.width), dim.y - (objectList[element].yOffset * dim.height), dim.width * objectList[element].width, dim.height * objectList[element].height)
        })
    })
    fill("red")
    rect(width*0.8, height*0.9, width*0.2, height*0.1)
    textSize(0.5*u)
    fill(0)
    strokeWeight(0)
    text("Save Level", width*0.9, height*0.95)
    if(mouseClick&&button(width*0.8, height*0.9, width*0.2, height*0.1))editorLevel.saveLevel();

    fill("red")
    rect(0, height*0.9, width*0.2, height*0.1)
    textSize(0.5*u)
    fill(0)
    strokeWeight(0)
    text("Play Level", width*0.1, height*0.95)
    if(mouseClick&&button(0, height*0.9, width*0.2, height*0.1)){
        gameState = 1;
        activeLevel = editorLevel;
    playerSetup()
    cameraSetup()
    }
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