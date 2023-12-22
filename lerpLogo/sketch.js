let shapes = [];
let activeShapes = [];
let data;

let logoScale = 4;

function preload() {
  data = loadJSON('logo.json');
}

function setup() {
  createCanvas(400, 400);
  strokeWeight(data.strokeWeight * logoScale);
  strokeCap(ROUND);
  strokeJoin(ROUND);

  // Iterate over data.shapes and make LineSegments and Circles and add to shapes array
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

  shapes = shuffle(shapes);
  console.log(shapes);
}

let counter = 0;

function draw() {
  background(255);
  translate(width / 2, height / 2);
  scale(1);

  if (frameCount % 5 == 0 && counter < shapes.length) {
    activeShapes.push(shapes[counter]);
    counter++;
  }

  activeShapes.forEach((shape) => {
    shape.update();
    shape.show();
  });
}
