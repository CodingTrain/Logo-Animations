class Shape {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.angle = 0;
  }
}

class LineSegment extends Shape {
  constructor(x1, y1, x2, y2, strokeColor) {
    super(x1, y1);
    let x = (x1 + x2) * 0.5;
    let y = (y1 + y2) * 0.5;
    let v = createVector(x2 - x1, y2 - y1);
    this.angle = v.heading();
    this.r = dist(x1, y1, x2, y2) / 2;
    this.strokeColor = strokeColor;
    this.position = createVector(x, y);
  }

  show() {
    strokeWeight(data.strokeWeight * logoScale);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    stroke(this.strokeColor);
    line(-this.r, 0, this.r, 0);
    pop();
  }
}

class Circle extends Shape {
  constructor(x, y, radius, strokeColor) {
    super(x, y);
    this.radius = radius;
    this.strokeColor = strokeColor;
  }

  show() {
    strokeWeight(data.strokeWeight * logoScale);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    stroke(this.strokeColor);
    noFill();
    circle(this.position.x, this.position.y, this.radius * 2);
  }
}
