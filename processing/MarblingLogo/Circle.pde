class Circle extends Shape {
  float radius;

  Circle(float x, float y, float radius, int strokeColor) {
    super(x, y);
    this.radius = radius;
    this.strokeColor = strokeColor;
    this.detail = (int)this.radius; // Increased detail for larger radius

    for (int i = 0; i < this.detail; i++) {
      float a = map(i, 0, this.detail, 0, TWO_PI);
      float xOff = cos(a) * this.radius;
      float yOff = sin(a) * this.radius;
      vertices.add(new PVector(this.position.x + xOff, this.position.y + yOff));
    }
  }

  void show() {
    strokeCap(ROUND);
    strokeJoin(ROUND);
    strokeWeight(this.strokeWeight * logoScale);
    noFill();
    stroke(this.strokeColor);
    beginShape();
    for (PVector v : vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE); // Draw a closed shape
  }
}
