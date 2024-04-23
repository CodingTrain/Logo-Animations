let shapes = [];
let data;

let logoScale = 4;

// Array to store all drops of ink
let drops = [];

let palette;

function preload() {
  data = loadJSON('logo.json');
}

function setup() {
  createCanvas(960, 540);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  palette = [
    color(11, 106, 136),
    color(45, 197, 244),
    color(112, 50, 126),
    color(146, 83, 161),
    color(164, 41, 99),
    color(236, 1, 90),
    color(240, 99, 164),
    color(241, 97, 100),
    color(248, 158, 79),
    color(252, 238, 33),
  ];

  data.shapes.forEach((shape) => {
    if (shape.type === 'line') {
      shapes.push(
        new LineSegment(
          shape.x1 * logoScale,
          shape.y1 * logoScale,
          shape.x2 * logoScale,
          shape.y2 * logoScale,
          shape.color
        )
      );
    } else if (shape.type === 'circle') {
      shapes.push(new Circle(shape.x * logoScale, shape.y * logoScale, shape.r * logoScale, shape.color));
    }
  });

  // Add 50 ink drops at random positions on the canvas
  // for (let i = 0; i < 50; i++) {
  //   let x = random(width) - width / 2;
  //   let y = random(height) - height / 2;
  //   let r = random(10, 50);
  //   addInk(x, y, r);
  // }

  // Iterate over data.shapes and make LineSegments and Circles and add to shapes array
}

let counter = 0;

function draw() {
  //if (mouseIsPressed) {
  for (let i = 0; i < 1; i++) {
    let x = random(width) - width / 2;
    let y = random(height) - height / 2;
    let r = random(5, 60);
    addInk(x, y, r);
  }
  //}

  background(255);
  translate(width / 2, height / 2);
  scale(1);
  shapes.forEach((shape) => {
    shape.show();
  });

  for (let drop of drops) {
    drop.show();
  }
}
// Track the start of mouse drag
let start;

// Record the starting point
function mousePressed() {
  start = createVector(mouseX, mouseY);
}

// Handle mouse drag to simulate ink spreading
function mouseDragged() {
  // Calculate vector from start to current mouse position
  let end = createVector(mouseX, mouseY);
  end.sub(start);
  end.normalize();

  // Simulate tine effects based on the mouse drag
  tineLine(end, mouseX, mouseY, 2, 16);
}

// Apply tine effects to ink drops
function tineLine(v, x, y, z, c) {
  // Apply the effect to each drop
  for (let drop of drops) {
    drop.tine(v, x, y, z, c);
  }
}

// Add an ink drop to the canvas
function addInk(x, y, r) {
  // Create a new Drop object
  let drop = new Drop(x, y, r);

  // Interact new drop with all existing drops
  for (let other of drops) {
    other.marble(drop);
  }

  for (let shape of shapes) {
    shape.marble(drop);
  }

  // Add the new drop to the array of drops
  drops.push(drop);
}
