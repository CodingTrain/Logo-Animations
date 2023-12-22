class Shape {
  constructor(x, y) {
    let r = random(1);
    this.position = createVector(0, 0);
    if (r < 0.25) {
      this.position.x = -width / 2;
      this.position.y = random(-height / 2, height / 2);
    } else if (r < 0.5) {
      this.position.x = width / 2;
      this.position.y = random(-height / 2, height / 2);
    } else if (r < 0.75) {
      this.position.x = random(-width / 2, width / 2);
      this.position.y = -height / 2;
    } else {
      this.position.x = random(-width / 2, width / 2);
      this.position.y = height / 2;
    }
    this.home = createVector(x, y);
    this.angle = 0;
    this.homeAngle = 0;
    this.velocity = createVector();
    this.acceleration = createVector();
  }

  update() {
    this.position.lerp(this.home, 0.1);
    this.angle = lerp(this.angle, this.homeAngle, 0.05);
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
  }
}

class LineSegment extends Shape {
  constructor(x1, y1, x2, y2, strokeColor) {
    super(x1, y1);
    let x = (x1 + x2) * 0.5;
    let y = (y1 + y2) * 0.5;
    let v = createVector(x2 - x1, y2 - y1);
    this.homeAngle = v.heading();
    this.r = dist(x1, y1, x2, y2) / 2;
    this.home.x = x;
    this.home.y = y;
    this.strokeColor = strokeColor;
  }

  show() {
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
    stroke(this.strokeColor);
    noFill();
    circle(this.position.x, this.position.y, this.radius * 2);
  }
}
