class Drop {
  PVector center;
  float r;
  ArrayList<PVector> vertices = new ArrayList<PVector>();
  int col;
  final int circleDetail = 400;  // Detail level for drawing circles

  Drop(float x, float y, float r, int col) {
    this.center = new PVector(x, y);
    this.r = r;
    this.col = col;

    for (int i = 0; i < circleDetail; i++) {
      float angle = map(i, 0, circleDetail, 0, TWO_PI);
      PVector v = new PVector(cos(angle), sin(angle));
      v.mult(this.r);
      v.add(this.center);
      this.vertices.add(v);
    }
  }

  void tine(PVector m, float x, float y, float z, float c) {
    float u = 1 / pow(2, 1 / c);
    PVector b = new PVector(x, y);
    for (PVector v : vertices) {
      PVector pb = PVector.sub(v, b);
      PVector n = m.copy().rotate(HALF_PI);
      float d = abs(pb.dot(n));
      float mag = z * pow(u, d);
      v.add(m.copy().mult(mag));
    }
  }

  void marble(Drop other) {
    for (PVector v : vertices) {
      PVector c = other.center;
      float r = other.r;
      PVector p = v.copy();
      p.sub(c);
      float m = p.mag();
      float root = sqrt(1 + (r * r) / (m * m));
      p.mult(root);
      p.add(c);
      v.set(p);
    }
  }

  void show() {
    fill(this.col);
    noStroke();
    beginShape();
    for (PVector v : vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
}
