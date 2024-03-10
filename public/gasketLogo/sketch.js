let shapes = [];
let data;

let logoScale = 12;

function preload() {
  data = loadJSON('logo.json');
}

let gaskets = [];

function setup() {
  createCanvas(800, 800);

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
      let rw = (data.strokeWeight * logoScale) / 2;

      gaskets.push(
        new Gasket(
          shape.x * logoScale,
          shape.y * logoScale,
          shape.r * logoScale - rw,
          rw,
          shape.color
        )
      );
    }
  });

  for (let n = 0; n < 2; n++) {
    for (let i = gaskets.length - 1; i >= 0; i--) {
      let nextG = gaskets[i].recurse();
      if (nextG) gaskets.push(...nextG);
    }
  }
}

function draw() {
  background(255);
  translate(width / 2, height / 2);
  scale(1);
  shapes.forEach((shape) => {
    shape.show();
  });

  for (let gasket of gaskets) {
    gasket.show();
    //gasket.nextGeneration();
  }
}
