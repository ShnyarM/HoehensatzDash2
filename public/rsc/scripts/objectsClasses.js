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

let objectList = {"Block": Block, "JumpOrb":JumpOrb, "Spike": Spike, "GravityOrb":JumpOrb, "JumpPad": JumpPad, "GreenOrb": JumpOrb, "LowJumpPad": JumpPad,"HighJumpPad": JumpPad, "GravityPad": JumpPad, "LowJumpOrb": JumpOrb, "HighJumpOrb": JumpOrb, "ShipPortal": Portal, "CubePortal": Portal, "MiniPortal": Portal, "BigPortal": Portal}


function drawObject(object){
  unitImage(images[object.type], object.x, object.y, object.width, object.height)
}

function collisionObject(player, object){
  if(collision(object.x+object.boxOffsetX, object.y-object.boxOffsetY, object.boxWidth, object.boxHeight, player.x, player.y, player.width, player.height))collideObject(player, object)//this.collide(collider, this)
}

//Maybe this can be optimized since we know type == block
function collisionBlockObject(player, object){
  if(collision(object.x+object.boxOffsetX, object.y-object.boxOffsetY, object.boxWidth, object.boxHeight, player.x+player.blockHitboxOffset, player.y-player.blockHitboxOffset, player.blockHitboxSize, player.blockHitboxSize))collideObject(player, object)//this.collide(collider, this)
}

function collideObject(player, object){
  switch (object.type){
    case "Spike":
    case "Block":{
      player.dead = true;
    }break
    case "JumpOrb":{
      if(!player.input || !player.canUseRing) return
      if(object.used)return
      player.jump()
      object.used = true
    }break
    case "GravityOrb":{
      if(!player.input || !player.canUseRing) return
      if(object.used)return
      player.switchGravity()
      player.jump(-0.5);
      object.used = true
    }break
    case "GreenOrb":{
      if(!player.input || !player.canUseRing) return
      if(object.used)return
      player.switchGravity()
      player.yVelocity=0
      player.jump(0.9);
      object.used = true
    }break
    case "JumpPad":{
      if(object.used)break
      player.jump(1);
      object.used = true;
    }break
    case "LowJumpPad":{
      if(object.used)break
      player.jump(0.8);
      object.used = true;
    }break
    case "HighJumpPad":{
      if(object.used)break
      player.jump(1.5);
      object.used = true;
    }break
    case "GravityPad":{
      if(object.used)break
      player.jump(0.4);
      player.switchGravity();
      object.used = true;
    }break
    case "HighJumpOrb":{
      if(!player.input || !player.canUseRing) return
      if(object.used)break
      player.jump(1.5)
      object.used = true
    }break
    case "LowJumpOrb":{
      if(!player.input || !player.canUseRing) return
      if(object.used)break
      player.jump(0.8)
      object.used = true
    }break
    case "CubePortal":{
      if(object.used)break
      player.switchMode(0)
      object.used = true
    }break
    case "ShipPortal":{
      if(object.used)break
      player.switchMode(4)
      object.used = true
    }break
    case "MiniPortal":{
      if(object.used)break
      player.switchToMini()
      object.used = true
    }break
    case "BigPortal":{
      if(object.used)break
      player.switchToBig()
      object.used = true
    }break
  }
}
class gameObject{
  constructor(type, x, y){
    Object.assign(this, objectList[type])
    this.x = x + this.xOffset;
    this.y = y + this.yOffset;
    this.type = type
  }
}