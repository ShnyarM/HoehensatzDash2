//Draw slider and handle input
function handleSliders(){
  if(Object.keys(sliders).length == 0) return //Dont do anything if no sliders exist
  
  //Go through all slider
  for(const slider in sliders){
    const s = sliders[slider]
    s.draw()
    if((mouseIsDown && s.handleCollision() || mouseIsDown && s.clickedLastFrame)&&s.enabled) s.dragHandle() //true if handle was clicked or handle was clicked in last frame and mouse is still down
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

//Update sizes of all sliders when window gets resized
function updateSliderSizes(){
  if(Object.keys(sliders).length == 0) return //Dont do anything if no sliders exist
  
  //Go through all slider
  for(const slider in sliders) sliders[slider].updateSize()
}

class Slider{
  constructor(x, y, w, h, value, minValue, maxValue, enabled = true){
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
    this.enabled = enabled

    this.updateSize()
  }

  //Check if mouse is over handle
  handleCollision(){
    return button(this.xLeftPixel+this.widthPixel*this.percentageFilled-0.5*this.handleSizePixel, this.yTopPixel-0.5*(this.handleSizePixel-this.heightPixel), this.handleSizePixel, this.handleSizePixel)
  }

  //Handle is being moved
  dragHandle(){
    this.clickedLastFrame = true

    //Update percentage
    if(mouseX < this.xLeftPixel) this.percentageFilled = 0
    else if(mouseX > this.xLeftPixel+this.widthPixel) this.percentageFilled = 1
    else this.percentageFilled = map(mouseX, this.xLeftPixel, this.xLeftPixel+this.widthPixel, 0, 1)

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

  //convert size and positions into pixels
  updateSize(){
    this.xPixel = this.x*width
    this.yPixel = this.y*height
    this.widthPixel = this.width*width
    this.heightPixel = this.height*height
    this.handleSizePixel = this.handleSize*height
    //top left corner
    this.xLeftPixel = this.xPixel-0.5*this.widthPixel
    this.yTopPixel = this.yPixel-0.5*this.heightPixel
  }

  updateValue(){
    this.percentageFilled = map(this.value, this.minValue, this.maxValue, 0, 1)
  }

  draw(){
    stroke("black")
    strokeWeight(height/200)
    fill("gray")
    rectMode(CENTER)
    rect(this.xPixel, this.yPixel, this.widthPixel, this.heightPixel, height)

    fill(color(0, 200, 0))
    rectMode(CORNER)
    rect(this.xLeftPixel, this.yTopPixel, this.widthPixel*this.percentageFilled, this.heightPixel, height)

    fill("yellow")
    rect(this.xLeftPixel+this.widthPixel*this.percentageFilled-0.5*this.handleSizePixel, this.yTopPixel-0.5*(this.handleSizePixel-this.heightPixel), this.handleSizePixel, this.handleSizePixel, height)
  }
}