let Block = {
  height: 1,
  width: 1,
  boxWidth: 0.8, //Size of hitbox
  boxHeight: 0.8,
  get boxOffsetX(){ return(this.width-this.boxWidth)*0.5},
  get boxOffsetY(){ return(this.width-this.boxWidth)*0.5},
  collide: function(collider, collideObj){
    collider.dead = true
  }
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
  yOffset: -0.125,
  collide: function(collider, collideObj){
    if(!collider.input || !collider.canUseRing) return
    if(collideObj.used)return
    collider.jump()
    collideObj.used = true
  }
}

let GravityOrb = {...JumpOrb};
GravityOrb.collide = function(collider, collideObj){
  if(!collider.input || !collider.canUseRing) return
  if(collideObj.used)return
  collider.switchGravity(true)
  collideObj.used = true
}

let GreenOrb = {...JumpOrb};
GreenOrb.collide = function(collider, collideObj){
  if(!collider.input || !collider.canUseRing) return
  if(collideObj.used)return
  collider.switchGravity()
  collideObj.used = true
}

let Spike = {
  height: 1,
  width: 1,
  boxWidth: 0.15, //Size of hitbox
  boxHeight: 0.4,
  get boxOffsetX(){ return (this.width-this.boxWidth)*0.5},
  get boxOffsetY(){ return (this.width-this.boxWidth)*0.5},
  collide: function(collider, collideObj){
    collider.dead = true
  }
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
  collide: function(collider, collideObj){
    collider.jump();
  }
}

let objectList = {"Block": Block, "JumpOrb":JumpOrb, "Spike": Spike, "GravityOrb":GravityOrb, "JumpPad": JumpPad, "GreenOrb": GreenOrb}

class gameObject{
  constructor(type, x, y){
    Object.assign(this, objectList[type])
    this.x = x;
    this.y = y;
    console.log(this)
    if (typeof this.xOffset !== 'undefined')this.x += this.xOffset
    if (typeof this.yOffset !== 'undefined')this.y += this. yOffset
    this.type = type
  }

  draw(){
    unitImage(images[this.type], this.x, this.y, this.width, this.height)
  }

  collision(collider){
    if(collision(this.x+this.boxOffsetX, this.y-this.boxOffsetY, this.boxWidth, this.boxHeight, collider.x, collider.y, collider.width, collider.height))this.collide(collider, this)
  }

  drawHitbox(){
    fill(color(0, 0, 0, 0))
    stroke("red")
    unitRect(this.x+this.boxOffsetX, this.y-this.boxOffsetY, this.boxWidth, this.boxHeight)
  }
}