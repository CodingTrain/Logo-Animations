class Shape {
  constructor(x, y) {
    this.home = createVector(x, y);
    this.homeAngle = 0;
    this.options = { restitution: 0.9, friction: 0.001 };
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

    // make a matter.js body
    this.body = Bodies.rectangle(x, y, this.r * 2, data.strokeWeight * 2, this.options);
    Body.setAngle(this.body, this.homeAngle);
    Composite.add(engine.world, this.body);
  }

  show() {
    let position = this.body.position;
    let angle = this.body.angle;
    push();
    translate(position.x, position.y);
    rotate(angle);
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
    // make a matter.js Body
    this.body = Bodies.circle(x, y, radius + parseFloat(data.strokeWeight), this.options);
    Composite.add(engine.world, this.body);
  }

  show() {
    let position = this.body.position;
    let angle = this.body.angle;
    stroke(this.strokeColor);
    noFill();
    circle(position.x, position.y, this.radius * 2);
  }
}
