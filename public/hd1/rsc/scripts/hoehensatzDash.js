//<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
var kathetenSatz, flagge, flaggeImg, img, dev1, dev2, dev3, foreskin, grass, moto, moveIcon, trashCan, BrainCells, menuBg, levelsBg, onlineBg, makerBg;
let heftig = false;
let points;
let globalHighScore;
let globalNewHighscore;
let personalHighScore = 10
let personalNewHighscore
let increaseAmount;
let screenTime;
let textTime;
let textYes;
let attempts;
let x, y;
let newPos, grav, newGrav;
let jumpForce, newJump;
let triangleSpeed;
let upsideDown;
let xx, xy, yx, yy;
let gameActive;
let playerSize, objectSize;
let objects = [];
let orbs = [];
let gravityOrbs = [];
let blocks = [];
let vektor = [];
let groundHeight;
let lastObject;
let insideOrb;
let insideGravityOrb;
let canClickOrb;
let canJumpStart, spaceJumpStart;
let rotat;
let rot;
let backX1, backX2, backX3, backX4;
let backMove;
let foregroundX = [];
let editorObjects = [],
  numbEditorObjects = 0,
  clicked, levelSeed = "",
  output = true;
let splitLevel, customLevel = "3,2,200,240,1,240,280,1,400,280,",
  amnOfObjectsLevel = 90,
  objectsLoaded = 0,
  objectIndex = 0,
  progress, percentageText, percentage = 0,
  percentageHighScore = 0,
  newPercentage = false,
  objectsDeleted = 0,
  loadSingleTime = true;
let seedInput, seedInInput = 0,
  seedOutput;
let triangleY = 0;
let toolbarBoxSize,
  toolbarBoxes = 4;
let numberObjects;
let whu, oof, waschmachine, song = 0;
let musicSlider, soundSlider;
let lastGameActive;
let cnv, cnvX, cnvY;
let inderPic = false,
  deleteWebHost = true;
let gameActiveToLoad;
let splitEndless, obstacles;
let mapEditorInput, editorSlider, editorLastObject = 0,
  editorLoadScreen = false,
  testLevel = false,
  startPos = false,
  startX = 0,
  startY = 0,
  selector = 0,
  editorRotate = 0,
  editorSliderValue = 0,
  moveValueX = 0,
  moveValueY = 0;
let won = false,
  lamnbrah = false;
let level1, level2, level3;
let globalLevelList = [],
  onlineLevels = [];
let globalLevelListLoad = true;
let uploadLevel = false,
  nameInp,
  userInp;
let newLevelList = "",
  newLevelListLoad = false,
  getLevelList = [],
  first, second;
let varReseted = false;
let jumpStrength;
let transition = false;
let levelData = [];
let currentPage = 0,
  pages = 0;
let ownLevels = [],
  saveLevel = false;
let saveNameInp, saveNameFill = false,
  levelAndUserName = false,
  ownLoadedId, ownLevelName;
let username;

function preload() {

  img = loadImage("rsc/images/player.png");
  flaggeImg = loadImage("rsc/images/Kommunismuss.jpg");
  grass = loadImage("rsc/images/ground.png");
  moto = loadImage("rsc/images/Moto.png");
  moveIcon = loadImage("rsc/images/move-icon.png");
  trashCan = loadImage("rsc/images/trashcan.png");
  menuBg = loadImage("rsc/images/menu.png");
  onlineBg = loadImage("rsc/images/online.png");
  levelsBg = loadImage("rsc/images/levels.png");
  makerBg = loadImage("rsc/images/maker.png");
  dev1 = loadImage("rsc/images/bg.png");
  dev2 = loadImage("rsc/images/bg.png");
  dev3 = loadImage("rsc/images/bg.png");
  obstacles = loadStrings("rsc/txt/obstacles.txt")
  level1 = loadStrings("rsc/txt/level1.txt")
  level2 = loadStrings("rsc/txt/level2.txt")
  level3 = loadStrings("rsc/txt/level3.txt")
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnvX = (windowWidth - width) / 2;
  cnvY = (windowHeight - height) / 2;
  cnv.position(cnvX, cnvY);
  x = 10, y = 350;
  globalHighScore = 0;
  frameRate(60);
  if (localStorage.getItem("username") == null) {
    localStorage.setItem("username", "")
  }
  username = localStorage.getItem("username")
  if (localStorage.getItem("personalHighScore") == null) {
    localStorage.setItem("personalHighScore", 0)
  }
  if (localStorage.getItem("ownerLevels") == null) {
    localStorage.setItem("ownerLevels", "")
  }
  personalHighScore = int(localStorage.getItem("personalHighScore"));
  attempts = 1;

  gameActive = 2;
  //0 = game, 1 = soviet, 2 = hauptmenü, 3 = highscore, 4 = pause, 5 = editor, 6 = play Level, 7 = Moto moto, 8 = Levelselect

  whu = loadSound("rsc/sounds/whu.mp3");
  waschmaschine = loadSound("rsc/sounds/Waschmaschine.mp3");
  oof = loadSound("rsc/sounds/Oof.mp3");
  musicSound = 0.01;
  soundSound = 0.1;

  $.get("https://vamos.alwaysdata.net/HoehensatzDash/occupied.php", function(data) {
    globalHighScore = (data - (data % 10)) / 10;
  });
  textAlign(CENTER, CENTER)
  frameRate(60)
}

function draw() {
  frameRate(60);
  if (document.fullscreenElement) {
    if (!varReseted) {
      varReset(0);
      gameActive = 2;
      varReseted = true;
    }
    if (gameActive === 0) {
      strokeWeight(height / 250);
      gamePlay();

      if (globalHighScore < points) {
        increaseAmount++;
        globalHighScore = points;
        globalNewHighscore = true;
      }
      if (personalHighScore < points) {
        increaseAmount++;
        personalHighScore = points;
        personalNewHighscore = true;
      }

      stroke(0);
      fill("white");
      textSize(height / 15);
      text(floor(points), width / 2, height / 15);
      textSize(height / 25);
      text(floor(globalHighScore), width / 10, height / 7);
      textSize(height / 30);
      text("Global Highscore", width / 10, height / 10);

      textSize(height / 25);
      text(floor(personalHighScore), width / 10, height / 7 * 1.5);
      textSize(height / 30);
      text("Personal Highscore", width / 10, height / 10 * 1.75);
    } else if (gameActive == 2) {
      //background(120);
      image(menuBg, 0, 0, width, height);
      stroke(0);
      fill(255, 255, 255, 120);
      strokeWeight(height / 166);
      rect(width / 10, height / 5, width / 3, height / 5, height / 20);
      rect(width / 10, height / 1.75, width / 3, height / 5, height / 20);
      rect(width - width / 10 - width / 3, height / 5, width / 3, height / 5, height / 20);
      rect(width - width / 10 - width / 3, height / 1.75, width / 3, height / 5, height / 20);
      rect(width - width / 100 - width / 5, height - height / 17.5 - height / 7, width / 5, height / 7, height / 20);
      fill("white");
      textSize(height / 9);
      text("HöhensatzDash", width / 2, height / 10);
      textSize(height / 12);
      text("Levels", width / 10 + width / 3 / 2, height / 5 + height / 5 / 2);
      text("Endless", width / 10 + width / 3 / 2, height / 1.75 + height / 5 / 2);
      text("Map Maker", width - width / 10 - width / 3 / 2, height / 5 + height / 5 / 2);
      text("Online Levels", width - width / 10 - width / 3 / 2, height / 1.75 + height / 5 / 2);
      text("By VamoStudio", width / 2, height - height / 10);
      textSize(height / 35)
      text("Play at 100% browserzoom for the most bug free experience. Avoid changing the browserzoom while playing.", width / 2, height - height / 35);
      textSize(height / 15)
      text("Discord", width - width / 100 - width / 5 / 2, height - height / 17.5 - height / 7 / 2);
    } else if (gameActive === 3) {
      if (screenTime > 1) {
        screenTime--;
      } else {
        if (!won) {
          gameActive = 1;
        } else {
          gameActive = 2
          won = false;
          attempts = 1;
          percentageHighScore = 0;
          percentage = 0;
        }
      }
      strokeWeight(height / 100);
      background(205, 0, 0);
      image(flaggeImg, (width - height) / 2, 0, height, height);
      fill(0, 0, 0, 200);
      rect(0, 0, width, height);
      if (textYes) {
        fill("white");
        textSize(height / 10);
        if (won) {
          text("Level Complete! VAMOS!", width / 2, height / 2);
        } else if (newPercentage) {
          text("New Highscore!", width / 2, height / 2);
          textSize(height / 15);
          text(percentage + "%", width / 2, height / 3);
        } else {
          textSize(height / 10);
          text("New Highscore!", width / 2, height / 2);
          textSize(height / 15);
          text("+" + increaseAmount, width / 2, height / 3);
        }
        textSize(30);
        textTime--;
        if (textTime <= 0) textYes = false;
      } else {
        textTime++;
        if (textTime >= 30) {
          textYes = true;
        }
      }
    } else if (gameActive === 1) {
      strokeWeight(height / 500);
      background(205, 0, 0);
      image(flaggeImg, (width - height) / 2, 0, height, height);
      stroke(0);
      strokeWeight(height / 500);
      fill("white")
      rect(width - width / 10.5, height / 100, width / 11, height / 15, height / 40);
      fill("black");
      textSize(height / 20);
      if (gameActiveToLoad == 0 || gameActiveToLoad == 1) {
        text("Pause", width - width / 10.5 + width / 22, height / 100 + height / 30);
      } else {
        text("Back", width - width / 10.5 + width / 22, height / 100 + height / 30);
      }
    } else if (gameActive === 4) {
      fill("white");
      textSize(height / 10);
      text("Paused", width / 2, height / 10);

      musicSound = musicSlider.value();
      soundSound = soundSlider.value();
      textSize(height / 12);
      text("Music", width / 6 + width / 10, height / 2);
      text("Sounds", width - width / 6 - width / 10, height / 2);
      rect(width - width / 10 - width / 3, height / 1.5, width / 3, height / 5, height / 20);
      rect(width / 10, height / 1.5, width / 3, height / 5, height / 20);
      stroke(0);
      strokeWeight(height / 166);
      textSize(height / 12);
      text("Menu", width / 10 + width / 6, height / 1.5 + height / 10);
      text("Resume", width - width / 10 - width / 3 + width / 6, height / 1.5 + height / 10);
    } else if (gameActive === 5) {
      levelEditor();
    } else if (gameActive === 6) {
      userLevel();
      if (percentageHighScore < percentage) {
        newPercentage = true;
        percentageHighScore = percentage;
      }
    } else if (gameActive === 7) {
      gamePlay();
      image(moto, width / 2, height / 5, height / 2, height / 2);
    } else if (gameActive === 8) {
      //background(120);
      image(levelsBg, 0, 0, width, height)
      stroke(0);
      strokeWeight(height / 166);
      fill(255, 255, 255, 120);
      rect(width / 10, height / 5, width / 3, height / 5, height / 20);
      rect(width / 10, height / 1.75, width / 3, height / 5, height / 20);
      rect(width - width / 10 - width / 3, height / 5, width / 3, height / 5, height / 20);
      rect(width - width / 10 - width / 3, height / 1.75, width / 3, height / 5, height / 20);
      fill("white");
      textSize(height / 9);
      text("Levels", width / 2, height / 10);
      textSize(height / 10);
      text("Moto Moto", width / 10 + width / 3 / 2, height / 5 + height / 5 / 2);
      text("Höhensatz", width / 10 + width / 3 / 2, height / 1.75 + height / 5 / 2 - height / 20);
      text("Madness", width / 10 + width / 3 / 2, height / 1.75 + height / 5 / 2 + height / 20);
      textSize(height / 12);
      text("Back on", width - width / 10 - width / 3 / 2, height / 5 + height / 5 / 2 - height / 20);
      text("Trigonometrie", width - width / 10 - width / 3 / 2, height / 5 + height / 5 / 2 + height / 20);
      textSize(height / 10);
      text("Prismageist", width - width / 10 - width / 3 / 2, height / 1.75 + height / 5 / 2);

      drawBack(color(255,255,255, 120))
    } else if (gameActive === 9) {
      strokeWeight(height / 166)
      image(onlineBg, 0, 0, width, height);
      if (heftig) {
        //customLevel = lev[0];
        splitLevel = split(customLevel, ",");
        splitLevel.splice(-1, 1)
        canJumpStart = false;
        spaceJumpStart = false;
        varReset(1);
      }
      if (globalLevelListLoad) {
        textSize(height / 8)
        text("Loading Levels...", width / 2, height / 2);
        $.get("https://vamos.alwaysdata.net/HoehensatzDash/levelList.php", function(data) {
          globalLevelList = split(data, ",");
          globalLevelList.splice(-1, 1);
          globalLevelListLoad = false;
          for (let i = 0; i < globalLevelList.length; i += 3) {
            onlineLevels[i / 3] = [globalLevelList[i], globalLevelList[i + 2], globalLevelList[i + 1]];
          }
        });
      } else {
        textSize(height / 8)
        text("Online Levels", width / 2, height / 10)
        drawBack(color(255,255,255,120));
        pages = (onlineLevels.length - onlineLevels.length % 8) / 8 + 1;
        if(onlineLevels[(pages - 1) * 8] == null && onlineLevels[(pages - 1) * 8 - 1] != null){
          pages--;
        }
        let toDisplay = onlineLevels.length - currentPage * 8
        if (toDisplay > 8) {
          toDisplay = 8;
        }
        first = 4;
        second = 4;
        if (first > toDisplay) {
          first = toDisplay;
        }
        if (second + 4 > toDisplay) {
          second = toDisplay - 4;
        }
        for (let i = 0; i < first; i++) {
          fill(255, 255, 255, 120)
          rect(width / 10, height / 4 + height / 15 * i + height / 12 * i, width / 3, height / 8, height / 30);
          textSize(height / 20);
          fill("white")
          text(onlineLevels[currentPage * 8 + i][0], width / 10 + width / 6, height / 4 + height / 15 * i + height / 12 * i + height / 21)
          textSize(height / 30);
          text("By: " + onlineLevels[currentPage * 8 + i][2], width / 10 + width / 6, height / 4 + height / 15 * i + height / 12 * i + height / 10)
        }
        if (second > 0) {
          for (let i = 0; i < second; i++) {
            fill(255, 255, 255, 120)
            rect(width - width / 10 - width / 3, height / 4 + height / 15 * i + 4 + height / 12 * i, width / 3, height / 8, height / 30);
            textSize(height / 20);
            fill("white")
            text(onlineLevels[currentPage * 8 + i + 4][0], width - width / 10 - width / 6, height / 4 + height / 15 * i + height / 12 * i + height / 21)
            textSize(height / 30);
            text("By: " + onlineLevels[currentPage * 8 + i + 4][2], width - width / 10 - width / 6, height / 4 + height / 15 * i + height / 12 * i + height / 10)
          }
        }
        textSize(height / 15)
        if (currentPage != pages - 1) {
          fill(255, 255, 255, 120)
          rect(width - width / 20 - height / 30, height / 2 - height / 30, height / 15, height / 15, height / 50)
          fill("white")
          text(">", width - width / 20, height / 2)
        }
        if (currentPage != 0) {
          fill(255, 255, 255, 120)
          rect(width / 20 - height / 30, height / 2 - height / 30, height / 15, height / 15, height / 50)
          fill("white")
          text("<", width / 20, height / 2)
        }
      }
    }
  } else {
    textSize(80);
    fill("white");
    stroke(0);
    text("Click a button to start", width / 2, height / 2);
  }
}

function keyPressed() {
  if (document.fullscreenElement) {
    keyListenerOthers();
    keyListener0();
    keyListener1();
    keyListener2();
    keyListener3();
    keyListener4();
    keyListener5();
    keyListener6();
    keyListener7();
  }

  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  }
}

function mousePressed() {
  if (document.fullscreenElement) {
    if(mouseButton === LEFT){
    clickListener0();
    clickListener1();
    clickListener2();
    clickListener3();
    clickListener4();
    clickListener5();
    clickListener6();
    clickListener7();
    clickListener8();
    clickListener9();
    transition = false;

    if (gameActive === 0 || gameActive === 6 && seedInInput == 1 || gameActive === 7) {
      if (button(width - width / 10.5, height / 100, width / 11, height / 15)) {
        pause();
      }
    }
  }
}
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  }
}

function jump(force) {
  newJump = force;
  rot = 0.08;
}

function player() {
  if (!upsideDown) {
    y = y + newPos - newJump;

    if (y < groundHeight) {
      newGrav = newGrav + grav;
      newPos = grav + newGrav;
      newJump = newJump - jumpForce;
    } else if (y > groundHeight) {
      newJump = 0;
      newGrav = 0;
      y = groundHeight;
      newPos = 0;
      if (rotat % (PI / 2) < PI / 4) {
        rotat = rotat - (rotat % (PI / 2));
      } else {
        rotat = rotat - (rotat % (PI / 2)) + PI / 2;
      }
      rot = 0;
    }
  } else {
    y = y - newPos + newJump;

    if (y > groundHeight) {
      newGrav = newGrav + grav;
      newPos = grav + newGrav;
      newJump = newJump - jumpForce;
    } else if (y < groundHeight) {
      newJump = 0;
      newGrav = 0;
      y = groundHeight;
      newPos = 0;
      if (rotat % (PI / 2) < PI / 4) {
        rotat = rotat - (rotat % (PI / 2));
      } else {
        rotat = rotat - (rotat % (PI / 2)) + PI / 2;
      }
      rot = 0;
    }
  }
  if (y <= 0 || y + playerSize >= yy + 5) {
    death(gameActive, "ground");
  }
}

function collObject() {
  stroke(0);
  for (let i = 0; i < objects.length; i++) {
    fill("yellow");

    objects[i].x = objects[i].x - triangleSpeed;

    translate(objects[i].x + objectSize / 2, objects[i].y + objectSize / 2);
    rotate(objects[i].z * PI / 2);
    triangle(-objectSize / 2, objectSize / 2, objectSize / 2, objectSize / 2, 0, -objectSize / 2);
    rotate(-objects[i].z * PI / 2);
    translate(-objects[i].x + -objectSize / 2, -objects[i].y + -objectSize / 2);
  }
  if (orbs[0]) {
    for (let i = 0; i < orbs.length; i++) {
      orbs[i].x = orbs[i].x - triangleSpeed;

     
        fill("red");
        rect(orbs[i].x, orbs[i].y, objectSize / 2, objectSize / 2, height / 20);
        //image(BrainCells, orbs[i].x, orbs[i].y, objectSize / 2, objectSize / 2);
    }
  }

  if (gravityOrbs[0]) {
    for (let i = 0; i < gravityOrbs.length; i++) {
      fill("blue");
      gravityOrbs[i].x = gravityOrbs[i].x - triangleSpeed;

      rect(gravityOrbs[i].x, gravityOrbs[i].y, objectSize / 2, objectSize / 2, height / 20);
    }
  }

  stroke(255);
  if (blocks[0]) {
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].x = blocks[i].x - triangleSpeed;
      fill("black");
      rect(blocks[i].x, blocks[i].y, objectSize, objectSize);
    }
  }
  lastObject = lastObject - triangleSpeed;
}

function varReset(editorReset) {
  playerSize = height / 12.000000000000001;
  objectSize = height / 12;

  yx = width;
  yy = height - 3 * objectSize;

  groundHeight = yy - playerSize;

  x = objectSize * 3, y = yy - playerSize
  grav = 0.013 * playerSize;
  newGrav = 0;
  jumpForce = 0.007 * playerSize;
  jumpStrength = 0.31 * playerSize;
  newJump = 0;
  newPos = 0;
  triangleSpeed = 0.28 * playerSize / 2;

  canJumpStart = false;
  spaceJumpStart = false;

  if (editorReset == 0) {
    gameActive = 0;
  } else if (editorReset == 1) {
    gameActive = 6;
    seedInInput = 1;
    progress = -objectSize * 3;
  } else if (editorReset == 2) {
    gameActive = 7;
  } else if (editorReset == 3) {
    gameActive = 5;
    progress = startX * objectSize - objectSize * 3;
    y = yy - startY * objectSize;
  }

  numberObjects = 7;
  points = 0;
  globalNewHighscore = false;
  personalNewHighscore = false;
  newPercentage = false;
  increaseAmount = 0;
  screenTime = 120;
  textTime = 30;
  textYes = true;

  rotat = 0;
  rot = 0;

  backX1 = 0;
  backX2 = height - (height - yy);
  backX3 = (height - (height - yy)) * 2;
  backX4 = (height - (height - yy)) * 3;
  backMove = triangleSpeed / 8;

  for (let p = 0; p < 8; p++) {
    foregroundX[p] = (height - yy) * p - 10;
  }

  orbs.splice(0);
  gravityOrbs.splice(0);
  insideOrb = false;
  canClickOrb = true;
  upsideDown = false;

  blocks.splice(0);

  objects.splice(0);
  vektor.splice(0);
  vektor[0] = 1;
  lastObject = 500;

  if (gameActive === 0) {
    objects[0] = createVector(10 * objectSize, yy - objectSize);
    lastObject = 10 * objectSize
    for (let i = 1; i <= numberObjects; i++) {
      createNewObstacle();
    }
  }

  objectsLoaded = 0;
  objectIndex = 0;
  objectsDeleted = 0;
  loadSingleTime = true;

  toolbarBoxSize = height / 16.8;
}

function createNewObstacle() {
  let type = floor(random(0, obstacles.length));
  let rand = random(objectSize * 6, objectSize * 10);

  splitEndless = split(obstacles[type], ",");

  for (let p = 0; p < splitEndless[0]; p++) {
    createObject(int(splitEndless[p * 4 + 1]), float(splitEndless[p * 4 + 2]) * objectSize + lastObject + rand, yy - float(splitEndless[p * 4 + 3]) * objectSize, int(splitEndless[p * 4 + 4]));
  }
  vektor[vektor.length] = int(splitEndless[0]);
  lastObject = float(splitEndless[splitEndless.length - 3]) * objectSize + lastObject + rand;
}

function createObject(index, PosX, PosY, Rot = 0) {
  if (index === 1) {
    objects[objects.length] = createVector(PosX, PosY, Rot);
  } else if (index === 2) {
    orbs[orbs.length] = createVector(PosX + objectSize / 4, PosY + objectSize / 4, 0);
  } else if (index === 3) {
    blocks[blocks.length] = createVector(PosX, PosY);
  } else {
    gravityOrbs[gravityOrbs.length] = createVector(PosX + objectSize / 4, PosY + objectSize / 4, 0);
  }
}

function collision() {
  var checkObjects = [];
  for (var j = 0; j < objects.length; j++) {
    if (objects[j].x < x + playerSize) {
      checkObjects[checkObjects.length] = createVector(objects[j].x, objects[j].y, objects[j].z);
    }
  }
  var boxes = 10;
  for (var o = 0; o < checkObjects.length; o++) {
    if (checkObjects[o].z === 0) {
      for (var i = 0; i < boxes - 1; i++) {
        if (checkBox(checkObjects[o].x + (i * (objectSize / 2 / boxes)), checkObjects[o].y + objectSize - ((i + 1) * (objectSize / boxes)), objectSize - (i * (objectSize / boxes)), objectSize / boxes)) {
          death(gameActive, "spike");
        }
      }
    } else if (checkObjects[o].z === 2) {
      for (var i = 0; i < boxes - 1; i++) {
        if (checkBox(checkObjects[o].x + (i * (objectSize / 2 / boxes)), checkObjects[o].y + (i * (objectSize / boxes)), objectSize - (i * (objectSize / boxes)), objectSize / boxes)) {
          death(gameActive, "spike");
        }
      }
    } else if (checkObjects[o].z === 1) {
      for (var i = 0; i < boxes- 1; i++) {
        if (checkBox(checkObjects[o].x + (i * (objectSize / boxes)), checkObjects[o].y + (i * (objectSize / 2 / boxes)), objectSize / boxes, objectSize - (i * (objectSize / boxes)))) {
          death(gameActive, "spike");
        }
      }
    } else {
      for (var i = 0; i < boxes- 1; i++) {
        if (checkBox(checkObjects[o].x + objectSize - ((i + 1) * (objectSize / boxes)), checkObjects[o].y + (i * (objectSize / 2 / boxes)), objectSize / boxes, objectSize - (i * (objectSize / boxes)))) {
          death(gameActive, "spike");
        }
      }
    }
  }
  checkObjects.splice(0);

  insideOrb = false;
  var checkOrbs = [];
  for (c = 0; c < orbs.length; c++) {
    if (orbs[c].x < x + playerSize - 5) {
      checkOrbs[checkOrbs.length] = createVector(orbs[c].x, orbs[c].y, orbs[c].z);
    }
  }
  if (checkOrbs[0]) {
    for (v = 0; v < checkOrbs.length; v++) {
      if (insideOrb == false) {
        if (checkBox(checkOrbs[v].x, checkOrbs[v].y, objectSize / 2, objectSize / 2)) {
          insideOrb = true;
        } else {
          insideOrb = false;
        }
      }
    }
  } else {
    insideOrb = false;
  }
  checkOrbs.splice(0);

  insideGravityOrb = false;
  var checkGravityOrbs = [];
  for (b = 0; b < gravityOrbs.length; b++) {
    if (gravityOrbs[b].x < x + playerSize - 5) {
      checkGravityOrbs[checkGravityOrbs.length] = createVector(gravityOrbs[b].x, gravityOrbs[b].y, gravityOrbs[b].z);
    }
  }
  if (checkGravityOrbs[0]) {
    for (n = 0; n < checkGravityOrbs.length; n++) {
      if (insideGravityOrb == false) {
        if (checkBox(checkGravityOrbs[n].x, checkGravityOrbs[n].y, objectSize / 2, objectSize / 2)) {
          insideGravityOrb = true;
        } else {
          insideGravityOrb = false;
        }
      }
    }
  } else {
    insideGravityOrb = false;
  }
  checkGravityOrbs.splice(0);

  var groundHeightEntries = [];
  var checkBlocks = [];
  for (k = 0; k < blocks.length; k++) {
    if (blocks[k].x < x + playerSize - 5 && blocks[k].x + objectSize > x + 5) {
      checkBlocks[checkBlocks.length] = createVector(blocks[k].x, blocks[k].y, blocks[k].z);
    }
  }
  for (l = 0; l < checkBlocks.length; l++) {
    if (!upsideDown) {
      if (checkBox(checkBlocks[l].x + objectSize / 9.95, checkBlocks[l].y + objectSize / 9.95, objectSize - objectSize / 9, objectSize - objectSize / 9) && groundHeight != checkBlocks[l].y - playerSize) {
        death(gameActive, "block");
      } else if (x + playerSize > checkBlocks[l].x + 7 && y + playerSize <= checkBlocks[l].y) {
        groundHeightEntries[groundHeightEntries.length] = checkBlocks[l].y - playerSize;
      } else {
        groundHeightEntries[groundHeightEntries.length] = yy - playerSize;
      }
    } else {
      if (checkBox(checkBlocks[l].x + objectSize / 9.95, checkBlocks[l].y + objectSize / 9.95, objectSize - objectSize / 9, objectSize - objectSize / 9) && groundHeight != checkBlocks[l].y + objectSize) {
        death(gameActive, "block");
      } else if (x + playerSize > checkBlocks[l].x + 7 && y >= checkBlocks[l].y + objectSize) {
        groundHeightEntries[groundHeightEntries.length] = checkBlocks[l].y + objectSize;
      } else {
        groundHeightEntries[groundHeightEntries.length] = 0;
      }
    }
  }
  checkBlocks.splice(0)
  if (!upsideDown && !blocks[0]) {
    groundHeightEntries[groundHeightEntries.length] = yy - playerSize;
  } else if (upsideDown && !blocks[0]) {
    groundHeightEntries[groundHeightEntries.length] = 0;
  }

  var highestGround = 0;
  if (!upsideDown) {
    highestGround = yy - playerSize;
  }
  for (m = 0; m < groundHeightEntries.length; m++) {
    if (!upsideDown) {
      if (groundHeightEntries[m] < highestGround) highestGround = groundHeightEntries[m];
    } else {
      if (groundHeightEntries[m] > highestGround) highestGround = groundHeightEntries[m];
    }
  }
  groundHeightEntries.splice(0);
  groundHeight = highestGround;
}

function checkBox(posX, posY, lX, lY) {
  if (x + playerSize > posX && x < posX + lX && y + playerSize > posY && y < posY + lY) {
    return true;
  } else {
    return false;
  }
}

function button(posX, posY, lX, lY) {
  if (mouseX > posX && mouseX < posX + lX && mouseY > posY && mouseY < posY + lY) {
    return true;
  } else {
    return false;
  }
}

function increaseScore() {
  if (objects[0] && 0 > objects[0].x + objectSize) {
    objects.splice(0, 1);
    vektor[0] = vektor[0] - 1;
    objectsLoaded = objectsLoaded - 1;
    objectsDeleted++;
  }
  if (orbs[0] && 0 > orbs[0].x + 30) {
    orbs.splice(0, 1);
    vektor[0] = vektor[0] - 1;
    objectsLoaded = objectsLoaded - 1;
    objectsDeleted++;
  }
  if (gravityOrbs[0] && 0 > gravityOrbs[0].x + 30) {
    gravityOrbs.splice(0, 1);
    vektor[0] = vektor[0] - 1;
    objectsLoaded = objectsLoaded - 1;
    objectsDeleted++;
  }
  if (blocks[0] && 0 > blocks[0].x + objectSize) {
    blocks.splice(0, 1);
    vektor[0] = vektor[0] - 1;
    objectsLoaded = objectsLoaded - 1;
    objectsDeleted++;
  }
  if (vektor[0] === 0 && gameActive === 0) {
    vektor.splice(0, 1);
    createNewObstacle();
    points++;
  }
}

function death(level, deathcause) {
  oof.setVolume(soundSound);
  oof.play();
  if (level == 0) {
    gameActiveToLoad = 0;
  } else if (level == 6) {
    gameActiveToLoad = 1;
  } else if (level == 7) {
    gameActiveToLoad = 2;
  } else if (level == 5) {
    gameActiveToLoad = 3;
  }
  if (globalNewHighscore) {
    if (personalNewHighscore) {
      gameActive = 3;
      localStorage.setItem("personalHighScore", personalHighScore);
    }
    gameActive = 3;
    $.get("https://vamos.alwaysdata.net/HoehensatzDash/occupied.php", function(data) {
      let oldGlobalHighScore = (data - (data % 10)) / 10;
      if(oldGlobalHighScore < globalHighScore){
        $.ajax({
          type: 'POST',
          url: "https://vamos.alwaysdata.net/HoehensatzDash/write.php",
          data: {
            something: globalHighScore
          }
        });
      }else{
        globalHighScore = oldGlobalHighScore
      }
    });
  } else if (personalNewHighscore) {
    gameActive = 3;
    localStorage.setItem("personalHighScore", personalHighScore);
  } else if (newPercentage) {
    gameActive = 3;
  } else {
    gameActive = 1;
  }
}

function orbJump(force) {
  whu.setVolume(soundSound);
  whu.play();
  newJump = 0;
  newGrav = 0;
  newPos = 0;
  jump(force);
}

function changeGravity() {
  waschmaschine.setVolume(soundSound);
  waschmaschine.play();
  newJump = 0;
  newGrav = playerSize / 8;
  newPos = 0;
  if (!upsideDown) {
    groundHeight = 0;
  } else {
    groundHeight = yy - playerSize;
  }
  upsideDown = !upsideDown;
}

function Background(what, backgroundMoving, foreskinMoving) {
  if (what == 1 || what == 3) {
    backX1 = backX1 - backgroundMoving;
    backX2 = backX2 - backgroundMoving;
    backX3 = backX3 - backgroundMoving;
    backX4 = backX4 - backgroundMoving;
    image(dev1, backX1, 0, height - (height - yy), height - (height - yy));
    image(dev2, backX2, 0, height - (height - yy), height - (height - yy));
    image(dev3, backX3, 0, height - (height - yy), height - (height - yy));
    image(dev2, backX4, 0, height - (height - yy), height - (height - yy));
      stroke(255)
      fill(0, 26, 255, 100);
      rect(0, 0, width, yy);
  
  }
  if (what == 2 || what == 3) {
    if (backX1 + height - (height - yy) < 0) {
      backX1 = (height - (height - yy)) * 3 - 3
    }
    if (backX2 + height - (height - yy) < 0) {
      backX2 = (height - (height - yy)) * 3 - 3
    }
    if (backX3 + height - (height - yy) < 0) {
      backX3 = (height - (height - yy)) * 3 - 3
    }
    if (backX4 + height - (height - yy) < 0) {
      backX4 = (height - (height - yy)) * 3 - 3
    }
    for (let p = 0; p < 8; p++) {
      foregroundX[p] = foregroundX[p] - foreskinMoving

      if (foregroundX[p] + (height - yy) < 0) {
        foregroundX[p] = (height - yy) * 7 - 20
      }
      image(grass, foregroundX[p], yy, height - yy + 10, height - yy)
    }
      fill(0, 0, 255, 150);
      rect(0, yy, width, height - yy)
    
  }


}


function windowResized() {
  cnvX = (windowWidth - width) / 2;
  cnvY = (windowHeight - height) / 2;
  cnv.position(0, 0);
  resizeCanvas(windowWidth, windowHeight);
  if (gameActive === 4) {
    musicSlider.position(width / 6, height / 1.8);
    musicSlider.size(width / 5);
    soundSlider.position(width - width / 6 - width / 5, height / 1.8);
    soundSlider.size(width / 5);
  } else if (gameActive === 6 && seedInInput == 0) {
    seedInput.position(width / 2 - width / 6, height / 2 + height / 40);
    seedInput.size(width / 3, height / 20)
  } else if (gameActive == 5 && !editorLoadScreen && !saveLevel) {
    editorSlider.position(width / 4, height - height / 20);
  } else if (gameActive === 5 && saveLevel) {
    saveNameInp.position(width / 2 - width / 6, height / 2 + height / 40)
    saveNameInp.size(width / 3, height / 20)
  }
}

function gamePlay() {
  if (newGrav != 0) {
    rot = 0.09
  }
  Background(1, backMove, triangleSpeed);
  strokeWeight(height / 500);
  translate(x + playerSize / 2, y + playerSize / 2);
  rotat = rotat + rot;
  rotate(rotat);
  image(img, 0 - playerSize / 2, 0 - playerSize / 2, playerSize, playerSize);
  rotate(-rotat)
  translate(-x - playerSize / 2, -y - playerSize / 2);
  increaseScore();
  collObject();
  Background(2, backMove, triangleSpeed);
  collision();
  player();

  if (keyIsDown(32)) {
    if (!upsideDown) {
      if (y >= groundHeight && spaceJumpStart) {
        jump(jumpStrength);
        canClickOrb = false;
      } else if (insideOrb && canClickOrb === true) {
        canClickOrb = false;
        orbJump(jumpStrength - jumpStrength / 9);
      }
      if (insideGravityOrb && canClickOrb === true) {
        canClickOrb = false;
        changeGravity();
      }
    } else {
      if (y <= groundHeight && spaceJumpStart) {
        jump(jumpStrength);
        canClickOrb = false;
      } else if (insideOrb && canClickOrb === true) {
        orbJump(jumpStrength - jumpStrength / 9);
        canClickOrb = false;
      } else if (insideGravityOrb && canClickOrb === true) {
        changeGravity();
        canClickOrb = false;
      }
    }

  } else if (!mouseIsPressed&&mouseButton === LEFT) {
    canClickOrb = true;
  }
  if (mouseIsPressed&&mouseButton === LEFT) {
    if (!upsideDown) {
      if (y >= groundHeight && canJumpStart) {
        jump(jumpStrength);
        canClickOrb = false;
      } else if (insideOrb && canClickOrb === true) {
        canClickOrb = false;
        orbJump(jumpStrength - jumpStrength / 9);
      }
      if (insideGravityOrb && canClickOrb === true) {
        canClickOrb = false;
        changeGravity();
      }
    } else {
      if (y <= groundHeight && canJumpStart) {
        jump(jumpStrength);
        canClickOrb = false;
      } else if (insideOrb && canClickOrb === true) {
        orbJump(jumpStrength - jumpStrength / 9);
        canClickOrb = false;
      } else if (insideGravityOrb && canClickOrb === true) {
        changeGravity();
        canClickOrb = false;
      }
    }
  } else if (!keyIsDown(32)) {
    canClickOrb = true;
  }
  if (!mouseIsPressed && !canJumpStart&&mouseButton === LEFT) {
    canJumpStart = true;
  }
  if (!keyIsDown(32) && !spaceJumpStart) {
    spaceJumpStart = true;
  }

  stroke(0);
  if (gameActive != 5) {
    strokeWeight(height / 500);
    fill("white")
    rect(width - width / 10.5, height / 100, width / 11, height / 15, height / 40);
    fill("black");
    textSize(height / 20);
    text("Pause", width - width / 10.5 + width / 22, height / 100 + height / 30);
  }
  fill("white");
  textSize(height / 25);
  text(floor(attempts), width / 10, height / 15);
  textSize(height / 30);
  text("Attempts", width / 10, height / 40);
}

function levelEditor() {
  if(!testLevel && !editorLoadScreen){
    Background(3, 0, 0);
  toolbar();
}
  strokeWeight(height / 500);
  drawEditorObjects();
}

function toolbar() {
  strokeWeight(height / 500)
  fill("green");
  rect(0, height - height / 12, width, height / 12);
  for (let i = 0; i < toolbarBoxes; i++) {
    fill("#62bce5");
    rect(height / 100 * i + i * toolbarBoxSize + height / 100, height - height / 12 + height / 100, toolbarBoxSize, toolbarBoxSize);
  }
  rect(width - height / 14, height - height / 14, toolbarBoxSize, toolbarBoxSize)
  image(moveIcon, width - height / 15.6, height - height / 15.6, toolbarBoxSize - toolbarBoxSize / 4, toolbarBoxSize - toolbarBoxSize / 4)
  rect(width - height / 14 - height / 100 - toolbarBoxSize, height - height / 14, toolbarBoxSize, toolbarBoxSize)
  image(trashCan, width - height / 15.6 - height / 100 - toolbarBoxSize, height - height / 15.6, toolbarBoxSize - toolbarBoxSize / 4, toolbarBoxSize - toolbarBoxSize / 4)
  fill("yellow")
  triangle(height / 100 * 2, height - height / 12 + toolbarBoxSize, height / 100 + toolbarBoxSize / 2, height - height / 12 + height / 100 * 2, toolbarBoxSize, height - height / 12 + toolbarBoxSize);

    fill("red")
    strokeWeight(0);
    rect(height / 100 + toolbarBoxSize + height / 46, height - height / 12 + height / 46, toolbarBoxSize - toolbarBoxSize / 2.6666, toolbarBoxSize - toolbarBoxSize / 2.6666, height / 20)
  fill("black");
  stroke("white")
  rect(height / 100 * 2 + 2 * toolbarBoxSize + height / 56, height - height / 12 + height / 56, toolbarBoxSize - toolbarBoxSize / 4, toolbarBoxSize - toolbarBoxSize / 4)
  noStroke();
  fill("blue")
  rect(height / 100 * 3 + 3 * toolbarBoxSize + height / 46, height - height / 12 + height / 46, toolbarBoxSize - toolbarBoxSize / 2.6666, toolbarBoxSize - toolbarBoxSize / 2.6666, height / 20)
}

function userLevel() {
  if (seedInInput == 1) {
    increaseScore();

    /*if (!mouseIsPressed && !canJumpStart) {
      canJumpStart = true;
    }*/
    progress = progress + triangleSpeed;
    percentage = floor((progress + objectSize * 3) * 100 / (int(splitLevel[splitLevel.length - 3] * objectSize) + objectSize * 5));
    percentageText = percentage + "%"
    /*if (percentageText == "NaN%") {
      lamnbrah = true;
      seedInInput = 0;
      seedInput = createInput();
      seedInput.position(width / 2 - width / 6, height / 2 + height / 40);
      seedInput.size(width / 3, height / 20)
    }*/
    gamePlay();
    fill("white");
    textSize(height / 15);
    text(percentage + "%", width / 2, height / 10);
    if (percentage >= 100) {
      gameActive = 3;
      won = true;
    }

    /*if (int(splitLevel[0]) - objectsDeleted < 90) {
      amnOfObjectsLevel = int(splitLevel[0]) - objectsDeleted;
    } else {
      amnOfObjectsLevel = 90;
    }*/

    while (float(splitLevel[objectIndex * 4 + 2]) * objectSize - progress < width) {
      createObject(int(splitLevel[objectIndex * 4 + 1]), float(splitLevel[objectIndex * 4 + 2]) * objectSize - progress, yy - float(splitLevel[objectIndex * 4 + 3]) * objectSize, int(splitLevel[objectIndex * 4 + 4]));
      objectIndex = objectIndex + 1;
      objectsLoaded = objectsLoaded + 1;
    }

    /*if (loadSingleTime) {
      var checkingBlocks = [];
      var highest = yy;
      for (k = 0; k < blocks.length; k++) {
        if (blocks[k].x < x + 75) {
          checkingBlocks[checkingBlocks.length] = createVector(blocks[k].x, blocks[k].y, blocks[k].z);
        }
      }
      for (h = 0; h < checkingBlocks.length; h++) {
        if (checkingBlocks[h].y < 400) {
          highest = checkingBlocks[h].y;
        }
      }
      groundHeight = highest;
      y = groundHeight - playerSize;
      loadSingleTime = false;
      console.log(groundHeight);
    }*/

    textSize(height / 25);
    text(floor(percentageHighScore) + "%", width / 10, height / 7);
    textSize(height / 30);
    text("Highscore", width / 10, height / 10);
  } else if (seedInInput == 0) {
    /*background(120);
    fill("white");
    strokeWeight(height / 166);
    textSize(height / 12);
    text("Type in your Levelkey", width / 2, height / 12);
    rect(width / 2 - width / 10, height / 1.2, width / 5, height / 10)
    textSize(height / 15);
    text("Continue", width / 2, height / 1.2 + height / 20);
    drawBack()
    if (lamnbrah) {
      fill("red");
      text("Put in a LevelKey you fuQ", width / 2, height / 1.5);
    }*/
  }
}

function keyListener0() {}

function keyListener1() {
  if (gameActive === 1) {
    varReset(gameActiveToLoad);
    attempts++;
    //canJumpStart = false;
    //spaceJumpStart = false;
  }
}

function keyListener2() {}

function keyListener3() {}

function keyListener4() {
  if (gameActive === 4) {
    if (keyCode === 32) {
      gameActive = lastGameActive;
      canJumpStart = false;
      spaceJumpStart = false;
      musicSlider.remove();
      soundSlider.remove();
    }
  }
}

function keyListener5() {
  if (gameActive === 5) {
    if (output && !editorLoadScreen && !testLevel) {
      if (keyCode == 8) {
        for (let i = 0; i < editorObjects.length; i++) {
          if (button(editorObjects[i][0] * objectSize - editorSlider.value(), yy - objectSize * editorObjects[i][1], objectSize, objectSize)) {
            editorObjects.splice(i, 1);
            numbEditorObjects--;
          }
        }
      } else if (keyCode == 39) moveValueX = moveValueX + objectSize / 10;
      else if (keyCode == 37) moveValueX = moveValueX - objectSize / 10;
      else if (keyCode == 40) moveValueY = moveValueY + objectSize / 10;
      else if (keyCode == 38) moveValueY = moveValueY - objectSize / 10;
      if (keyCode == 82 && selector == 2 || keyCode == 82 && selector == 3) {
        editorRotate = (editorRotate + 1) % 4;
      }
    }
    if(editorLoadScreen){
      if(keyCode == 72){
        window.open("rsc/docs/editor_guide.pdf");
      }
    }
  }
}

function keyListener6() {
  /*if (gameActive === 6) {
    if (keyCode === 13 && seedInInput == 0) {
      if (seedInput.value() == "") {
        lamnbrah = true
      } else {
        seedInInput = 1;
        customLevel = seedInput.value()
        splitLevel = split(customLevel, ",");
        seedInput.remove();
        lamnbrah = false;
        varReset(1);
      }
    }
  }*/
}

function keyListener7() {}

function keyListenerOthers() {
  if (keyCode == 65) {
    if (inderPic) {
      var list = document.getElementsByTagName("HTML")[0];
      list.getElementsByTagName("BODY")[0].style = "";
      inderPic = false;
    } else if (!inderPic) {
      var list = document.getElementsByTagName("HTML")[0];
      list.getElementsByTagName("BODY")[0].style = "background-image: url('rsc/images/yes.png');";
      inderPic = true
    }
  }
}

function clickListener0() {}

function clickListener1() {
  if (gameActive === 1) {
    attempts++;
    varReset(gameActiveToLoad);
    //canJumpStart = false;
    //spaceJumpStart = false;
  }
}

function clickListener2() {
  if (gameActive === 2) {
    if (button(width / 10, height / 5, width / 3, height / 5)) {
      gameActive = 8;
      transition = true;
    } else if (button(width / 10, height / 1.75, width / 3, height / 5)) {
      gameActive = 0;
      varReset(0);
      //canJumpStart = false;
      //spaceJumpStart = false;
    } else if (button(width - width / 10 - width / 3, height / 5, width / 3, height / 5)) {
      output = true;
      gameActive = 5;
      editorLoadScreen = true;
      let ownLevelssplitnt = localStorage.getItem("ownerLevels");
      if (ownLevelssplitnt != "") {
        ownLevels = split(ownLevelssplitnt, ",");
      }
      ownLevels.splice(-1, 1)
      testLevel = false;
      selector = false;
      startPos = false;
      transition = true;
      currentPage = 0;
      /*mapEditorInput = createInput();
      mapEditorInput.position(width / 2 - width / 6, height / 2 + height / 40)
      mapEditorInput.size(width / 3, height / 20)*/
    } else if (button(width - width / 10 - width / 3, height / 1.75, width / 3, height / 5)) {
      /*gameActive = 6;
      seedInInput = 0;
      seedInput = createInput();
      seedInput.position(width / 2 - width / 6, height / 2 + height / 40);
      seedInput.size(width / 3, height / 20)*/
      gameActive = 9;
      currentPage = 0;
      heftig = false
      globalLevelListLoad = true
      currentPage = 0;
      transition = true;
    } else if(button(width - width / 100 - width / 5, height - height / 17.5 - height / 7, width / 5, height / 7)){
      window.open("https://discord.gg/8XBU3BD");
    }
  }
}

function clickListener3() {}

function clickListener4() {
  if (gameActive === 4) {
    if (button(width / 10, height / 1.5, width / 3, height / 5)) {
      varReset(0);
      gameActive = 2;
      attempts = 1;
      percentageHighScore = 0;
      musicSlider.remove();
      soundSlider.remove();
    } else if (button(width - width / 10 - width / 3, height / 1.5, width / 3, height / 5)) {
      gameActive = lastGameActive;
      //canJumpStart = false;
      //spaceJumpStart = false;
      musicSlider.remove();
      soundSlider.remove();
      if (gameActive == 5 && output) {
        createEditorSlider()
      }
    }
  }
}

function clickListener5() {
  if (gameActive === 5) {
    if (output && !editorLoadScreen && !testLevel && !startPos) {
      if (selector == 1) {
        let found = false;
        for (let i = 0; i < editorObjects.length; i++) {
          if (button(editorObjects[i][0] * objectSize - editorSlider.value(), yy - objectSize * editorObjects[i][1], objectSize, objectSize)) {
            editorObjects[i][2] = 1;
            found = true;
            break;
          }
        }
        if (found) {
          selector = 2;
        } else {
          selector = 0;
        }
      } else {
        if (button(width - width / 10.5, height / 100, width / 11, height / 15) && selector != 2) {
          pause();
          editorSliderValue = editorSlider.value();
          editorSlider.remove();
          selector = 0;
        } else if (button(width / 150, height / 100, width / 8, height / 15) && selector != 2) {
          createKey();
          selector = 0;
          lamnbrah = false;
        } else if (button(width - height / 14, height - height / 14, toolbarBoxSize, toolbarBoxSize) && numbEditorObjects != 0 && editorObjects[editorObjects.length - 1][2] != 1) {
          selector = 1;
          moveValueX = 0;
          moveValueY = 0;
        } else if (button(width / 150, height / 5, toolbarBoxSize, toolbarBoxSize) && selector != 2) {
          selector = 0;
          moveValueX = 0;
          moveValueY = 0;
        } else {
          clicked = true
          for (let g = 0; g < 4; g++) {
            if (button(height / 100 * g + g * toolbarBoxSize + height / 100, height - height / 12 + height / 100, toolbarBoxSize, toolbarBoxSize)) {
              // [x, y, if selected, index, rotation]
              selector = g + 3;
              clicked = false
              moveValueX = 0;
              moveValueY = 0;
            }
          }
          if (selector != 0 && clicked && selector != 2 && mouseY < yy) {
            editorObjects[editorObjects.length] = [round((mouseX - (mouseX % objectSize) + editorSlider.value() + moveValueX) / objectSize, 1), round((yy - (mouseY - (mouseY % objectSize) + moveValueY)) / objectSize, 1), 0, selector - 2,
              editorRotate
            ];
            numbEditorObjects++;
            if (editorObjects[editorObjects.length - 1][0] > editorLastObject) {
              editorLastObject = editorObjects[editorObjects.length - 1][0];
              editorSliderValue = editorSlider.value();
              editorSlider.remove();
              createEditorSlider()
            }
          }
          if (selector == 2) {
            for (let i = 0; i < numbEditorObjects; i++) {
              if (editorObjects[i][2] == 1) {
                if (mouseY < yy) {
                  editorObjects[i][0] = round((mouseX - (mouseX % objectSize) + editorSlider.value() + moveValueX) / objectSize, 1);
                  editorObjects[i][1] = round((yy - (mouseY - (mouseY % objectSize) + moveValueY)) / objectSize, 1);
                  editorObjects[i][2] = 0;
                  editorObjects[i][4] = editorRotate;

                  if (editorObjects[i][0] > editorLastObject) {
                    editorLastObject = editorObjects[i][0];
                    editorSliderValue = editorSlider.value();
                    editorSlider.remove();
                    createEditorSlider()
                  }
                  moveValueX = 0;
                  moveValueY = 0;
                  selector = 0;
                } else if (button(width - height / 14 - height / 100 - toolbarBoxSize, height - height / 14, toolbarBoxSize, toolbarBoxSize)) {
                  editorObjects.splice(i, 1);
                  numbEditorObjects--;
                  moveValueX = 0;
                  moveValueY = 0;
                }
              }
            }
          }
        }
      }
    } else if (editorLoadScreen) {
      if (!transition) {
        if (button(width - width / 150 - width / 8, height / 100, width / 8, height / 13)) {
          loadEditorLevel("", 0, "");
        }
        if (button(width / 150, height / 100, width / 8, height / 13)) {
          gameActive = 2;
          //mapEditorInput.remove();
        }
        if (button(width - width / 20 - height / 30, height / 2 - height / 30, height / 15, height / 15) && currentPage != pages - 1) {
          currentPage++;
        }
        if (button(width / 20 - height / 30, height / 2 - height / 30, height / 15, height / 15) && currentPage != 0) {
          currentPage--;
        }
        for (let i = 0; i < first; i++) {
          if (button(width / 10, height / 4 + height / 15 * i + height / 12 * i, width / 3, height / 8)) {
            loadEditorLevel(localStorage.getItem(ownLevels[currentPage * 16 + i * 2 + 1]), ownLevels[currentPage * 16 + i * 2 + 1], ownLevels[currentPage * 16 + i * 2]);
          }
        }
        if (second > 0) {
          for (let i = 0; i < second; i++) {
            if (button(width - width / 10 - width / 3, height / 4 + height / 15 * i + 4 + height / 12 * i, width / 3, height / 8)) {
              loadEditorLevel(localStorage.getItem(ownLevels[currentPage * 16 + i * 2 + 1 + 8]), ownLevels[currentPage * 16 + i * 2 + 1 + 8], ownLevels[currentPage * 16 + i * 2 + 8]);
            }
          }
        }
      }
    }
    /*for (let i = 0; i < ownLevels.length / 2; i++) {
      if (button(width / 10, height / 4 + height / 15 * i + height / 12 * i, width / 3, height / 8)) {
        loadEditorLevel(localStorage.getItem(ownLevels[i * 2 + 1]), ownLevels[i * 2 + 1], ownLevels[i * 2]);
      }*/
    else if (!output && !uploadLevel && !startPos && !saveLevel) {
      if (button(width / 150, height / 100, width / 8, height / 13)) {
        output = true;
        //inp.remove();
        createEditorSlider()
        selector = false;
        lamnbrah = false;
      } else if (button(width / 2 - width / 10, height / 6 + width / 12, width / 5, height / 10)) {
        if (levelSeed == "") {
          lamnbrah = true;
        } else {
          output = true;
          startPos = true;
          selector = 0;
          splitLevel = split(levelSeed, ",");
          //inp.remove();
          lamnbrah = false;
          createEditorSlider()
          varReset(3);
        }
      } else if (button(width / 2 - width / 10, height / 6 * 3 + width / 12, width / 5, height / 10)) {
        if (levelSeed == "") {
          lamnbrah = true;
        } else {
          uploadLevel = true
          newLevelListLoad = true
          nameInp = createInput()
          if (ownLevelName != "") {
            nameInp.value(ownLevelName);
          }
          userInp = createInput()
          //inp.remove();
          userInp.value(username)
        }
      } else if (button(width / 2 - width / 10, height / 6 * 2 + width / 12, width / 5, height / 10)) {
        if (levelSeed == "") {
          lamnbrah = true;
        } else {
          saveLevel = true;
          saveNameInp = createInput();
          if (ownLevelName != "") {
            saveNameInp.value(ownLevelName);
          }
          saveNameInp.position(width / 2 - width / 6, height / 2 + height / 40)
          saveNameInp.size(width / 3, height / 20)
        }
      }
    } else if (startPos) {
      if (mouseY < yy) {
        startX = round((editorSlider.value() + (mouseX - mouseX % objectSize)) / objectSize)
        startY = round((yy - (mouseY - mouseY % objectSize)) / objectSize);
        startPos = false;
        testLevel = true;
        editorSlider.remove();
        //canJumpStart = false;
        //spaceJumpStart = false;
        varReset(3);
      }
    } else if (saveLevel) {
      if (button(width / 2 - width / 10, height / 3 * 2 - height / 20, width / 5, height / 10)) {
        if (saveNameInp.value() != "") {
          let oldStorage = localStorage.getItem("ownerLevels");
          let randomLevelId
          if (ownLoadedId == 0) {
            randomLevelId = floor(random(0, 1000000000000))
            ownLoadedId = randomLevelId;
            localStorage.setItem("ownerLevels", oldStorage + saveNameInp.value() + "," + randomLevelId + ",");
          } else {
            randomLevelId = ownLoadedId
            let storageDat = split(oldStorage, ",");
            oldStorage = "";
            storageDat.splice(-1, 1);
            for (let i = 0; i < storageDat.length; i += 2) {
              if (storageDat[i + 1] == randomLevelId) {
                storageDat[i] = saveNameInp.value();
              }
              oldStorage = oldStorage + storageDat[i] + "," + storageDat[i + 1] + ",";
            }
            let oldBobsStorage = oldStorage
            localStorage.setItem("ownerLevels", oldBobsStorage);
          }
          localStorage.setItem(randomLevelId.toString(), levelSeed)
          saveLevel = false
          saveNameInp.remove();
          output = true
          createEditorSlider();
          saveNameFill = false;
          ownLevelName = saveNameInp.value();
        } else {
          saveNameFill = true;
        }
      } else if (button(width / 150, height / 100, width / 8, height / 13)) {
        saveLevel = false;
        saveNameInp.remove();
        lamnbrah = false
        saveNameFill = false
      }
    } else if (!output && uploadLevel) {
      if (button(width / 2 - width / 10, height - height / 7, width / 5, height / 10) && nameInp.value() != "" && userInp.value() != "" && nameInp.value().length <= 25 && userInp.value().length <= 25) {
        newLevelList = "" //if (nameInp.value() != "") {
        for (let i = 0; i < getLevelList.length; i++) {
          newLevelList = newLevelList + getLevelList[i] + ",";
          //console.log(newLevelList);
        }
        let newlevel = levelSeed + ",";
        let levelId = floor(random(0, 1000000000000));
        newLevelList = newLevelList + nameInp.value() + "," + userInp.value() + "," + levelId + ",";
        levelData[0] = newLevelList;
        levelData[1] = levelId + ".txt";
        levelData[2] = newlevel.toString();
        levelData[3] = "<?php header('Access-Control-Allow-Origin: *');echo readfile('" + levelId + ".txt'); ?>";
        levelData[4] = levelId + ".php"
        $.ajax({
          type: 'POST',
          url: "https://vamos.alwaysdata.net/HoehensatzDash/writeLevelList.php",
          data: {
            something: levelData
          }
        });
        uploadLevel = false;
        output = true;
        localStorage.setItem("username", userInp.value());
        nameInp.remove();
        userInp.remove();
        createEditorSlider();

        //newLevelListLoad = fals;
      } else if (button(width / 150, height / 100, width / 8, height / 13)) {
        uploadLevel = false;
        //inp = createInput(levelSeed);
        nameInp.remove();
        userInp.remove();
        lamnbrah = false;
        //}
      }

    } else {
      if (button(width - width / 10.5, height / 100, width / 11, height / 15) && testLevel) {
        testLevel = false;
        createEditorSlider()
      }
    }
  }
}

function clickListener6() {
  if (gameActive === 6) {
    if (seedInInput == 0) {
      if (button(width / 2 - width / 10, height / 1.2, width / 5, height / 10)) {
        if (seedInput.value() == "") {
          lamnbrah = true
        } else {
          seedInInput = 1;
          customLevel = seedInput.value()
          splitLevel = split(customLevel, ",");
          seedInput.remove();
          lamnbrah = false;
          //canJumpStart = false;
          //spaceJumpStart = false;
          varReset(1);
        }
      } else if (button(width / 150, height / 100, width / 8, height / 13)) {
        fill("white");
        gameActive = 2;
        seedInput.remove();
        lamnbrah = false;
      }
    }
  }
}

function clickListener7() {}

function clickListener8() {
  if (gameActive === 8) {
    if (transition == false) {
      if (button(width / 10, height / 5, width / 3, height / 5)) {
        varReset(2);
      } else if (button(width / 10, height / 1.75, width / 3, height / 5)) {
        customLevel = level1[0];
        splitLevel = split(customLevel, ",");
        varReset(1);
      } else if (button(width - width / 10 - width / 3, height / 5, width / 3, height / 5)) {
        customLevel = level2[0];
        splitLevel = split(customLevel, ",");
        varReset(1);
      } else if (button(width - width / 10 - width / 3, height / 1.75, width / 3, height / 5)) {
        customLevel = level3[0];
        splitLevel = split(customLevel, ",");
        varReset(1);
      } else if (button(width / 150, height / 100, width / 8, height / 13)) {
        gameActive = 2;
      }
    }
  }
}

function clickListener9() {
  if (gameActive === 9) {
    if (!transition) {
      for (let i = 0; i < first; i++) {
        if (button(width / 10, height / 4 + height / 15 * i + height / 12 * i, width / 3, height / 8)) {
          $.get("https://vamos.alwaysdata.net/HoehensatzDash/" + onlineLevels[currentPage * 8 + i][1] + ".php", function(data) {
            customLevel = data;
            heftig = true
          });
        }
      }
      if (second > 0) {
        for (let i = 0; i < second; i++) {
          if (button(width - width / 10 - width / 3, height / 4 + height / 15 * i + 4 + height / 12 * i, width / 3, height / 8)) {
            $.get("https://vamos.alwaysdata.net/HoehensatzDash/" + onlineLevels[currentPage * 8 + i + 4][1] + ".php", function(data) {
              customLevel = data;
              heftig = true
            });
          }
        }
      }
      if (button(width / 150, height / 100, width / 8, height / 13)) {
        gameActive = 2;
      }
      if (currentPage != pages - 1) {
        if (button(width - width / 20 - height / 30, height / 2 - height / 30, height / 15, height / 15)) {
          currentPage++;
        }
      }
      if (currentPage != 0) {
        if (button(width / 20 - height / 30, height / 2 - height / 30, height / 15, height / 15)) {
          currentPage--;
        }
      }
    }
  }
}

function drawEditorObjects() {
  if (!testLevel && !editorLoadScreen) {
    if (selector != 0 && selector != 1) {
      let xPos = mouseX - (mouseX % objectSize) + moveValueX;
      let yPos = mouseY - (mouseY % objectSize) + moveValueY;
      if (selector == 3) {
        fill(255, 255, 0, 120);
        translate(xPos + objectSize / 2, yPos + objectSize / 2);
        rotate(editorRotate * PI / 2);
        triangle(-objectSize / 2, objectSize / 2, 0, -objectSize / 2, objectSize / 2, objectSize / 2);
        rotate(-editorRotate * PI / 2);
        translate(-xPos + -objectSize / 2, -yPos + -objectSize / 2);
      } else if (selector == 4) {
       
          fill(255, 0, 0, 120);
          rect(xPos + objectSize / 4, yPos + objectSize / 4, objectSize / 2, objectSize / 2, height / 20);
        
      } else if (selector == 5) {
        fill(0, 0, 0, 120)
        rect(xPos, yPos, objectSize, objectSize)
      } else if (selector == 6) {
        fill(0, 0, 255, 120);
        rect(xPos + objectSize / 4, yPos + objectSize / 4, objectSize / 2, objectSize / 2, height / 20);
      }
    }
    for (let i = 0; i < numbEditorObjects; i++) {
      if (editorObjects[i][2] == 1) {
        editorObjects[i][0] = mouseX - (mouseX % objectSize) + moveValueX;
        editorObjects[i][1] = mouseY - (mouseY % objectSize) + moveValueY;
        if (editorObjects[i][3] == 1) {
          fill(255, 255, 0, 120);
          translate(editorObjects[i][0] + objectSize / 2, editorObjects[i][1] + objectSize / 2);
          rotate(editorRotate * PI / 2);
          triangle(-objectSize / 2, objectSize / 2, 0, -objectSize / 2, objectSize / 2, objectSize / 2);
          rotate(-editorRotate * PI / 2);
          translate(-editorObjects[i][0] + -objectSize / 2, -editorObjects[i][1] + -objectSize / 2);
        } else if (editorObjects[i][3] == 2) {
            fill(255, 0, 0, 120);
            rect(editorObjects[i][0] + objectSize / 4, editorObjects[i][1] + objectSize / 4, objectSize / 2, objectSize / 2, height / 20);
          
        } else if (editorObjects[i][3] == 3) {
          fill(0, 0, 0, 120)
          rect(editorObjects[i][0], editorObjects[i][1], objectSize, objectSize)
        } else if (editorObjects[i][3] == 4) {
          fill(0, 0, 255, 120);
          rect(editorObjects[i][0] + objectSize / 4, editorObjects[i][1] + objectSize / 4, objectSize / 2, objectSize / 2, height / 20);
        }
      } else if (editorObjects[i][0] * objectSize >= editorSlider.value() && editorObjects[i][0] * objectSize <= editorSlider.value() + width) {
        if (editorObjects[i][3] == 1) {
          fill(255, 255, 0);
          translate(editorObjects[i][0] * objectSize + objectSize / 2 - editorSlider.value(), yy - editorObjects[i][1] * objectSize + objectSize / 2);
          rotate(editorObjects[i][4] * PI / 2);
          triangle(-objectSize / 2, objectSize / 2, 0, -objectSize / 2, objectSize / 2, objectSize / 2);
          rotate(-editorObjects[i][4] * PI / 2);
          translate(-editorObjects[i][0] * objectSize + -objectSize / 2 + editorSlider.value(), -(yy - editorObjects[i][1] * objectSize) + -objectSize / 2);
        } else if (editorObjects[i][3] == 2) {
    
            fill(255, 0, 0);
            rect(editorObjects[i][0] * objectSize + objectSize / 4 - editorSlider.value(), yy - editorObjects[i][1] * objectSize + objectSize / 4, objectSize / 2, objectSize / 2, height / 20);
      
        } else if (editorObjects[i][3] == 3) {
          fill(0, 0, 0)
          rect(editorObjects[i][0] * objectSize - editorSlider.value(), yy - editorObjects[i][1] * objectSize, objectSize, objectSize)
        } else if (editorObjects[i][3] == 4) {
          fill(0, 0, 255);
          rect(editorObjects[i][0] * objectSize + objectSize / 4 - editorSlider.value(), yy - editorObjects[i][1] * objectSize + objectSize / 4, objectSize / 2, objectSize / 2, height / 20);
        }
      }
    }
    if (startPos) {
      fill(255, 255, 255, 120);
      rect(mouseX - mouseX % objectSize, mouseY - mouseY % objectSize, objectSize, objectSize);
      fill("white");
      stroke(255);
      textSize(height / 12);
      text("Choose a Startposition", width / 2, height / 10);
    }
    stroke(0);
    strokeWeight(height / 500);
    fill("white")
    rect(width - width / 10.5, height / 100, width / 11, height / 15, height / 40);
    rect(width / 150, height / 100, width / 8, height / 15, height / 40);
    fill("black");
    textSize(height / 20);
    text("Pause", width - width / 10.5 + width / 22, height / 100 + height / 30);
    text("Settings", width / 150 + width / 16, height / 100 + height / 30);
    if (selector == 1) {
      fill("white");
      textSize(height / 12);
      text("Select a object to edit", width / 2, height / 10)
    }
    fill("#62bce5");
    stroke(255);
    rect(width / 150, height / 5, toolbarBoxSize, toolbarBoxSize);
    fill("white");
    stroke(0);
    textSize(height / 50);
    text("De-", width / 150 + toolbarBoxSize / 2, height / 5 + toolbarBoxSize / 4);
    text("select", width / 150 + toolbarBoxSize / 2, height / 5 + toolbarBoxSize / 4 * 3);
  }
  if (editorLoadScreen) {
    //background(120);
    image(makerBg, 0, 0, width, height);
    fill("white");
    strokeWeight(height / 166);
    stroke(0)
    textSize(height / 12);
    text("Your Levels", width / 2, height / 10);
    stroke(0)
    strokeWeight(height / 166);
    fill(255, 255, 255, 120)
    rect(width - width / 150 - width / 8, height / 100, width / 8, height / 13, height / 40);
    strokeWeight(height / 250);
    textSize(height / 25);
    fill("white")
    text("New Level", width - width / 150 - width / 8 + width / 16, height / 100 + height / 26);
    textSize(height / 25)
    text('Press "H" to open the editor guide.', width / 2, height - height / 20)
    pages = (ownLevels.length / 2 - ownLevels.length / 2 % 8) / 8 + 1;
    if(ownLevels[(pages - 1) * 16] == null && ownLevels[(pages - 1) * 16 - 1] != null){
      pages--;
    }
    let toDisplay = ownLevels.length / 2 - currentPage * 8
    if (toDisplay > 8) {
      toDisplay = 8;
    }
    first = 4;
    second = 4;
    if (first > toDisplay) {
      first = toDisplay;
    }
    if (second + 4 > toDisplay) {
      second = toDisplay - 4;
    }
    for (let i = 0; i < first; i++) {
      fill(255, 255, 255, 120)
      rect(width / 10, height / 4 + height / 15 * i + height / 12 * i, width / 3, height / 8, height / 30);
      textSize(height / 20);
      fill("white")
      text(ownLevels[currentPage * 16 + i * 2], width / 10 + width / 6, height / 4 + height / 15 * i + height / 12 * i + height / 21)
      textSize(height / 30);
      text("Level ID: " + ownLevels[currentPage * 16 + i * 2 + 1], width / 10 + width / 6, height / 4 + height / 15 * i + height / 12 * i + height / 10)
    }
    if (second > 0) {
      for (let i = 0; i < second; i++) {
        fill(255, 255, 255, 120)
        rect(width - width / 10 - width / 3, height / 4 + height / 15 * i + 4 + height / 12 * i, width / 3, height / 8, height / 30);
        textSize(height / 20);
        fill("white")
        text(ownLevels[currentPage * 16 + i * 2 + 8], width - width / 10 - width / 6, height / 4 + height / 15 * i + height / 12 * i + height / 21)
        textSize(height / 30);
        text("Level ID: " + ownLevels[currentPage * 16 + i * 2 + 1 + 8], width - width / 10 - width / 6, height / 4 + height / 15 * i + height / 12 * i + height / 10)
      }
    }
    textSize(height / 15)
    if (currentPage != pages - 1) {
      fill(255, 255, 255, 120)
      rect(width - width / 20 - height / 30, height / 2 - height / 30, height / 15, height / 15, height / 50)
      fill("white")
      text(">", width - width / 20, height / 2)
    }
    if (currentPage != 0) {
      fill(255, 255, 255, 120)
      rect(width / 20 - height / 30, height / 2 - height / 30, height / 15, height / 15, height / 50)
      fill("white")
      text("<", width / 20, height / 2)
    }
    /*stroke(0)
    strokeWeight(height / 166);
    fill("white")
    rect(width - width / 150 - width / 8, height / 100, width / 8, height / 13);
    strokeWeight(height / 250);
    stroke(0)
    textSize(height / 25);
    text("New Level", width - width / 150 - width / 8 + width / 16, height / 100 + height / 26);
    fill(255)
    for (let i = 0; i < ownLevels.length / 2; i++) {
      rect(width / 10, height / 4 + height / 15 * i + height / 12 * i, width / 3, height / 8);
      textSize(height / 20);
      text(ownLevels[i * 2], width / 10 + width / 6, height / 4 + height / 15 * i + height / 12 * i + height / 21)
      textSize(height / 30);
      text("Level ID: " + ownLevels[i * 2 + 1], width / 10 + width / 6, height / 4 + height / 15 * i + height / 12 * i + height / 10)
    }
    /*textSize(height / 25);
    text("Leave it blank for a new Level", width / 2, height / 5);
    textSize(height / 20);
    fill("red");
    text("Warning: If you don't put in an actual Levelkey, the Map Maker may not work", width / 2, height - height / 20);
    fill("white");
    rect(width / 2 - width / 10, height / 1.5, width / 5, height / 10)
    textSize(height / 15);
    text("Continue", width / 2, height / 1.5 + height / 20);*/
    drawBack(color(255,255,255,120))
  }
  if (!output) {
    if (uploadLevel) {
      fill(0,0,0,120)
      rect(0,0,width,height)
      stroke(0);
      strokeWeight(height / 166);
      nameInp.position(width / 2 - width / 6, height / 3 + height / 40);
      nameInp.size(width / 3, height / 20)
      userInp.position(width / 2 - width / 6, height / 2 + height / 10);
      userInp.size(width / 3, height / 20)
      if (nameInp.value().length > 25) {
        nameInp.value(nameInp.value().substring(0, 25))
      }
      if (userInp.value().length > 25) {
        userInp.value(userInp.value().substring(0, 25))
      }
      fill("white");
      textSize(height / 15);
      rect(width / 2 - width / 10, height - height / 7, width / 5, height / 10, height / 30)
      text("Upload", width / 2, height - height / 7 + height / 20);
      text("Name your Level:", width / 2, height / 3.1);
      text("Your Username:", width / 2, height / 2 + height / 15);
      textSize(height / 10);
      text("Upload your Level", width / 2, height / 12);
      drawBack("white");
      if (newLevelListLoad) {
        $.get("https://vamos.alwaysdata.net/HoehensatzDash/levelList.php", function(data) {
          getLevelList = split(data, ",");
          getLevelList.splice(-1, 1);


          newLevelListLoad = false;
        });

      }
    } else if (saveLevel) {
      //background(120);
      fill(0,0,0,120)
      rect(0,0,width,height)
      fill(255)
      stroke(0);
      strokeWeight(height / 166);
      textSize(height / 20);
      rect(width / 2 - width / 10, height / 3 * 2 - height / 20, width / 5, height / 10, height / 30)
      text("Save", width / 2 - width / 10 + width / 10, height / 3 * 2 - height / 20 + height / 20)
      textSize(height / 20);
      text("Name your Level", width / 2 - width / 10 + width / 10, height / 3 * 1 - height / 50 + height / 20)
      textSize(height / 10);
      text("Save your level locally", width / 2 - width / 10 + width / 10, height / 10)
      drawBack("white");
      if (saveNameInp.value().length > 25) {
        saveNameInp.value(saveNameInp.value().substring(0, 25));
      }
      if (saveNameFill) {
        textSize(height / 20);
        text("The Level has no name", width / 2, height - height / 10)
      }
    } else {
      //background(120);
      fill(0,0,0,120)
      rect(0,0,width,height)
      fill("white");
      strokeWeight(height / 166);
      stroke(0)
      textSize(height / 10);
      text("Settings", width / 2, height / 12);
      drawBack("white")
      rect(width / 2 - width / 10, height / 6 + width / 12, width / 5, height / 10 /*width / 2 + width / 100, height / 1.2, width / 5, height / 10*/ , height / 30); //test level
      rect(width / 2 - width / 10, height / 6 * 2 + width / 12, width / 5, height / 10, height / 30); //width/2, height/2, width/5, height/10);
      textSize(height / 15)
      text("Test Level", width / 2 - width / 10 + width / 10, height / 6 + width / 12 + height / 20);
      rect(width / 2 - width / 10, height / 6 * 3 + width / 12, width / 5, height / 10, height / 30) //width / 2 - width / 100 - width / 5, height / 1.2, width / 5, height / 10);
      text("Upload", width / 2 - width / 10 + width / 10, height / 6 * 3 + width / 12 + height / 20);
      text("Save", width / 2 - width / 10 + width / 10, height / 6 * 2 + width / 12 + height / 20)
      textSize(height / 30);
      //inp.position(width / 2 - width / 6, height / 2 + height / 40);
      //inp.size(width / 3, height / 20)
      if (lamnbrah) {
        fill(255);
        text("Your Level is empty", width / 2, height - height / 10);
      }
    }
  } else if (testLevel) {
    gamePlay();
    increaseScore();

    stroke(0);
    progress = progress + triangleSpeed;
    let percentage = floor((progress + objectSize * 3) * 100 / (int(splitLevel[splitLevel.length - 3] * objectSize) + objectSize * 5));
    fill("white");
    textSize(height / 15);
    text(percentage + "%", width / 2, height / 10);
    percentageText = percentage + "%"
    /*if (percentageText == "NaN%") {
      lamnbrah = true;
      testLevel = false;
      output = false;
      inp = createInput();
    }*/
    if (percentage >= 100) {
      testLevel = false;
      startX = 0;
      startY = 0;
      createEditorSlider()
    }

    /*if (int(splitLevel[0]) - objectsDeleted < 90) {
      amnOfObjectsLevel = int(splitLevel[0]) - objectsDeleted;
    } else {
      amnOfObjectsLevel = 90;
    }*/

    while (float(splitLevel[objectIndex * 4 + 2]) * objectSize - progress < width) {
      if (float(splitLevel[objectIndex * 4 + 2]) * objectSize - progress < 0) {
        objectsDeleted++;
      } else {
        createObject(int(splitLevel[objectIndex * 4 + 1]), float(splitLevel[objectIndex * 4 + 2]) * objectSize - progress, yy - float(splitLevel[objectIndex * 4 + 3]) * objectSize, int(splitLevel[objectIndex * 4 + 4]));
        objectsLoaded++;
      }
      objectIndex = objectIndex + 1;
    }
    rect(width - width / 10.5, height / 100, width / 11, height / 15, height / 40);
    fill("black");
    textSize(height / 20);
    text("Back", width - width / 10.5 + width / 22, height / 100 + height / 30);
  }
}

function pause() {
  background(0, 120);
  lastGameActive = gameActive;
  gameActive = 4;
  musicSlider = createSlider(0, 0.2, musicSound, 0.001);
  soundSlider = createSlider(0, 1, soundSound, 0.001);

  musicSlider.position(width / 6, height / 1.8);
  musicSlider.size(width / 5);
  soundSlider.position(width - width / 6 - width / 5, height / 1.8);
  soundSlider.size(width / 5);
}

function loadEditorLevel(levelKey, loadedId, loadedName) {
  if (levelKey == "") {
    levelKey = "0";

  }
  ownLevelName = loadedName;
  ownLoadedId = loadedId;
  let stringToLoad = levelKey //mapEditorInput.value();
  let splitMapEditor = split(stringToLoad, ",");
  numbEditorObjects = int(splitMapEditor[0]);
  editorObjects.splice(0);
  for (let g = 0; g < numbEditorObjects; g++) {
    editorObjects[g] = [float(splitMapEditor[g * 4 + 2]), float(splitMapEditor[g * 4 + 3]), 0, int(splitMapEditor[g * 4 + 1]), int(splitMapEditor[g * 4 + 4])]
    if (editorObjects[g][0] > editorLastObject) {
      editorLastObject = editorObjects[g][0];
    }
  }
  //mapEditorInput.remove();
  editorLoadScreen = false;
  varReset(9999999);
  editorSliderValue = 0;
  createEditorSlider()
}

function createKey() {
  editorSliderValue = editorSlider.value();
  editorSlider.remove();
  output = false
  levelSeed = numbEditorObjects;
  for (let j = 0; j < (editorLastObject + 1) * 10; j++) {
    for (let i = 0; i < numbEditorObjects; i++) {
      if (editorObjects[i][0] * 10 == j) {
        levelSeed = levelSeed + ", " + editorObjects[i][3] + ", " + editorObjects[i][0] + ", " + editorObjects[i][1] + ", " + editorObjects[i][4];
      }
    }
  }

  //inp = createInput(levelSeed);
}

function createEditorSlider() {
  editorSlider = createSlider(0, editorLastObject * objectSize + objectSize * 10, editorSliderValue, objectSize);
  editorSlider.position(width / 4, height - height / 20);
  editorSlider.size(width / 6, height / 50)
}

function drawBack(color) {
  stroke(0)
  strokeWeight(height / 166);
  fill(color)
  rect(width / 150, height / 100, width / 8, height / 13, height / 40);
  fill("white")
  strokeWeight(height / 250);
  textSize(height / 20);
  text("Back", width / 150 + width / 16, height / 100 + height / 26);
}

function mouseWheel(event) {
  if(gameActive === 5&&output){

    editorSlider.value(editorSlider.value() - objectSize * (event.delta / 100));
  }
}
