let shapes = [];
let activeShapes = [];
let data;

let logoScale = 2;

const { Engine, Bodies, Composite, Body, Vector } = Matter;

// A reference to the matter physics engine
let engine;
let boundaries = [];

function preload() {
  data = loadJSON('logo.json');
}

function setup() {
  createCanvas(600, 600);
  engine = Engine.create();

  strokeCap(ROUND);
  strokeJoin(ROUND);
  let xoff = width / 2;
  let yoff = 100;
  for (const shape of data.shapes) {
    if (shape.type === 'line') {
      shapes.push(
        new LineSegment(
          shape.x1 * logoScale + xoff,
          shape.y1 * logoScale + yoff,
          shape.x2 * logoScale + xoff,
          shape.y2 * logoScale + yoff,
          data.strokeWeight * logoScale,
          shape.color
        )
      );
    } else if (shape.type === 'circle') {
      shapes.push(
        new Circle(
          shape.x * logoScale + xoff,
          shape.y * logoScale + yoff,
          shape.r * logoScale,
          shape.color
        )
      );
    }
  }

  let w = 50;
  boundaries.push(new Boundary(width / 2, height + w / 2, width, w));
  boundaries.push(new Boundary(width / 2, -w / 2, width, w));
  boundaries.push(new Boundary(-w / 2, height / 2, w, height));
  boundaries.push(new Boundary(width + w / 2, height / 2, w, height));
}

function draw() {
  background(255);
  Engine.update(engine);
  strokeWeight(data.strokeWeight * logoScale);
  shapes.forEach((shape) => {
    shape.show();
  });

  for (let i = 0; i < boundaries.length; i++) {
    //boundaries[i].show();
  }
}
