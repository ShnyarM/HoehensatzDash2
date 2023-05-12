let editorList = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
    [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66],
    [67, 68, 69, 70, 71, 72, 73, 74],
    [100, 101, 102, 103, 104, 105, 106, 107, 108, 130, 131, 132, 133, 134, 150],
    [120, 123, 124, 125, 126, 127, 128, 129, 135, 136, 121, 122],
]
let editorLevel;
let editor = {
  mode: 0,
  object: "",
  selectedSite: 0,
  selectedCategory: 0,
  move: 0,
  type: 50,
  rowNumb: 2,
  columNumb: 8,
  rotation: 0,
  editObject: {}
}
let editorPlaytest = false

let editorWindow = {}
let positionSlider;
let optionsMenu = false;
let nameInput;
let colorOptions = []
let optionsSong;
let songList, songId, optionsSongLoaded

function setupEditor(levelObj) {
  gameState = 2;

  editorWindow = {
    "x": 0,
    get y() {return height * 0.73},
    get height() {return height - this.y},
    get width() {return width},
    get tabSize() {return width / 20},
    get itemSize() {return (this.height - this.height / 10) / (editor.rowNumb + 0.5)},
    get itemPadding() {return this.height / 20}
  }

  editorLevel = levelObj
  cameraSetup()

  editor.object = new gameObject(0, floor(pixelToUnitX(mouseX)), ceil(pixelToUnitY(mouseY)), editor.rotation)

    positionSlider = addSlider("positionSlider", 0.5, 0.05, 0.35, 0.02, -1, -2, 10)
    positionSlider.input(() => {camera.offsetX = positionSlider.value})

    optionsSongLoaded = false
    songId = songList.indexOf(editorLevel.songName)
    loadSound("rsc/music/"+editorLevel.songName+".mp3", data => {
      optionsSong = data
      optionsSong.setVolume(0.3)
      optionsSongLoaded = true;
    })
}

function drawEditor() {
  background("blue")
  let imgY = -height
  image(editorLevel.bg, 0, imgY, width, height - imgY)

  drawGrid();
  drawLevel(editorLevel)
  if (!optionsMenu) {
    if (mouseY < editorWindow.y) {
      let hasClicked = false;
      for (let i = 0; i < editorList.length; i++) {
        if (button(editorWindow.tabSize * 2 * i + width / 2 - (editorList.length - 1) * editorWindow.tabSize - editorWindow.tabSize / 2, editorWindow.y - editorWindow.tabSize, editorWindow.tabSize, editorWindow.tabSize)) hasClicked = true
      }
      if (button(positionSlider.xLeftPixel, positionSlider.yTopPixel, positionSlider.widthPixel, positionSlider.heightPixel)) hasClicked = true
      switch (editor.mode) {
        case 0: {
          drawObject(editor.object)
          moveObject(editor.object, floor(pixelToUnitX(mouseX)), ceil(pixelToUnitY(mouseY)))

          if (mouseClick) {
            if (!hasClicked) {
              let id = editor.object.id
              let rot = editor.object.rotation
              if(editor.editObject[floor(editor.object.x)]==null)editor.editObject[floor(editor.object.x)] = {}
              if(editor.editObject[floor(editor.object.x)][floor(editor.object.y)] == null) editor.editObject[floor(editor.object.x)][floor(editor.object.y)] = []
              editor.editObject[floor(editor.object.x)][floor(editor.object.y)].push(editor.object)
              editorLevel.addObject(editor.object)
              if (editor.object.x > positionSlider.maxValue) {positionSlider.maxValue = editor.object.x; positionSlider.updateValue()}
              editor.object = new gameObject(id, floor(pixelToUnitX(mouseX)), ceil(pixelToUnitY(mouseY)), rot)
            }
          }
          break;
        }
        case 1: {
          if (mouseIsDown && !hasClicked) {
            camera.offsetX += (pixelToUnitX(oldMouseX) - pixelToUnitX(mouseX));
            camera.offsetY += (pixelToUnitY(oldMouseY) - pixelToUnitY(mouseY));

            if (positionSlider.maxValue < camera.offsetX)positionSlider.maxValue = camera.offsetX + 4;
            if(camera.offsetX < -2)camera.offsetX = -2
            if(camera.offsetY < 2)camera.offsetY = 2
            positionSlider.value = camera.offsetX
            positionSlider.updateValue()
          }
          
        }break;
        case 2: {
          if (mouseClick) {
            let unitX = floor(pixelToUnitX(mouseX))
            let unitY = ceil(pixelToUnitY(mouseY))
            let end = false
            for(let i = unitX -2; i < unitX+3;i++){
              for(let j = unitY - 2; j < unitY + 3;j++){
                if(editor.editObject[i]!=null){
                  if(editor.editObject[i][j]!=null){
                    editor.editObject[i][j].forEach((element, index) => {
                      collisionObject({x: unitX, y: unitY, width:1, height:1}, element, ()=>{
                        if(editor.selectedObject != null){
                          if(editor.selectedObject.index != element){
                          editor.selectedObject = element; 
                          editor.selectedObject.index = index;
                          end=true
                        }
                      }else{
                        editor.selectedObject = element; 
                        editor.selectedObject.index = index;
                        end=true
                      }
                    })
                  });
                 }
               }
              }
            }
          }
        }break;
      }
    }
  }

  if(editor.mode == 2){
    if(editor.selectedObject != null){
      noFill()
      strokeWeight(u/10)
      stroke(0, 0, 255)
      
      unitRect(editor.selectedObject.xCenter+editor.selectedObject.drawOffsetX, editor.selectedObject.yCenter+editor.selectedObject.drawOffsetY, editor.selectedObject.drawnWidth, editor.selectedObject.drawnHeight) //Draw without rotation
    }
  }
  stroke(0)

  drawEditorUI();

  if (optionsMenu) {
    drawOptionsMenu();
  }
}

function drawEditorUI() {
  fill(20, 20, 25, 180)
  strokeWeight(width / 800)
  rect(editorWindow.x, editorWindow.y, editorWindow.width, editorWindow.height)

  buttonRect(width*0.06, height*0.05, width / 10, height/ 15, "Back", height / 45, () => {
    gameState = 0;
    menuState = 0;
    removeSlider("positionSlider")
    
    deleteCamera()
    deletePlayer()
    closePractice()
    menuSetup()
  })

    if(editor.mode == 2){
      buttonImg(width - editorWindow.height / 1.35, editorWindow.y + editorWindow.height * 0.3, editorWindow.height / 3, editorWindow.height / 3, objImages[editor.object.id], width / 100, () => {editor.mode = 0}, {enabled:!optionsMenu});

      buttonImg(width /2 - width/16, editorWindow.y + editorWindow.height * 0.75, editorWindow.height / 3, editorWindow.height / 3, editorImgs.doubleLeftArrow, width / 100, () => { 
        moveEditorObject(-1, 0)
      }, {
        colHigh: "#aaaaaa",
        colNor: "#222222",
        curve: [width / 100],
        enabled: !optionsMenu&&editor.selectedObject !=null,
        disabledCol: "#222222"
      });

      buttonImg(width /2 + width/8, editorWindow.y + editorWindow.height * 0.75, editorWindow.height / 3, editorWindow.height / 3, editorImgs.doubleRightArrow, width / 100, () => { 
        moveEditorObject(1, 0)
      }, {
        colHigh: "#aaaaaa",
        colNor: "#222222",
        curve: [width / 100],
        enabled: !optionsMenu&&editor.selectedObject !=null,
        disabledCol: "#222222"
      });

      buttonImg(width /2, editorWindow.y + editorWindow.height * 0.75, editorWindow.height / 3, editorWindow.height / 3, editorImgs.doubleDownArrow, width / 100, () => { 
        moveEditorObject(0, -1)
      }, {
        colHigh: "#aaaaaa",
        colNor: "#222222",
        curve: [width / 100],
        enabled: !optionsMenu&&editor.selectedObject !=null,
        disabledCol: "#222222"
      });

      buttonImg(width /2 + width/16, editorWindow.y + editorWindow.height * 0.75, editorWindow.height / 3, editorWindow.height / 3, editorImgs.doubleUpArrow, width / 100, () => { 
        moveEditorObject(0, 1)
      }, {
        colHigh: "#aaaaaa",
        colNor: "#222222",
        curve: [width / 100],
        enabled: !optionsMenu&&editor.selectedObject !=null,
        disabledCol: "#222222"
      });


      buttonImg(width /2 - width/16, editorWindow.y + editorWindow.height * 0.25, editorWindow.height / 3, editorWindow.height / 3, editorImgs.leftArrow, width / 100, () => { 
        moveEditorObject(-0.1, 0)
      }, {
        colHigh: "#aaaaaa",
        colNor: "#222222",
        curve: [width / 100],
        enabled: !optionsMenu&&editor.selectedObject !=null,
        disabledCol: "#222222"
      });

      buttonImg(width /2 + width/8, editorWindow.y + editorWindow.height * 0.25, editorWindow.height / 3, editorWindow.height / 3, editorImgs.rightArrow, width / 100, () => { 
        moveEditorObject(0.1, 0)
      }, {
        colHigh: "#aaaaaa",
        colNor: "#222222",
        curve: [width / 100],
        enabled: !optionsMenu&&editor.selectedObject !=null,
        disabledCol: "#222222"
      });

      buttonImg(width /2, editorWindow.y + editorWindow.height * 0.25, editorWindow.height / 3, editorWindow.height / 3, editorImgs.downArrow, width / 100, () => { 
        moveEditorObject(0, -0.1)
      }, {
        colHigh: "#aaaaaa",
        colNor: "#222222",
        curve: [width / 100],
        enabled: !optionsMenu&&editor.selectedObject !=null,
        disabledCol: "#222222"
      });

      buttonImg(width /2 + width/16, editorWindow.y + editorWindow.height * 0.25, editorWindow.height / 3, editorWindow.height / 3, editorImgs.upArrow, width / 100, () => { 
        moveEditorObject(0, 0.1)
      }, {
        colHigh: "#aaaaaa",
        colNor: "#222222",
        curve: [width / 100],
        enabled: !optionsMenu&&editor.selectedObject !=null,
        disabledCol: "#222222"
      });

      buttonImg(width /2 - width/8, editorWindow.y + editorWindow.height * 0.75, editorWindow.height / 3, editorWindow.height / 3, editorImgs.rotateRight, width / 100, () => { 
        editor.selectedObject.rotation = (editor.selectedObject.rotation + 1) % 4
      }, {
        colHigh: "#aaaaaa",
        colNor: "#222222",
        curve: [width / 100],
        enabled: !optionsMenu&&editor.selectedObject !=null,
        disabledCol: "#222222"
      });

      buttonImg(width /2 - width/8, editorWindow.y + editorWindow.height * 0.25, editorWindow.height / 3, editorWindow.height / 3, editorImgs.rotateLeft, width / 100, () => { 
        editor.selectedObject.rotation--
        if(editor.selectedObject.rotation < 0)editor.selectedObject.rotation=3
      }, {
        colHigh: "#aaaaaa",
        colNor: "#222222",
        curve: [width / 100],
        enabled: !optionsMenu&&editor.selectedObject !=null,
        disabledCol: "#222222"
      });


      buttonImg(width /2 + width/4, editorWindow.y + editorWindow.height * 0.5, editorWindow.height / 3, editorWindow.height / 3, editorImgs.trash, width / 100, () => { 
        editor.editObject[floor(editor.selectedObject.x)][floor(editor.selectedObject.y)].splice(editor.selectedObject.index, 1)
        switch(true){
          case editor.selectedObject.id < 50:
            editorLevel.groundObjects.forEach((element, index)=>{
              if(element == editor.selectedObject){editorLevel.groundObjects.splice(index, 1);editor.selectedObject = null;return}
            })
            break;
          
          case editor.selectedObject.id < 100:
            editorLevel.deathObjects.forEach((element, index)=>{
              if(element == editor.selectedObject){editorLevel.deathObjects.splice(index, 1);editor.selectedObject = null;return}
            })
            break

          case editor.selectedObject.id >= 100:
            editorLevel.interactObjects.forEach((element, index)=>{
              if(element == editor.selectedObject){editorLevel.interactObjects.splice(index, 1);editor.selectedObject = null;return}
            })
            break
        }
      }, {
        colHigh: "#aaaaaa",
        colNor: "#222222",
        curve: [width / 100],
        enabled: !optionsMenu&&editor.selectedObject !=null,
        disabledCol: "#222222"
      });

    }else{
    for (let i = 0; i < editorList.length; i++) {
      buttonImg(editorWindow.tabSize * 2 * i + width / 2 - (editorList.length - 1) * editorWindow.tabSize, editorWindow.y - editorWindow.tabSize / 2, editorWindow.tabSize, editorWindow.tabSize, objImages[editorList[i][0]], width / 140, () => {
        editor.selectedCategory = i
        editor.selectedSite = 0;
      }, {
        colNor: [60, 60, 60, 180],
        curve: [editorWindow.tabSize / 3, editorWindow.tabSize / 3, 0, 0],
        enabled: !optionsMenu,
        disabledCol: [60, 60, 60, 180]
      })
    }

    for (let j = 0; j < ceil((editorList[editor.selectedCategory].length - (editor.selectedSite) * editor.rowNumb) / editor.rowNumb) && j < editor.rowNumb; j++) {
      for (let i = 0; i < editorList[editor.selectedCategory].length - (editor.selectedSite) * editor.rowNumb * editor.columNumb - j * editor.columNumb && i < editor.columNumb; i++) {
        buttonImg((editorWindow.itemSize + editorWindow.itemPadding) * i + width / 2 - (editor.columNumb - 1) * (editorWindow.itemSize + editorWindow.itemPadding) / 2, editorWindow.y + editorWindow.itemPadding + editorWindow.itemSize / 2 + (editorWindow.itemSize + editorWindow.itemPadding) * j, editorWindow.itemSize, editorWindow.itemSize, objImages[editorList[editor.selectedCategory][j * editor.columNumb + i + editor.selectedSite*editor.rowNumb*editor.columNumb]], width/100, () => {
          editor.mode = 0
          editor.object = new gameObject(editorList[editor.selectedCategory][j * editor.columNumb + i + editor.selectedSite*editor.rowNumb*editor.columNumb], floor(pixelToUnitX(mouseX)), floor(pixelToUnitY(mouseY)), editor.rotation)
        }, {
          colHigh: "#aaaaaa",
          colNor: "#222222",
          curve: [width / 100],
          enabled: !optionsMenu,
          disabledCol: "#222222"
        });
      }
    }
    buttonImg(width - editorWindow.height / 1.35, editorWindow.y + editorWindow.height * 0.3, editorWindow.height / 3, editorWindow.height / 3, editorImgs.cursor, width / 100, () => {editor.mode = 2}, {enabled:!optionsMenu});
  
    if(ceil(editorList[editor.selectedCategory].length/(editor.rowNumb*editor.columNumb)) > 1){
      buttonImg(width/2-width/3.7, editorWindow.y + editorWindow.height/2 - editorWindow.itemPadding, width/40, width/40, editorImgs.leftArrow, width/300, ()=>{
        editor.selectedSite--
        if(editor.selectedSite < 0)editor.selectedSite = ceil(editorList[editor.selectedCategory].length/(editor.rowNumb*editor.columNumb))-1
      },
      {
        colHigh: "#aaaaaa",
        colNor: "#888888",
        curve: [width / 100],
        enabled: !optionsMenu,
        disabledCol: "#222222"
      });
    
      buttonImg(width/2+width/3.7, editorWindow.y + editorWindow.height/2 - editorWindow.itemPadding, width/40, width/40, editorImgs.rightArrow, width/300, ()=>{
        editor.selectedSite = (editor.selectedSite + 1) % ceil(editorList[editor.selectedCategory].length/(editor.rowNumb*editor.columNumb))
      },
      {
        colHigh: "#aaaaaa",
        colNor: "#888888",
        curve: [width / 100],
        enabled: !optionsMenu,
        disabledCol: "#222222"
      });
    }

    for(let i = 0; i < ceil(editorList[editor.selectedCategory].length/(editor.rowNumb*editor.columNumb));i++){
      fill(100)
      if(editor.selectedSite == i){
        fill(240)
      }
      circle(width/2 + i*width/50 - ((ceil(editorList[editor.selectedCategory].length/(editor.rowNumb*editor.columNumb)) -1)*width/50)/2, height - width/75, width/100)
    }
  }
  buttonImg(width - editorWindow.height / 3.2, editorWindow.y + editorWindow.height * 0.3, editorWindow.height / 3, editorWindow.height / 3, editorImgs.zoomIn, width / 100, () => changeZoom(zoom - 1), {enabled:!optionsMenu});
  buttonImg(width - editorWindow.height / 3.2, editorWindow.y + editorWindow.height * 0.7, editorWindow.height / 3, editorWindow.height / 3, editorImgs.zoomOut, width / 100, () => changeZoom(zoom + 1), {enabled:!optionsMenu});
  buttonImg(width - editorWindow.height / 1.35, editorWindow.y + editorWindow.height * 0.7, editorWindow.height / 3, editorWindow.height / 3, editorImgs.move, width / 100, () => {editor.mode = 1}, {enabled:!optionsMenu});

  buttonImg(editorWindow.height / 3.2, editorWindow.y + editorWindow.height * 0.3, editorWindow.height / 3, editorWindow.height / 3, editorImgs.play, width / 100, () => startEditorLevel(), {enabled:!optionsMenu&&optionsSongLoaded});
  buttonImg(editorWindow.height / 3.2, editorWindow.y + editorWindow.height * 0.7, editorWindow.height / 3, editorWindow.height / 3, editorImgs.save, width / 100, () => editorLevel.saveLevel(), {enabled:!optionsMenu});
  buttonImg(editorWindow.height / 1.35, editorWindow.y + editorWindow.height * 0.3, editorWindow.height / 3, editorWindow.height / 3, editorImgs.options, width / 100, () => openOptions(), {enabled:!optionsMenu});
  
  buttonImg(editorWindow.height / 1.35, editorWindow.y + editorWindow.height * 0.7, editorWindow.height / 3, editorWindow.height / 3, editorImgs.upload, width / 100, () => {editorLevel.uploadLevel()}, {enabled:!optionsMenu});

  let selectedImage;
  switch(editor.mode){
    case 0: {
      selectedImage = objImages[editor.object.id]
    }break;
    case 1: {
      selectedImage = editorImgs.move
    }break;
    case 2:{
      selectedImage = editorImgs.cursor
    }break
  }
  buttonImg(width*0.97, width*0.03, editorWindow.height / 3, editorWindow.height / 3, selectedImage, width / 100, () => {}, {enabled:false, disabledCol: 180});
}

//Playtest level in editor
function startEditorLevel() {
  removeSlider("positionSlider")
  if(optionsSong !=null)
  editorLevel.song=optionsSong
  //convert three arrays into one allobjects array which can be read to place blocks
  let allObjects = [...editorLevel.deathObjects, ...editorLevel.interactObjects, ...editorLevel.groundObjects]
  allObjects.sort((a, b) => (a.x > b.x) ? 1 : -1)
  for (const o in allObjects) {
    const convertedData = convertObjToStringForm(allObjects[o])
    editorLevel.allObjects.push(convertedData)
  }
  if (editorLevel.allObjects.length != 0) editorLevel.lastXCoordinate = editorLevel.allObjects[editorLevel.allObjects.length - 1][1]
  editorLevel.startPos = {x: 0, y:0}
  editorLevel.allObjects.forEach(element=>{
    if(element[0] == 150){editorLevel.startPos.x = element[1];editorLevel.startPos.y = element[2]}
  })
  //Delete all objects
  editorLevel.interactObjects = [];
  editorLevel.groundObjects = [];
  editorLevel.deathObjects = [];

  //Start game
  changeZoom(defaultZoom)
  gameState = 1;
  editorPlaytest = true
  activeLevel = editorLevel;
  activeLevel.song.play()
  activeLevel.song.jump()
  playerSetup()
  cameraSetup()
  goToStartPos()
}

function stopEditorLevel() {
  //open editor
  gameState = 2;
  closePractice()
  editorPlaytest = false
  editorLevel.song.stop()
  editorLevel.startPosSongStart = 0

  //Delete all objects
  editorLevel.interactObjects = [];
  editorLevel.groundObjects = [];
  editorLevel.deathObjects = [];
  
  //Place all blocks again
  editor.selectedObject = null
  editor.editObject = {}
  for (const obj of editorLevel.allObjects) {
    let ob = new gameObject(obj[0], obj[1], obj[2], obj[3])
    if(editor.editObject[floor(ob.x)]==null)editor.editObject[floor(ob.x)] = {}
    if(editor.editObject[floor(ob.x)][floor(ob.y)] == null) editor.editObject[floor(ob.x)][floor(ob.y)] = []
    editor.editObject[floor(ob.x)][floor(ob.y)].push(ob)
    editorLevel.addObject(ob)

  }

  editorLevel.allObjects = [] //Clear
  editorLevel.placementIndex = 0

  positionSlider = addSlider("positionSlider", 0.5, 0.05, 0.35, 0.02, -1, -2, 10)
  positionSlider.input(() => {camera.offsetX = positionSlider.value})
}

function drawGrid() {
  stroke("grey")
  strokeWeight(0.04 * u)
  for (let i = ceil(pixelToUnitX(0)); i < ceil(pixelToUnitX(width)); i++) {
    line(unitToPixelX(i), 0, unitToPixelX(i), height)
  }
  for (let i = ceil(pixelToUnitY(height)); i < ceil(pixelToUnitY(0)); i++) {
    line(0, unitToPixelY(i), width, unitToPixelY(i))
  }
  strokeWeight(0.1 * u)
  stroke("black")
  line(0, unitToPixelY(0), width, unitToPixelY(0))
  line(unitToPixelX(0), 0, unitToPixelX(0), height)
}

function editorKeyPressed() {
  switch (keyCode) {
    case 38: //up arrow, zoom in
      changeZoom(zoom - 1)
      break;
    case 40: //downarrow, zoom out
      changeZoom(zoom + 1)
      break;
    case 82: //r, rotate object
     if(editor.mode == 0)editor.object.rotation = (editor.object.rotation + 1) % 4
      if(editor.mode == 2&&editor.selectedObject.rotation != null)editor.selectedObject.rotation = (editor.selectedObject.rotation + 1) % 4
    break;
  }
}

function resizeEditor() {
  if (optionsMenu) {
    nameInput.position(width / 6 + (windowWidth - width) / 2, height / 3 + (windowHeight - height) / 2)
    nameInput.size(width / 5, height / 20)
    nameInput.style("font-size", width / 80 + "px")
  }
}

function editorMouseWheel(event) {
  if(!optionsMenu){
    // Editor to move around
    camera.offsetX += event.deltaX / 10
    camera.offsetY -= event.deltaY / 100
    if (positionSlider.maxValue < camera.offsetX)positionSlider.maxValue = camera.offsetX + 4;
    if(camera.offsetX < -2)camera.offsetX = -2
    if(camera.offsetY < 2)camera.offsetY = 2
    positionSlider.value = camera.offsetX
    positionSlider.updateValue()
  }
}

function openOptions() {
  optionsMenu = true;
  positionSlider.enabled = false;
  nameInput = createInput(editorLevel.levelName)
  nameInput.position(width / 6 + (windowWidth - width) / 2, height / 3 + (windowHeight - height) / 2)
  nameInput.size(width / 5, height / 20)
  nameInput.style("text-align", "center")
  nameInput.style("font-size", width / 80 + "px")
  nameInput.style("font-family", "PixelSplitter")

  colorOptions[0] = addSlider("redBg", 0.45, 0.3, 0.1, 0.015, editorLevel.bgColor[0], 0, 255)
  colorOptions[1] = addSlider("greenBg", 0.45, 0.35, 0.1, 0.015, editorLevel.bgColor[1], 0, 255)
  colorOptions[2] = addSlider("blueBg", 0.45, 0.4, 0.1, 0.015, editorLevel.bgColor[2], 0, 255)

  colorOptions[3] = addSlider("redFg", 0.45, 0.65, 0.1, 0.015, editorLevel.fgColor[0], 0, 255)
  colorOptions[4] = addSlider("greenFg", 0.45, 0.7, 0.1, 0.015, editorLevel.fgColor[1], 0, 255);
  colorOptions[5] = addSlider("blueFg", 0.45, 0.75, 0.1, 0.015, editorLevel.fgColor[2], 0, 255)
}

function closeOptions() {
  editorLevel.levelName = nameInput.value()
  nameInput.remove();

  removeSlider("redBg");
  removeSlider("greenBg");
  removeSlider("blueBg");

  removeSlider("redFg");
  removeSlider("greenFg");
  removeSlider("blueFg");

  optionsMenu = false;
  editorLevel.tintDeco();
  positionSlider.enabled=true;

  editorLevel.songName = songList[songId]
  optionsSong.stop()
}

function drawOptionsMenu(){
  fill(40, 40, 40, 220)
    rect(width / 10, height / 10, width - width / 5, height - height / 5, width / 10)

    image(editorLevel.bg, width / 1.5, height / 2 - width/ 7 - height/20, width / 7, width / 7)
    image(editorLevel.fg, width / 1.5, height / 2 + height/20, width / 7, width / 7)

    buttonImg(width / 1.55, height / 2 - width/14-height/20, width / 40, width / 40, editorImgs.leftArrow, width / 200, () => {
      editorLevel.bgSprite--;
      if (editorLevel.bgSprite < 0) {
        editorLevel.bgSprite = images.bg.length - 1
      }
      editorLevel.tintDeco()
    }, {
      colNor: 200
    })

    buttonImg(width / 1.45 + width / 7, height / 2 - width/14-height/20, width / 40, width / 40, editorImgs.rightArrow, width / 200, () => {
      editorLevel.bgSprite = (editorLevel.bgSprite + 1) % images.bg.length;
      editorLevel.tintDeco()
    }, {
      colNor: 200
    })

    buttonImg(width / 1.55, height / 2 + width/14+height/20, width / 40, width / 40, editorImgs.leftArrow, width / 200, () => {
      editorLevel.fgSprite--;
      if (editorLevel.fgSprite < 0) {
        editorLevel.fgSprite = images.fg.length - 1
      }
      editorLevel.tintDeco()
    }, {
      colNor: 200
    })

    buttonImg(width / 1.45 + width / 7, height / 2 + width/14+height/20, width / 40, width / 40, editorImgs.rightArrow, width / 200, () => {
      editorLevel.fgSprite = (editorLevel.fgSprite + 1) % images.fg.length;
      editorLevel.tintDeco()
    }, {
      colNor: 200
    })
    buttonImg(width / 6, height / 5, width / 30, width / 30, editorImgs.close, width / 200, () => {
      closeOptions()
    }, {
      colNor: 200
    })

    fill(colorOptions[0].value, colorOptions[1].value, colorOptions[2].value)
    rect(width / 1.75 - width / 20, height / 4, width / 10, width / 20)

    fill(colorOptions[3].value, colorOptions[4].value, colorOptions[5].value)
    rect(width / 1.75 - width / 20, height / 2 + height/10, width / 10, width / 20)

    buttonRect(width / 1.75, height/2 - width/20, width / 10, width / 20, "Apply", width / 50, () => {
      editorLevel.bgColor = [colorOptions[0].value, colorOptions[1].value, colorOptions[2].value]
      editorLevel.tintDeco();
    })

    buttonRect(width / 1.75, height/2 -width/20+ height/10+ width / 7, width / 10, width / 20, "Apply", width / 50, () => {
      editorLevel.fgColor = [colorOptions[3].value, colorOptions[4].value, colorOptions[5].value]
      editorLevel.tintDeco();
    })
    
    textSize(width/50)
    text("Level Name:", width / 6 + width/10, height/3 - width/50)
    text("Song:", width / 6 + width/10, height/3*2 - width/50)
    text(songList[songId], width / 6 + width/10, height/3*2 +width/100)
    if(optionsSongLoaded){
    if(!(optionsSong.isPlaying())){
      buttonImg(width / 6 + width/10, height/3*2 + width/20, width/30, width/30, editorImgs.play, width / 200, () => {
        optionsSong.play();
      }, {enabled: optionsSongLoaded, disabledCol: "#ff0000"})
    }else{
      buttonImg(width / 6 + width/10, height/3*2 + width/20, width/30, width/30, editorImgs.pause, width / 200, () => {
        optionsSong.stop();
      })
    }
  }else{
    buttonImg(width / 6 + width/10, height/3*2 + width/20, width/30, width/30, editorImgs.play, width / 200, () => {
      optionsSong.play();
    }, {enabled: optionsSongLoaded, disabledCol: "#ff0000"})
  }
    buttonImg(width / 6 + width/10 - width/25, height/3*2 + width/20, width/30, width/30, editorImgs.leftArrow, width / 200, () => {
      songId--
      if(songId < 0)songId=songList.length-1
      optionsSong.stop();
      optionsSongLoaded = false;
      loadSound("rsc/music/"+songList[songId]+".mp3", data => {
        optionsSong = data
        optionsSong.setVolume(0.3)
        optionsSongLoaded = true;
      })
    })

    buttonImg(width / 6 + width/10 + width/25, height/3*2 + width/20, width/30, width/30, editorImgs.rightArrow, width / 200, () => {
      songId = (songId+1)%songList.length
      optionsSongLoaded = false
      optionsSong.stop();
      loadSound("rsc/music/"+songList[songId]+".mp3", data => {
        optionsSong = data
        optionsSong.setVolume(0.3)
        optionsSongLoaded = true;
      })
    })
}

function moveEditorObject(x, y){
  moveObject(editor.selectedObject, editor.selectedObject.x+x, editor.selectedObject.y+y)
  delete editor.editObject[floor(editor.selectedObject.x-x)][floor(editor.selectedObject.y-y)][editor.selectedObject.index]
  if(editor.editObject[floor(editor.selectedObject.x)] == null)editor.editObject[floor(editor.selectedObject.x)] = {}
  if(editor.editObject[floor(editor.selectedObject.x)][floor(editor.selectedObject.y)] == null)editor.editObject[floor(editor.selectedObject.x)][floor(editor.selectedObject.y)] = []
  editor.editObject[floor(editor.selectedObject.x)][floor(editor.selectedObject.y)].push(editor.selectedObject)
  editor.selectedObject.index = editor.editObject[floor(editor.selectedObject.x)][floor(editor.selectedObject.y)].length-1

}

function levelEditorMenu(){
  textAlign(CENTER, CENTER)
  textSize(height/12)
  fill("#FFFF00")
  stroke("black")
  strokeWeight(height/60)
  text("Level Editor", width*0.5, height*0.075)

  buttonRect(width*0.06, height*0.05, width / 10, height/ 15, "Back", height / 45, () => {
    menuState = 0
  })

  buttonRect(width/2 + width/2.75, height/10, width / 5, height/ 10, "Creat Level", height / 45, () => { 
    setupEditor(new Level("empty"))
  })

  for(let i = 0; i < ceil(onlineLevelNames.length/4)&&i < 2; i++){
    for(let j = 0; j < (onlineLevelNames.length/4-i)*4&& j < 4; j++){
      buttonRect(width*0.375+i*width*0.25, height*0.35+height*0.15*j, width / 5, height/ 10, onlineLevelNames[i*4+j].levelName, height / 45, () => { 
        postJSON("/getPrivateLevel", { "id":  onlineLevelNames[i*4+j].id}, (data)=>{

          let tempLvl = new Level("data", data.level)
                  //Delete all objects
          tempLvl.interactObjects = [];
          tempLvl.groundObjects = [];
          tempLvl.deathObjects = [];
          
          //Place all blocks again
          tempLvl.selectedObject = null
          tempLvl.editObject = {}
          for (const obj of tempLvl.allObjects) {
            let ob = new gameObject(obj[0], obj[1], obj[2], obj[3])
            tempLvl.addObject(ob)
          }

          tempLvl.allObjects = [] //Clear
          tempLvl.placementIndex = 0
          tempLvl.id = onlineLevelNames[i*4+j].id
          setupEditor(tempLvl)
        });
      })
    }
  }
  if(onlinePage > 0)
  buttonImg(width/4.5, height/1.75, width / 30, width / 30, editorImgs.leftArrow, width / 200, () => {
    onlinePage--
    postJSON("/getPrivateLevelNames", { "page": onlinePage }, (data)=>{
      onlineLevelNames = data.reverse();
    });
  }, {
    colNor: 200
  })
  if(onlinePage < lastOnlinePage)
  buttonImg(width/2 + width/3.75, height/1.75, width / 30, width / 30, editorImgs.rightArrow, width / 200, () => {
    onlinePage++
    postJSON("/getPrivateLevelNames", { "page": onlinePage }, (data)=>{
      onlineLevelNames = data.reverse();
    });
  }, {
    colNor: 200
  })
}