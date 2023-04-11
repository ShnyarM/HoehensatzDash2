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
let objectList = [Block]
objectList[50] = Spike
objectList[100] = JumpOrb
objectList[101] = JumpOrb
objectList[102] = JumpOrb
objectList[103] = JumpOrb
objectList[104] = JumpOrb

objectList[105] = JumpPad
objectList[106] = JumpPad
objectList[107] = JumpPad
objectList[108] = JumpPad

for(i = 120; i<130;i++){
  objectList[i] = Portal
}
//        ^
//        |
//OPTIMIZE THIS WHOLE SHIT WTF

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
    case 0:{
      player.dead = true;
    }break
    case 50:{
      player.dead = true;
    }break
    case 100:{
      if(!player.input || !player.canUseRing) return
      if(object.used)return
      player.jump()
      object.used = true
    }break
    case 101:{
      if(!player.input || !player.canUseRing) return
      if(object.used)break
      player.jump(0.8)
      object.used = true
    }break
    case 102:{
      if(!player.input || !player.canUseRing) return
      if(object.used)break
      player.jump(1.5)
      object.used = true
    }break
    case 103:{
      if(!player.input || !player.canUseRing) return
      if(object.used)return
      player.switchGravity()
      player.jump(-0.3);
      object.used = true
    }break
    case 104:{
      if(!player.input || !player.canUseRing) return
      if(object.used)return
      player.switchGravity()
      player.yVelocity=0
      player.jump(0.9);
      object.used = true
    }break
    case 105:{
      if(object.used)break
      player.jump(1.5);
      object.used = true;
    }break
    case 106:{
      if(object.used)break
      player.jump(0.9);
      object.used = true;
    }break
    case 107:{
      if(object.used)break
      player.jump(1.9);
      object.used = true;
    }break
    case 108:{
      if(object.used)break
      player.jump(0.3);
      player.switchGravity();
      object.used = true;
    }break
    case 120:{
      if(object.used)break
      player.switchMode(0)
      object.used = true
    }break
    case 121:{
      if(object.used)break
      player.switchToMini()
      object.used = true
    }break
    case 122:{
      if(object.used)break
      player.switchToBig()
      object.used = true
    }break
    case 123:{
      if(object.used)break
      player.switchMode(1)
      object.used = true
    }break
    case 124:{
      if(object.used)break
      player.switchMode(2)
      object.used = true
    }break
    case 125:{
      if(object.used)break
      player.switchMode(3)
      object.used = true
    }break
    case 126:{
      if(object.used)break
      player.switchMode(4)
      object.used = true
    }break
    case 127:{
      if(object.used)break
      player.switchMode(5)
      object.used = true
    }break
    case 128:{
      if(object.used)break
      player.switchMode(6)
      object.used = true
    }break
    case 129:{
      if(object.used)break
      player.switchMode(7)
      object.used = true
    }break
  }
}
class gameObject{
  constructor(id, x, y){
    Object.assign(this, objectList[id])
    this.x = x + this.xOffset;
    this.y = y + this.yOffset;
    this.id = id
  }
}