let shapes = [];
let data;

let logoScale = 4;

let drops = [];

let palette;

function preload() {
  data = loadJSON('logo.json');
}

let animator;

function setup() {
  createCanvas(960, 540);
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
      shapes.push(
        new Circle(shape.x * logoScale, shape.y * logoScale, shape.r * logoScale, shape.color)
      );
    }
  });

  animator = {
    counter: 0,
    max: floor(random(2, 10)),
    x: random(width) - width / 2,
    y: random(height) - height / 2,
    color: random(palette),
  };
}

let counter = 0;

function draw() {
  addInk(animator.x, animator.y, 12, animator.color);
  animator.counter++;
  if (animator.counter > animator.max) {
    animator.counter = 0;
    animator.max = floor(random(2, 20));
    animator.x = random(width) - width / 2;
    animator.y = random(height) - height / 2;
    animator.color = random(palette);
  }

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

// Add an ink drop to the canvas
function addInk(x, y, r, col) {
  // Create a new Drop object
  let drop = new Drop(x, y, r, col);

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
