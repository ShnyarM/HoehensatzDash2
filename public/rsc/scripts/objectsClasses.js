//THIS WHOLE SCRIPT REFACTORING

let Block = {
  width: 1, //How much space object takes up
  height: 1,

  drawnWidth: 1,//How big will be drawn
  drawnHeight: 1, 
  drawOffsetX: -0.5, //Offset of drawn image from middle point
  drawOffsetY: 0.5,
  
  boxWidth: 1, //Size of hitbox
  boxHeight: 1,
  boxOffsetX: 0, //Offset of hitbox from origin (x, y)
  boxOffsetY: 0,
}

let JumpOrb = {
  width: 1, //How much space object takes up
  height: 1,

  drawnWidth: 0.75,//How big will be drawn
  drawnHeight: 0.75, 
  drawOffsetX: -0.375, //Offset of drawn image from middle point
  drawOffsetY: 0.375,
  
  boxWidth: 0.75, //Size of hitbox
  boxHeight: 0.75,
  boxOffsetX: 0.125, //Offset of hitbox from origin (x, y)
  boxOffsetY: -0.125,
}

let Spike = {
  width: 1, //How much space object takes up
  height: 1,

  drawnWidth: 1,//How big will be drawn
  drawnHeight: 1,
  drawOffsetX: -0.5, //Offset of drawn image from middle point
  drawOffsetY: 0.5,

  boxWidth: 0.15, //Size of hitbox
  boxHeight: 0.4,
  boxOffsetX: 0.425, //Offset of hitbox from origin (x, y)
  boxOffsetY: -0.425,
}

let JumpPad = {
  width: 1, //How much space object takes up
  height: 1,

  drawnWidth: 1,//How big will be drawn
  drawnHeight: 0.2, 
  drawOffsetX: -0.5, //Offset of drawn image from middle point
  drawOffsetY: -0.3,
  
  boxWidth: 1, //Size of hitbox
  boxHeight: 0.2,
  boxOffsetX: 0, //Offset of hitbox from origin (x, y)
  boxOffsetY: -0.8,
}

let Portal = {
  width: 1.5, //How much space object takes up
  height: 3,

  drawnWidth: 1.5,//How big will be drawn
  drawnHeight: 3, 
  drawOffsetX: -0.75, //Offset of drawn image from middle point
  drawOffsetY: 1.5,
  
  boxWidth: 1.5, //Size of hitbox
  boxHeight: 3,
  boxOffsetX: 0, //Offset of hitbox from origin (x, y)
  boxOffsetY: 0,
}

let Bush = {
  width: 1, //How much space object takes up
  height: 1,

  drawnWidth: 1,//How big will be drawn
  drawnHeight: 1.15,
  drawOffsetX: -0.5, //Offset of drawn image from middle point
  drawOffsetY: 0.3,

  boxWidth: 1, //Size of hitbox
  boxHeight: 0.3,
  boxOffsetX: 0, //Offset of hitbox from origin (x, y)
  boxOffsetY: -0.7,
}

let Saw = {
  width: 1, //How much space object takes up
  height: 1,

  drawnWidth: 1.7,//How big will be drawn
  drawnHeight: 1.7,
  drawOffsetX: -0.85, //Offset of drawn image from middle point
  drawOffsetY: 0.85,

  boxWidth: 1, //Size of hitbox
  boxHeight: 1,
  boxOffsetX: 0, //Offset of hitbox from origin (x, y)
  boxOffsetY: 0,
}

let objectTypes = [Block, Spike, JumpOrb, JumpPad, Portal, Bush, Saw] //Assign different types to a specific id

function drawObject(object){
  switch(object.rotation){
    case 0:
      unitImage(objImages[object.id], object.xCenter+object.drawOffsetX, object.yCenter+object.drawOffsetY, object.drawnWidth, object.drawnHeight) //Draw without rotation
      break;
    case 1:
      rotateUnitImageByPointRotation(objImages[object.id], object.x+0.5*object.height, object.y-0.5*object.width, object.drawOffsetX, object.drawOffsetY, object.drawnWidth, object.drawnHeight, object.rotation*90)
      break;
    case 2:
      rotateUnitImageByPointRotation(objImages[object.id], object.xCenter, object.yCenter, object.drawOffsetX, object.drawOffsetY, object.drawnWidth, object.drawnHeight, object.rotation*90)
      break
    case 3:
      rotateUnitImageByPointRotation(objImages[object.id], object.x+0.5*object.height, object.y-0.5*object.width, object.drawOffsetX, object.drawOffsetY, object.drawnWidth, object.drawnHeight, object.rotation*90)
      break;
  }
}

function drawObjectHitbox(object){
  fill(color(0, 0, 0, 0))
  stroke("red")
  strokeWeight(0.05*u)
  switch(object.rotation){
    case 0:
      unitRect(object.x+object.boxOffsetX, object.y+object.boxOffsetY, object.boxWidth, object.boxHeight)
      break;
    case 1:
      unitRect(object.x+object.height+object.boxOffsetY-object.boxHeight, object.y-object.boxOffsetX, object.boxHeight, object.boxWidth)
      break;
    case 2:
      unitRect(object.x+object.boxOffsetX, object.y-object.height-object.boxOffsetY+object.boxHeight, object.boxWidth, object.boxHeight)
      break
    case 3:
      unitRect(object.x-object.boxOffsetY, object.y-object.boxOffsetX, object.boxHeight, object.boxWidth)
      break;
  }
}

function collisionObject(player, object, callBack = ()=> collideObject(player, object)){
  let hit = false
  switch(object.rotation){
    case 0:
      hit = collision(object.x+object.boxOffsetX, object.y+object.boxOffsetY, object.boxWidth, object.boxHeight, player.x, player.y, player.width, player.height)
      break;
    case 1:
      hit = collision(object.x+object.height+object.boxOffsetY-object.boxHeight, object.y-object.boxOffsetX, object.boxHeight, object.boxWidth, player.x, player.y, player.width, player.height)
      break;
    case 2:
      hit = collision(object.x+object.boxOffsetX, object.y-object.height-object.boxOffsetY+object.boxHeight, object.boxWidth, object.boxHeight, player.x, player.y, player.width, player.height)
      break
    case 3:
      hit = collision(object.x-object.boxOffsetY, object.y-object.boxOffsetX, object.boxHeight, object.boxWidth, player.x, player.y, player.width, player.height)
      break;
  }
  if(hit) callBack()//this.collide(collider, this)
}

//Maybe this can be optimized since we know type == block
function collisionBlockObject(player, object){
  if(collision(object.x+object.boxOffsetX, object.y+object.boxOffsetY, object.boxWidth, object.boxHeight, player.x+player.blockHitboxOffset, player.y-player.blockHitboxOffset, player.blockHitboxSize, player.blockHitboxSize))collideObject(player, object)//this.collide(collider, this)
}

//THIS CODE ALSO SHIT
//       ↓
function collideObject(player, object){
  switch (true){
    case object.id < 50:{ //block
      player.die()
    }break
    case object.id < 100:{ //spike
      player.die()
    }break
    case object.id == 100:{ //orb
      if(!player.input || !player.canUseRing) return
      if(object.used)return
      player.jump()
      object.used = true
    }break
    case object.id == 101:{ //pink orb
      if(!player.input || !player.canUseRing) return
      if(object.used)break
      player.jump(0.8)
      object.used = true
    }break
    case object.id == 102:{ //red orb
      if(!player.input || !player.canUseRing) return
      if(object.used)break
      player.jump(1.5)
      object.used = true
    }break
    case object.id == 103:{ //gravityOrb
      if(!player.input || !player.canUseRing) return
      if(object.used)return
      player.switchGravity()
      player.jump(-0.3);
      object.used = true
    }break
    case object.id == 104:{  //green orb
      if(!player.input || !player.canUseRing) return
      if(object.used)return
      player.switchGravity()
      player.yVelocity=0
      player.jump(0.9);
      object.used = true
    }break
    case object.id == 105:{ //jump pad
      if(object.used)break
      player.jump(1.5);
      object.used = true;
    }break
    case object.id == 106:{ //pink pad
      if(object.used)break
      player.jump(0.9);
      object.used = true;
    }break
    case object.id == 107:{ //red pad
      if(object.used)break
      player.jump(1.9);
      object.used = true;
    }break
    case object.id == 108:{ //gravity pad
      if(object.used)break
      player.jump(0.3);
      player.switchGravity();
      object.used = true;
    }break
    case object.id == 120:{ //cube portal
      if(object.used)break
      player.switchMode(0, object)
      object.used = true
    }break
    case object.id == 121:{ //mini portal
      if(object.used)break
      player.switchToMini()
      object.used = true
    }break
    case object.id == 122:{ //big portal
      if(object.used)break
      player.switchToBig()
      object.used = true
    }break
    case object.id == 123:{ //ship portal
      if(object.used)break
      player.switchMode(1, object)
      object.used = true
    }break
    case object.id == 124:{ //ball portal
      if(object.used)break
      player.switchMode(2, object)
      object.used = true
    }break
    case object.id == 125:{ //ufo portal
      if(object.used)break
      player.switchMode(3, object)
      object.used = true
    }break
    case object.id == 126:{ //wave portal
      if(object.used)break
      player.switchMode(4, object)
      object.used = true
    }break
    case object.id == 127:{ //robot portal
      if(object.used)break
      player.switchMode(5, object)
      object.used = true
    }break
    case object.id == 128:{ //spider portal
      if(object.used)break
      player.switchMode(6, object)
      object.used = true
    }break
    case object.id == 129:{ //swing copter portal
      if(object.used)break
      player.switchMode(7, object)
      object.used = true
    }break
    case object.id == 130:{ //speed 0
      if(object.used)break
      player.xVelocity = speedChangeMultiplication[0]*normalXVelocity
      object.used = true
    }break
    case object.id == 131:{ //speed 1
      if(object.used)break
      player.xVelocity = speedChangeMultiplication[1]*normalXVelocity
      object.used = true
    }break
    case object.id == 132:{ //speed 2
      if(object.used)break
      player.xVelocity = speedChangeMultiplication[2]*normalXVelocity
      object.used = true
    }break
    case object.id == 133:{ //speed 3
      if(object.used)break
      player.xVelocity = speedChangeMultiplication[3]*normalXVelocity
      object.used = true
    }break
    case object.id == 134:{ //speed 4
      if(object.used)break
      player.xVelocity = speedChangeMultiplication[4]*normalXVelocity
      object.used = true
    }break
    case object.id == 135:{ //normal gravity portal
      if(object.used)break
      player.gravitySwitch = 1
      object.used = true
    }break
    case object.id == 136:{ //upside down gravity portal
      if(object.used)break
      player.gravitySwitch = -1
      object.used = true
    }break
  }
}

//Convert object Object into string form, returns an array with all needed vars
function convertObjToStringForm(obj){
  return [obj.id, obj.x, obj.y, obj.rotation]
}

class gameObject{
  constructor(id, x, y, rotation){
    Object.assign(this, objectTypes[objectInfo[id].type])

    //Check if properties are defined, if not set default values (backwards compatibility)
    this.id = (id != undefined ? id : 0)
    this.rotation = (rotation != undefined ? rotation : 0)
    this.x = (x != undefined ? x : 0)
    this.y = (y != undefined ? y : 0)

    Object.assign(this, objectInfo[id].extra) //Assign object from objects.json to get special properties like different width
    this.xCenter = this.x+this.width*0.5 //coordinates of center of block
    this.yCenter = this.y-this.height*0.5
  }
}

function moveObject(obj, x, y){
  obj.x = x
  obj.y = y

  obj.xCenter = obj.x+obj.width*0.5 //coordinates of center of block
  obj.yCenter = obj.y-obj.height*0.5

}