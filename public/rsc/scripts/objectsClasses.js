
class Block{
  constructor(x, y){
    this.x = x
    this.y = y
    this.height = 1
    this.width = 1
    this.boxWidth = 0.8 //Size of hitbox
    this.boxHeight = 0.8
    this.boxOffsetX = (this.width-this.boxWidth)*0.5
    this.boxOffsetY = (this.width-this.boxWidth)*0.5
  }

  //Draw block on canvas
  draw(){
    unitImage(block, this.x, this.y, this.width, this.height)
  }

  drawHitbox(){
    fill(color(0, 0, 0, 0))
    stroke("red")
    unitRect(this.x+this.boxOffsetX, this.y-this.boxOffsetY, this.boxWidth, this.boxHeight)
  }

  //Check if colliding with player
  collision(){
    return collision(this.x+this.boxOffsetX, this.y-this.boxOffsetY, this.boxWidth, this.boxHeight, player.x, player.y, player.width, player.height)
  }
}

class Spike{
  constructor(x, y){
    this.x = x
    this.y = y
    this.height = 1
    this.width = 1
    this.boxWidth = 0.15 //Size of hitbox
    this.boxHeight = 0.4
    this.boxOffsetX = (this.width-this.boxWidth)*0.5
    this.boxOffsetY = (this.height-this.boxHeight)*0.5
  }

  //Draw on canvas
  draw(){
    unitImage(spike, this.x, this.y, this.width, this.height)
  }

  drawHitbox(){
    fill(color(0, 0, 0, 0))
    stroke("red")
    unitRect(this.x+this.boxOffsetX, this.y-this.boxOffsetY, this.boxWidth, this.boxHeight)
  }

  //Check if colliding with player
  collision(){
    return collision(this.x+this.boxOffsetX, this.y-this.boxOffsetY, this.boxWidth, this.boxHeight, player.x, player.y, player.width, player.height)
  }
}

//type 0 = yellow jump ring, 1 = gravity switch
class JumpRing{
  constructor(x, y, type){
    this.x = x+0.125
    this.y = y-0.125
    this.height = 0.75
    this.width = 0.75
    this.used = false
    this.type = type
  }

  //Draw on canvas
  draw(){
    unitImage(jumpRing, this.x, this.y, this.width, this.height)
  }

  drawHitbox(){
    fill(color(0, 0, 0, 0))
    stroke("red")
    unitRect(this.x, this.y, this.width, this.height)
  }

  //Check if colliding with player and can be used
  collision(){
    return (collision(this.x, this.y, this.width, this.height, player.x, player.y, player.width, player.height) && !this.used)
  }
}

class JumpPad{
  constructor(x, y){
    this.x = x
    this.y = y-0.8
    this.height = 0.2
    this.width = 1
    this.used = false
  }

  //Draw on canvas
  draw(){
    unitImage(jumpPad, this.x, this.y, this.width, this.height)
  }

  drawHitbox(){
    fill(color(0, 0, 0, 0))
    stroke("red")
    unitRect(this.x, this.y, this.width, this.height)
  }

  //Check if colliding with player and can be used
  collision(){
    console.log(collision(this.x, this.y, this.width, this.height, player.x, player.y, player.width, player.height))
    return (collision(this.x, this.y, this.width, this.height, player.x, player.y, player.width, player.height) && !this.used)
  }
}