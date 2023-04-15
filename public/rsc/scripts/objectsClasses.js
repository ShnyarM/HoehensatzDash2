//THIS WHOLE SCRIPT REFACTORING

let Block = {
  height: 1,
  width: 1,
  boxWidth: 1, //Size of hitbox
  boxHeight: 1,
  boxOffsetX: 0,
  boxOffsetY: 0,
  yOffset: 0,
  xOffset:0
}

let JumpOrb = {
  height: 0.75,
  width: 0.75,
  used: false,
  boxWidth: 0.75, //Size of hitbox
  boxHeight: 0.75,
  boxOffsetX: 0,
  boxOffsetY: 0,
  xOffset: 0.125,
  yOffset: -0.125
}

let Spike = {
  height: 1,
  width: 1,
  boxWidth: 0.15, //Size of hitbox
  boxHeight: 0.4,
  get boxOffsetX(){ return (this.width-this.boxWidth)*0.5},
  get boxOffsetY(){ return (this.width-this.boxWidth)*0.5},
  yOffset: 0,
  xOffset:0
}

let JumpPad = {
  height: 0.2,
  width: 1,
  used: false,
  boxWidth: 1, //Size of hitbox
  boxHeight: 0.2,
  boxOffsetX: 0,
  boxOffsetY: 0,
  yOffset: -0.8,
  xOffset:0
}

let Portal = {
  height: 2,
  width: 1,
  used: false,
  boxWidth: 1, //Size of hitbox
  boxHeight: 2,
  boxOffsetX: 0,
  boxOffsetY: 0,
  yOffset: 0,
  xOffset:0
}

let objectTypes = [Block, Spike, JumpOrb, JumpPad, Portal] //Assign different types to a specific id

function drawObject(object){
  unitImage(objImages[object.id], object.x, object.y, object.width, object.height)
}

function collisionObject(player, object){
  if(collision(object.x+object.boxOffsetX, object.y-object.boxOffsetY, object.boxWidth, object.boxHeight, player.x, player.y, player.width, player.height))collideObject(player, object)//this.collide(collider, this)
}

//Maybe this can be optimized since we know type == block
function collisionBlockObject(player, object){
  if(collision(object.x+object.boxOffsetX, object.y-object.boxOffsetY, object.boxWidth, object.boxHeight, player.x+player.blockHitboxOffset, player.y-player.blockHitboxOffset, player.blockHitboxSize, player.blockHitboxSize))collideObject(player, object)//this.collide(collider, this)
}

//THIS CODE ALSO SHIT
//       ↓
function collideObject(player, object){
  switch (object.id){
    case 0:{ //block
      player.die()
    }break
    case 50:{ //spike
      player.die()
    }break
    case 100:{ //orb
      if(!player.input || !player.canUseRing) return
      if(object.used)return
      player.jump()
      object.used = true
    }break
    case 101:{ //pink orb
      if(!player.input || !player.canUseRing) return
      if(object.used)break
      player.jump(0.8)
      object.used = true
    }break
    case 102:{ //red orb
      if(!player.input || !player.canUseRing) return
      if(object.used)break
      player.jump(1.5)
      object.used = true
    }break
    case 103:{ //gravityOrb
      if(!player.input || !player.canUseRing) return
      if(object.used)return
      player.switchGravity()
      player.jump(-0.3);
      object.used = true
    }break
    case 104:{  //green orb
      if(!player.input || !player.canUseRing) return
      if(object.used)return
      player.switchGravity()
      player.yVelocity=0
      player.jump(0.9);
      object.used = true
    }break
    case 105:{ //jump pad
      if(object.used)break
      player.jump(1.5);
      object.used = true;
    }break
    case 106:{ //pink pad
      if(object.used)break
      player.jump(0.9);
      object.used = true;
    }break
    case 107:{ //red pad
      if(object.used)break
      player.jump(1.9);
      object.used = true;
    }break
    case 108:{ //gravity pad
      if(object.used)break
      player.jump(0.3);
      player.switchGravity();
      object.used = true;
    }break
    case 120:{ //cube portal
      if(object.used)break
      player.switchMode(0)
      object.used = true
    }break
    case 121:{ //mini portal
      if(object.used)break
      player.switchToMini()
      object.used = true
    }break
    case 122:{ //big portal
      if(object.used)break
      player.switchToBig()
      object.used = true
    }break
    case 123:{ //ship portal
      if(object.used)break
      player.switchMode(1)
      object.used = true
    }break
    case 124:{ //ball portal
      if(object.used)break
      player.switchMode(2)
      object.used = true
    }break
    case 125:{ //ufo portal
      if(object.used)break
      player.switchMode(3)
      object.used = true
    }break
    case 126:{ //wave portal
      if(object.used)break
      player.switchMode(4)
      object.used = true
    }break
    case 127:{ //robot portal
      if(object.used)break
      player.switchMode(5)
      object.used = true
    }break
    case 128:{ //spider portal
      if(object.used)break
      player.switchMode(6)
      object.used = true
    }break
    case 129:{ //swing copter portal
      if(object.used)break
      player.switchMode(7)
      object.used = true
    }break
    case 130:{ //speed 0
      if(object.used)break
      player.xVelocity = 0.8*normalXVelocity
      object.used = true
    }break
    case 131:{ //speed 1
      if(object.used)break
      player.xVelocity = 1*normalXVelocity
      object.used = true
    }break
    case 132:{ //speed 2
      if(object.used)break
      player.xVelocity = 1.25*normalXVelocity
      object.used = true
    }break
    case 133:{ //speed 3
      if(object.used)break
      player.xVelocity = 1.5*normalXVelocity
      object.used = true
    }break
    case 134:{ //speed 4
      if(object.used)break
      player.xVelocity = 1.85*normalXVelocity
      object.used = true
    }break
    case 135:{ //normal gravity portal
      if(object.used)break
      player.gravitySwitch = 1
      object.used = true
    }break
    case 136:{ //upside down gravity portal
      if(object.used)break
      player.gravitySwitch = -1
      object.used = true
    }break
  }
}

//Convert object Object into string form, returns an array with all needed vars
function convertObjToStringForm(obj){
  const type = objectTypes[objectInfo[obj.id].type] //Get type object of object (block, spike, portal...)
  return [obj.id, obj.x-type.xOffset, obj.y-type.yOffset]
}

class gameObject{
  constructor(id, x, y){
    Object.assign(this, objectTypes[objectInfo[id].type])
    this.x = x + this.xOffset;
    this.y = y + this.yOffset;
    this.id = id

    Object.assign(this, objectInfo[id].extra) //Assign object from objects.js to get special properties like different width
  }
}