class Shape {
  PVector position;
  float angle;

  Shape(float x, float y) {
    this.position = new PVector(x, y);
    this.angle = 0;
  }

  void show() {
  }
}

class LineSegment extends Shape {
  float r;
  int strokeColor;

  LineSegment(float x1, float y1, float x2, float y2, int strokeColor) {
    super((x1 + x2) * 0.5, (y1 + y2) * 0.5);
    PVector v = new PVector(x2 - x1, y2 - y1);
    this.angle = v.heading();
    this.r = v.mag() / 2;
    this.strokeColor = strokeColor;
  }

  void show() {
    strokeWeight(logoSW*logoScale);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    pushMatrix();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    stroke(this.strokeColor);
    line(-this.r, 0, this.r, 0);
    popMatrix();
  }
}

class Circle extends Shape {
  float radius;
  int strokeColor;

  Circle(float x, float y, float radius, int strokeColor) {
    super(x, y);
    this.radius = radius;
    this.strokeColor = strokeColor;
  }

  void show() {
    strokeWeight(logoSW*logoScale);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    stroke(this.strokeColor);
    noFill();
    ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
  }
}


// GasketCircle Class
class GasketCircle {
  Complex center;
  float bend, radius, sw;

  GasketCircle(float bend, float x, float y) {
    this.center = new Complex(x, y);
    this.bend = bend;
    this.radius = abs(1 / bend);
    this.sw = map(this.radius, 0, width / 2, 1, 36);
  }

  void show(int c) {
    stroke(c);
    strokeWeight(this.sw);
    noFill();
    float r = this.radius;//-this.sw/2;
    circle(this.center.a, this.center.b, r * 2);
  }

  float gdist(GasketCircle other) {
    return dist(this.center.a, this.center.b, other.center.a, other.center.b);
  }
}
