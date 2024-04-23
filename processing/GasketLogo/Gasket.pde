// Constants and Helper Functions
final float epsilon = 10;

boolean isTangent(GasketCircle c1, GasketCircle c2) {
  float d = c1.gdist(c2);
  float r1 = c1.radius;
  float r2 = c2.radius;

  return abs(d - (r1 + r2)) < epsilon || abs(d - abs(r2 - r1)) < epsilon;
}

boolean validate(GasketCircle c4, GasketCircle c1, GasketCircle c2, GasketCircle c3, ArrayList<GasketCircle> allCircles) {
  if (c4.radius < 1) return false;

  for (GasketCircle other : allCircles) {
    float d = c4.gdist(other);
    if (d < epsilon && abs(c4.radius - other.radius) < epsilon) return false;
  }

  return isTangent(c4, c1) && isTangent(c4, c2) && isTangent(c4, c3);
}


float[] descartes(GasketCircle c1, GasketCircle c2, GasketCircle c3) {
  float k1 = c1.bend, k2 = c2.bend, k3 = c3.bend;
  float sum = k1 + k2 + k3;
  float product = abs(k1 * k2 + k2 * k3 + k1 * k3);
  float root = 2 * sqrt(product);
  return new float[]{sum + root, sum - root};
}

ArrayList<GasketCircle> complexDescartes(GasketCircle c1, GasketCircle c2, GasketCircle c3, float[] k4) {
  float k1 = c1.bend;
  float k2 = c2.bend;
  float k3 = c3.bend;
  Complex z1 = c1.center;
  Complex z2 = c2.center;
  Complex z3 = c3.center;

  Complex zk1 = z1.scale(k1);
  Complex zk2 = z2.scale(k2);
  Complex zk3 = z3.scale(k3);
  Complex sum = zk1.add(zk2).add(zk3);

  Complex root = zk1.mult(zk2).add(zk2.mult(zk3)).add(zk1.mult(zk3));
  root = root.csqrt().scale(2);
  Complex center1 = sum.add(root).scale(1 / k4[0]);
  Complex center2 = sum.sub(root).scale(1 / k4[0]);
  Complex center3 = sum.add(root).scale(1 / k4[1]);
  Complex center4 = sum.sub(root).scale(1 / k4[1]);

  ArrayList<GasketCircle> newCircles = new ArrayList<GasketCircle>();
  newCircles.add(new GasketCircle(k4[0], center1.a, center1.b));
  newCircles.add(new GasketCircle(k4[0], center2.a, center2.b));
  newCircles.add(new GasketCircle(k4[1], center3.a, center3.b));
  newCircles.add(new GasketCircle(k4[1], center4.a, center4.b));
  return newCircles;
}



class Gasket {
  ArrayList<GasketCircle> allCircles;
  ArrayList<GasketCircle[]> queue;
  boolean recursed = false;
  float sw;
  int col;

  Gasket(float x, float y, float r, int col) {
    this.allCircles = new ArrayList<GasketCircle>();
    this.queue = new ArrayList<GasketCircle[]>();
    this.col = col;

    // Initial circle generation
    GasketCircle c1 = new GasketCircle(-1 / r, x, y);
    float r2 = c1.radius / 4; // Simulating p5.Vector functionality
    PVector v = PVector.fromAngle(0); // Assuming PVector.fromAngle(0) equivalent exists
    v.setMag(c1.radius - r2);
    GasketCircle c2 = new GasketCircle(1 / r2, x + v.x, y + v.y);
    float r3 = v.mag();
    v.rotate(PI);
    v.setMag(c1.radius - r3);
    GasketCircle c3 = new GasketCircle(1 / r3, x + v.x, y + v.y);

    this.allCircles.add(c1);
    this.allCircles.add(c2);
    this.allCircles.add(c3);
    this.queue.add(new GasketCircle[]{c1, c2, c3});

    int len = -1;
    while (this.allCircles.size() != len) {
      len = this.allCircles.size();
      this.nextGeneration();
    }
  }

  ArrayList<Gasket> recurse() {
    if (this.recursed) return new ArrayList<Gasket>();
    this.recursed = true;
    ArrayList<Gasket> newGaskets = new ArrayList<Gasket>();
    for (int i = 1; i < this.allCircles.size(); i++) {
      GasketCircle c = this.allCircles.get(i);
      if (c.radius < 4) continue;
      newGaskets.add(new Gasket(c.center.a, c.center.b, c.radius, this.col));
    }
    return newGaskets;
  }

  void nextGeneration() {
    ArrayList<GasketCircle[]> nextQueue = new ArrayList<GasketCircle[]>();
    for (GasketCircle[] triplet : this.queue) {
      GasketCircle c1 = triplet[0], c2 = triplet[1], c3 = triplet[2];
      float[] k4 = descartes(c1, c2, c3);
      ArrayList<GasketCircle> newCircles = complexDescartes(c1, c2, c3, k4);
      for (GasketCircle newCircle : newCircles) {
        boolean v = validate(newCircle, c1, c2, c3, this.allCircles);
        if (v) {
          this.allCircles.add(newCircle);
          nextQueue.add(new GasketCircle[]{c1, c2, newCircle});
          nextQueue.add(new GasketCircle[]{c1, c3, newCircle});
          nextQueue.add(new GasketCircle[]{c2, c3, newCircle});
        }
      }
    }
    this.queue = nextQueue;
  }

  void show() {
    for (int i = 0; i < this.allCircles.size(); i++) {
      GasketCircle c = this.allCircles.get(i);
      c.show(this.col);
    }
    //for (GasketCircle c : this.allCircles) {
    //  c.show(this.col);
    //}
  }
}
