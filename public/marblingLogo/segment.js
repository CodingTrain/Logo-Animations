class Shape {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.detail = 10;
    this.vertices = [];
  }

  // Apply displacement from another drop
  // https://people.csail.mit.edu/jaffer/Marbling/Dropping-Paint
  marble(other) {
    for (let v of this.vertices) {
      let c = other.center;
      let r = other.r;
      let p = v.copy();
      p.sub(c);
      let m = p.mag();
      let root = sqrt(1 + (r * r) / (m * m));
      p.mult(root);
      p.add(c);
      v.set(p);
    }
  }

  show() {
    noFill();
    strokeWeight(data.strokeWeight * logoScale);
    stroke(this.strokeColor);
    beginShape();
    for (let v of this.vertices) {
      vertex(v.x, v.y);
    }
    endShape();
  }
}

class LineSegment extends Shape {
  constructor(x1, y1, x2, y2, strokeColor) {
    super(x1, y1);
    this.strokeColor = strokeColor;
    let v1 = createVector(x1, y1);
    let v2 = createVector(x2, y2);
    this.detail = 10;

    for (let i = 0; i <= this.detail; i++) {
      let t = i / this.detail;
      let p = p5.Vector.lerp(v1, v2, t);
      this.vertices.push(p);
    }
  }
}

class Circle extends Shape {
  constructor(x, y, radius, strokeColor) {
    super(x, y);
    this.radius = radius;
    this.strokeColor = strokeColor;
    this.detail = this.radius;

    for (let i = 0; i < this.detail; i++) {
      let a = map(i, 0, this.detail, 0, TWO_PI);
      let x = this.position.x + cos(a) * this.radius;
      let y = this.position.y + sin(a) * this.radius;
      this.vertices.push(createVector(x, y));
    }
  }

  // Just duplicating this for CLOSE
  show() {
    strokeWeight(data.strokeWeight * logoScale);
    noFill();
    stroke(this.strokeColor);
    beginShape();
    for (let v of this.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
}
