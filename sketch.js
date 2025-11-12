//We need a variable to hold our image
let img;

//We will divide the image into segments
let numSegments = 100;

//We will store the segments in an array
let segments = [];

//lets add a variable to switch between drawing the image and the segments
let drawSegments = true;

//Let's make an object to hold the draw properties of the image
let imgDrwPrps = {aspect: 0, width: 0, height: 0, xOffset: 0, yOffset: 0};

//And a variable for the canvas aspect ratio
let canvasAspectRatio = 0;

//lets load the image from disk
function preload() {
  img = loadImage('assets/Edvard_Munch_The_Scream (3).jpeg');
}

function setup() {
  //We will make the canvas the same size as the image using its properties
  createCanvas(windowWidth, windowHeight);
  //let's calculate the aspect ratio of the image - this will never change so we only need to do it once
  imgDrwPrps.aspect = img.width / img.height;
  
  //now let's calculate the draw properties of the image using the function we made
  calculateImageDrawProps();

  //We can use the width and height of the image to calculate the size of each segment
  let segmentWidth = img.width / numSegments;
  let segmentHeight = img.height / numSegments;
  /*
  Divide the original image into segments, we are going to use nested loops
  */
let positionInColumn = 0;
  for (let segYPos=0; segYPos<img.height; segYPos+=segmentHeight) {
    //this is looping over the height
    let positionInRow = 0
    for (let segXPos=0; segXPos<img.width; segXPos+=segmentWidth) {
      //We will use the x and y position to get the colour of the pixel from the image
      //lets take it from the centre of the segment
      let segmentColour = img.get(segXPos + segmentWidth / 2, segYPos + segmentHeight / 2);
       let segment = new ImageSegment(positionInColumn, positionInRow,segmentColour);
       segments.push(segment);
        positionInRow++;
    }
    positionInColumn++;
  }
   for (const segment of segments) {
    segment.calculateSegDrawProps();
  }
}

function draw() {
  background(0);
  if (drawSegments) {
    //lets draw the segments to the canvas
    for (const segment of segments) {
      segment.draw();
    }
  } else {
    //lets draw the image to the canvas
    image(img, imgDrwPrps.xOffset, imgDrwPrps.yOffset, imgDrwPrps.width, imgDrwPrps.height);
  }
}
function keyPressed() {
  if (key == " ") {
    //this is a neat trick to invert a boolean variable,
    //it will always make it the opposite of what it was
    drawSegments = !drawSegments;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateImageDrawProps();
  for (const segment of segments) {
    segment.calculateSegDrawProps();
  }
}

function calculateImageDrawProps() {
  //Calculate the aspect ratio of the canvas
  canvasAspectRatio = width / height;
  //if the image is wider than the canvas
  if (imgDrwPrps.aspect > canvasAspectRatio) {
    //then we will draw the image to the width of the canvas
    imgDrwPrps.width = width;
    //and calculate the height based on the aspect ratio
    imgDrwPrps.height = width / imgDrwPrps.aspect;
    imgDrwPrps.yOffset = (height - imgDrwPrps.height) / 2;
    imgDrwPrps.xOffset = 0;
  } else if (imgDrwPrps.aspect < canvasAspectRatio) {
    //otherwise we will draw the image to the height of the canvas
    imgDrwPrps.height = height;
    //and calculate the width based on the aspect ratio
    imgDrwPrps.width = height * imgDrwPrps.aspect;
    imgDrwPrps.xOffset = (width - imgDrwPrps.width) / 2;
    imgDrwPrps.yOffset = 0;
  }
  else if (imgDrwPrps.aspect == canvasAspectRatio) {
    //if the aspect ratios are the same then we can draw the image to the canvas size
    imgDrwPrps.width = width;
    imgDrwPrps.height = height;
    imgDrwPrps.xOffset = 0;
    imgDrwPrps.yOffset = 0;
  }
}
//Here is our class for the image segments, we start with the class keyword
class ImageSegment {

  constructor(columnPositionInPrm, rowPostionInPrm  ,srcImgSegColourInPrm) {
    //these parameters are used to set the internal properties of an instance of the segment
    //These parameters are named as imageSource as they are derived from the image we are using
    this.columnPosition = columnPositionInPrm;
    this.rowPostion = rowPostionInPrm;
    this.srcImgSegColour = srcImgSegColourInPrm;
    this.drawXPos = 0;
    this.drawYPos = 0;
    this.drawWidth = 0;
    this.drawHeight = 0;
  }
  calculateSegDrawProps() {
    //Here is where we will calculate the draw properties of the segment.
    //The width and height are easy to calculate, remember the image made of segments is always the same size as the whole image even when it is resized
    //We can use the width and height we calculated for the image to be drawn, to calculate the size of each segment
    this.drawWidth = imgDrwPrps.width / numSegments;
    this.drawHeight = imgDrwPrps.height / numSegments;
    //The x position is the row position multiplied by the width of the segment plus the x offset we calculated for the image
    this.drawXPos = this.rowPostion * this.drawWidth + imgDrwPrps.xOffset;
    //The y position is the column position multiplied by the height of the segment plus the y offset we calculated for the image
    this.drawYPos = this.columnPosition * this.drawHeight + imgDrwPrps.yOffset;
  }

  draw() {
  noStroke();
  fill(this.srcImgSegColour);   // 用 segment 的颜色作为线的颜色
  ellipse(this.drawXPos, this.drawYPos, this.drawWidth, this.drawHeight);
}
}