class LineSegment extends Shape {
  LineSegment(float x1, float y1, float x2, float y2, int strokeColor) {
    super(x1, y1);
    this.strokeColor = strokeColor;
    PVector v1 = new PVector(x1, y1);
    PVector v2 = new PVector(x2, y2);
    this.detail = 20;

    for (int i = 0; i <= this.detail; i++) {
      float t = (float)i / this.detail;
      PVector p = PVector.lerp(v1, v2, t);
      this.vertices.add(p);
    }
  }
}
