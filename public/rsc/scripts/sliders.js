//Draw slider and handle input
function handleSliders(){
  if(Object.keys(sliders).length == 0) return //Dont do anything if no sliders exist
  
  //Go through all slider
  for(const slider in sliders){
    const s = sliders[slider]
    s.draw()
    if(mouseIsDown && s.handleCollision() || mouseIsDown && s.clickedLastFrame) s.dragHandle() //true if handle was clicked or handle was clicked in last frame and mouse is still down
    else s.clickedLastFrame = false
  }
}

//Creates a new Slider, x and y are coordinates in canvas percentage, width and height also in percentages, callback is used to tie a specific value to slider
function addSlider(name, x, y, w, h, value, minValue, maxValue){
  if(sliders[name]) {console.error("Slider already exists!"); return}

  sliders[name] = new Slider(x, y, w, h, value, minValue, maxValue)
  return sliders[name]
}

//Remove a slider, passed parameter is name of slider
function removeSlider(slider){
  delete sliders[slider]
}

class Slider{
  constructor(x, y, w, h, value, minValue, maxValue){
    this.x = x
    this.y = y
    this.width = w
    this.height = h
    this.value = value
    this.minValue = minValue
    this.maxValue = maxValue
    this.handleSize = this.height*1.5
    this.percentageFilled = map(this.value, this.minValue, this.maxValue, 0, 1)
    this.clickedLastFrame = false
    this.inputFunction = () => {}
  }

  //Check if mouse is over handle
  handleCollision(){
    return button(width*(this.x+this.width*(-0.5+this.percentageFilled))-0.5*this.handleSize*height, height*(this.y-this.height*0.5+0.5*(this.height-this.handleSize)), this.handleSize*height, this.handleSize*height)
  }

  //Handle is being moved
  dragHandle(){
    this.clickedLastFrame = true

    //Update percentage
    if(mouseX < (this.x-0.5*this.width)*width) this.percentageFilled = 0
    else if(mouseX > (this.x+0.5*this.width)*width) this.percentageFilled = 1
    else this.percentageFilled = map(mouseX-(this.x-0.5*this.width)*this.width, (this.x-0.5*this.width)*width, (this.x+0.5*this.width)*width, 0, 1)

    //Set value
    if(this.percentageFilled == 0) this.value = this.minValue
    else if(this.percentageFilled == 1) this.value = this.maxValue
    else this.value = map(this.percentageFilled, 0, 1, this.minValue, this.maxValue)

    this.inputFunction() //Execute input function
  }

  //Set the input function
  input(func){
    this.inputFunction = func
  }

  draw(){
    stroke("black")
    strokeWeight(height/200)
    fill("gray")
    rectMode(CENTER)
    rect(width*this.x, height*this.y, width*this.width, height*this.height, height)

    fill(color(0, 200, 0))
    rectMode(CORNER)
    rect(width*(this.x-0.5*this.width), height*(this.y-0.5*this.height), width*this.width*this.percentageFilled, height*this.height, height)

    fill("yellow")
    rect(width*(this.x+this.width*(-0.5+this.percentageFilled))-0.5*this.handleSize*height, height*(this.y-this.height*0.5+0.5*(this.height-this.handleSize)), this.handleSize*height, this.handleSize*height, height)
  }
}