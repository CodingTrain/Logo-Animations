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
    canvas.strokeWeight(logoSW*logoScale);
    canvas.strokeCap(ROUND);
    canvas.strokeJoin(ROUND);
    canvas.pushMatrix();
    canvas.translate(this.position.x, this.position.y);
    canvas.rotate(this.angle);
    canvas.stroke(this.strokeColor);
    canvas.line(-this.r, 0, this.r, 0);
    canvas.popMatrix();
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
    canvas.strokeWeight(logoSW*logoScale);
    canvas.strokeCap(ROUND);
    canvas.strokeJoin(ROUND);
    canvas.stroke(this.strokeColor);
    canvas.noFill();
    canvas.ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
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
    this.sw = map(this.radius, 0, 13.23*logoScale, 1, 2.9166*logoScale/4);
  }

  void show(int c) {
    canvas.stroke(c);
    canvas.strokeWeight(this.sw);
    canvas.noFill();
    float r = this.radius;//-this.sw/2;
    canvas.circle(this.center.a, this.center.b, r * 2);
  }

  float gdist(GasketCircle other) {
    return dist(this.center.a, this.center.b, other.center.a, other.center.b);
  }
}
