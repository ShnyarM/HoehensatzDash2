let editorList = [
    [0],
    [50],
    [100, 101, 102, 103, 104, 105, 106, 107, 108, 130, 131, 132, 133, 134],
    [120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 135, 136]
]
let editorLevel;
let editor = {mode: 0, object: "", selectedSite: 1, selectedCategory: 2, move: 0, type:50, rowNumb: 2, columNumb: 8, rotation: 0}
let editorPlaytest = false

let editorWindow = {}

function setupEditor(){
    editorWindow = {"x": 0,
        get y(){ return height*0.73},
        get height(){ return height-this.y},
        get width(){ return width},
        get tabSize(){return width/20},
        get itemSize(){return (this.height - this.height/10)/(editor.rowNumb+0.5)},
        get itemPadding(){return this.height/20}
    }

    gameState = 2;
    editorLevel = new Level("empty")
    cameraSetup()

    editor.object = new gameObject(0, floor(pixelToUnitX(mouseX)), ceil(pixelToUnitY(mouseY)), editor.rotation)
}

function drawEditor(){
    background("blue")
    let imgY = -height
    image(editorLevel.bg, 0, imgY, width, height-imgY)

    drawGrid();
    drawLevel(editorLevel)
    if(mouseY < editorWindow.y){
      if(editor.mode == 0){
        drawObject(editor.object)
        moveObject(editor.object, floor(pixelToUnitX(mouseX)), ceil(pixelToUnitY(mouseY)))
        
        if(mouseClick){
          let hasClicked = false;
          for(let i = 0; i < editorList.length; i++){
            if(button(editorWindow.tabSize*2*i + width/2 - (editorList.length-1)*editorWindow.tabSize - editorWindow.tabSize/2, editorWindow.y-editorWindow.tabSize, editorWindow.tabSize, editorWindow.tabSize))hasClicked=true
          }
          if(!hasClicked){
            let id = editor.object.id
            let rot = editor.object.rotation
            editorLevel.addObject(editor.object)
            editor.object = new gameObject(id, floor(pixelToUnitX(mouseX)), ceil(pixelToUnitY(mouseY)), rot)
          }
        }
      }else if(editor.mode==1){
        if(mouseIsDown){
          camera.offsetX += (pixelToUnitX(oldMouseX)-pixelToUnitX(mouseX));
          camera.offsetY += (pixelToUnitY(oldMouseY)-pixelToUnitY(mouseY));
        }
      }
      }else{
      if(mouseClick){
            for(let j = 0; j < editor.rowNumb; j++){
              for(let i = 0; i < editor.columNumb; i++){
                let boxHeight = editorWindow.height/editor.rowNumb - editorWindow.height/20 - editorWindow.height/10
                if(button(width/2 + i* (boxHeight+editorWindow.height/20) -boxHeight * (editor.columNumb+1)/2, editorWindow.y + editorWindow.height/20 + j*(editorWindow.height/20 + boxHeight), boxHeight, boxHeight)){
                  editor.object = new gameObject(editorList[editor.selectedCategory][j*editor.columNumb+i], floor(pixelToUnitX(mouseX)), ceil(pixelToUnitY(mouseY)), editor.rotation)
                  editor.mode = 0
                }
              }
            }
          }
        }
        stroke(0)

        drawEditorUI();
      }

function drawEditorUI(){
    fill(20, 20, 25, 180)
    strokeWeight(width/800)
    rect(editorWindow.x, editorWindow.y, editorWindow.width, editorWindow.height)

    fill(40)
    for(let i = 0; i < editorList.length; i++){
      buttonImg(editorWindow.tabSize*2*i + width/2 - (editorList.length-1)*editorWindow.tabSize, editorWindow.y-editorWindow.tabSize/2, editorWindow.tabSize, editorWindow.tabSize, objImages[editorList[i][0]], width/140, ()=>{editor.selectedCategory=i}, {colNor:[60, 60, 60, 180], curve:[editorWindow.tabSize/3, editorWindow.tabSize/3, 0, 0]})
    }

    fill(40)
    for(let j = 0; j < ceil((editorList[editor.selectedCategory].length-(editor.selectedSite-1)*editor.rowNumb)/editor.rowNumb)&& j < editor.rowNumb; j++){
        for(let i = 0; i < editorList[editor.selectedCategory].length-(editor.selectedSite-1)*editor.rowNumb*editor.columNumb-j*editor.columNumb&&i < editor.columNumb; i++){
            buttonImg((editorWindow.itemSize+editorWindow.itemPadding)*i + width/2 - (editor.columNumb-1)*(editorWindow.itemSize+editorWindow.itemPadding)/2, editorWindow.y + editorWindow.itemPadding+editorWindow.itemSize/2 + (editorWindow.itemSize+editorWindow.itemPadding)*j, editorWindow.itemSize,editorWindow.itemSize, objImages[editorList[editor.selectedCategory][j*editor.columNumb+i]], 10, ()=>{editor.object = new gameObject(editorList[editor.selectedCategory][j*editor.columNumb+i], floor(pixelToUnitX(mouseX)), ceil(pixelToUnitY(mouseY)), editor.rotation)}, {colHigh: "#aaaaaa", colNor: "#222222",curve:[width/100]});
        }
    }
 
    buttonImg(width-editorWindow.height/3.2, editorWindow.y + editorWindow.height*0.3, editorWindow.height/3, editorWindow.height/3, editorImgs.zoomIn, width/100, ()=>changeZoom(zoom - 1));
    buttonImg(width-editorWindow.height/3.2, editorWindow.y + editorWindow.height*0.7, editorWindow.height/3, editorWindow.height/3, editorImgs.zoomOut, width/100, ()=>changeZoom(zoom + 1));
    buttonImg(width-editorWindow.height/1.35, editorWindow.y + editorWindow.height*0.3, editorWindow.height/3, editorWindow.height/3, editorImgs.cursor, width/100, ()=>{editor.mode = 2});
    buttonImg(width-editorWindow.height/1.35, editorWindow.y + editorWindow.height*0.7, editorWindow.height/3, editorWindow.height/3, editorImgs.move, width/100, ()=>{editor.mode=1});

    buttonImg(editorWindow.height/3.2, editorWindow.y + editorWindow.height*0.3, editorWindow.height/3, editorWindow.height/3, editorImgs.play, width/100, ()=>startEditorLevel());
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
  if(editorLevel.allObjects.length != 0) editorLevel.lastXCoordinate = editorLevel.allObjects[editorLevel.allObjects.length-1][1]

  //Delete all objects
  editorLevel.interactObjects = [];
  editorLevel.groundObjects = [];
  editorLevel.deathObjects=[];

  //Start game
  changeZoom(defaultZoom)
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
  closePractice()
  editorPlaytest = false
  editorLevel.song.stop()
  
  //Delete all objects
  editorLevel.interactObjects = [];
  editorLevel.groundObjects = [];
  editorLevel.deathObjects=[];

  //Place all blocks again
  for(const obj of editorLevel.allObjects){
    editorLevel.addObject(new gameObject(obj[0], obj[1], obj[2], obj[3]))
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

function editorKeyPressed(){
  switch(keyCode){
    case 38: //up arrow, zoom in
      changeZoom(zoom-1)
      break;
    case 40: //downarrow, zoom out
      changeZoom(zoom+1)
      break;
    case 82: //r, rotate object
      editor.object.rotation = (editor.object.rotation+1)%4
      break;
  }
}