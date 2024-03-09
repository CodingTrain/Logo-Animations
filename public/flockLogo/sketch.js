let shapes = [];
let activeShapes = [];
let data;

let logoScale = 1;

function preload() {
  data = loadJSON('logo.json');
}

function setup() {
  createCanvas(300, 300);
  strokeWeight(data.strokeWeight * logoScale);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  for (let xoff = 30; xoff < width + 30; xoff += 60) {
    for (let yoff = 30; yoff < height + 30; yoff += 60) {
      // Iterate over data.shapes and make LineSegments and Circles and add to shapes array
      data.shapes.forEach((shape) => {
        if (shape.type === 'line') {
          shapes.push(
            new LineSegment(
              shape.x1 * logoScale + xoff,
              shape.y1 * logoScale + yoff,
              shape.x2 * logoScale + xoff,
              shape.y2 * logoScale + yoff,
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
      });
    }
  }
  // shapes = shuffle(shapes);
}
let counter = 0;

function draw() {
  background(255);

  if (shapes.length > 1 && frameCount % 1 == 0) {
    for (let i = 0; i < 1; i++) {
      let newShape = shapes.pop();
      activeShapes.push(newShape);
    }
  }

  shapes.forEach((shape) => {
    shape.show();
  });

  activeShapes.forEach((shape) => {
    shape.run(activeShapes);
  });
}
