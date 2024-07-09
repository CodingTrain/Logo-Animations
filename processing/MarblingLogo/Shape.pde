abstract class Shape {
  PVector position;
  int detail;
  ArrayList<PVector> vertices = new ArrayList<PVector>();
  int strokeColor;
  float strokeWeight = 4; // Assuming a default value, adjust as necessary

  Shape(float x, float y) {
    this.position = new PVector(x, y);
    this.detail = 10; // Default detail value
  }

  void marble(Drop other) {
    for (PVector v : vertices) {
      PVector c = other.center;
      float r = other.r;
      PVector p = PVector.sub(v, c);
      float m = p.mag();
      float root = sqrt(1 + (r * r) / (m * m));
      p.mult(root);
      p.add(c);
      v.set(p);
    }
  }

  void show() {
    stroke(this.strokeColor);
    strokeWeight(this.strokeWeight * logoScale);
    noFill();
    strokeCap(ROUND);
    strokeJoin(ROUND);
    beginShape();
    for (PVector v : vertices) {
      vertex(v.x, v.y);
    }
    endShape();
  }
}
