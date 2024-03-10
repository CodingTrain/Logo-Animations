const epsilon = 0.1;

function isTangent(c1, c2) {
  let d = c1.dist(c2);
  let r1 = c1.radius;
  let r2 = c2.radius;

  let a = abs(d - (r1 + r2)) < epsilon;
  let b = abs(d - abs(r2 - r1)) < epsilon;
  return a || b;
}

function validate(c4, c1, c2, c3, allCircles) {
  if (c4.radius < 2) return false;

  for (let other of allCircles) {
    let d = c4.dist(other);
    let radiusDiff = abs(c4.radius - other.radius);
    if (d < epsilon && radiusDiff < epsilon) {
      return false;
    }
  }

  // Check if all 4 circles are mututally tangential
  if (!isTangent(c4, c1)) return false;
  if (!isTangent(c4, c2)) return false;
  if (!isTangent(c4, c3)) return false;

  return true;
}

class Gasket {
  constructor(x, y, r, sw, color) {
    this.allCircles = [];
    this.queue = [];
    let c1 = new GasketCircle(-1 / r, x, y);
    let r2 = c1.radius / 4; // random(c1.radius / 4, c1.radius / 2);
    //console.log(c1);
    let v = p5.Vector.fromAngle(0); //random(TWO_PI));
    v.setMag(c1.radius - r2);
    let c2 = new GasketCircle(1 / r2, x + v.x, y + v.y);
    let r3 = v.mag();
    v.rotate(PI);
    v.setMag(c1.radius - r3);
    let c3 = new GasketCircle(1 / r3, x + v.x, y + v.y);
    this.allCircles = [c1, c2, c3];
    this.queue = [[c1, c2, c3]];
    this.color = color;
    this.recursed = false;
    this.startC = [c2, c3];
    this.sw = sw;

    let len = -1;
    while (this.allCircles.length !== len) {
      len = this.allCircles.length;
      this.nextGeneration();
    }
  }

  recurse() {
    if (this.recursed) return;
    this.recursed = true;
    let newGaskets = [];
    for (let i = 1; i < this.allCircles.length; i++) {
      let c = this.allCircles[i];
      if (c.radius < 4) continue;
      newGaskets.push(new Gasket(c.center.a, c.center.b, c.radius, this.sw / 16, this.color));
    }
    return newGaskets;
  }

  nextGeneration() {
    let nextQueue = [];
    for (let triplet of this.queue) {
      let [c1, c2, c3] = triplet;
      let k4 = descartes(c1, c2, c3);
      let newCircles = complexDescartes(c1, c2, c3, k4);
      for (let newCircle of newCircles) {
        if (validate(newCircle, c1, c2, c3, this.allCircles)) {
          this.allCircles.push(newCircle);
          let t1 = [c1, c2, newCircle];
          let t2 = [c1, c3, newCircle];
          let t3 = [c2, c3, newCircle];
          nextQueue = nextQueue.concat([t1, t2, t3]);
        }
      }
    }
    this.queue = nextQueue;
  }

  show() {
    for (let c of this.allCircles) {
      c.show(this.color, this.sw);
    }
  }
}

function complexDescartes(c1, c2, c3, k4) {
  let k1 = c1.bend;
  let k2 = c2.bend;
  let k3 = c3.bend;
  let z1 = c1.center;
  let z2 = c2.center;
  let z3 = c3.center;

  let zk1 = z1.scale(k1);
  let zk2 = z2.scale(k2);
  let zk3 = z3.scale(k3);
  let sum = zk1.add(zk2).add(zk3);

  let root = zk1.mult(zk2).add(zk2.mult(zk3)).add(zk1.mult(zk3));
  root = root.sqrt().scale(2);
  let center1 = sum.add(root).scale(1 / k4[0]);
  let center2 = sum.sub(root).scale(1 / k4[0]);
  let center3 = sum.add(root).scale(1 / k4[1]);
  let center4 = sum.sub(root).scale(1 / k4[1]);

  return [
    new GasketCircle(k4[0], center1.a, center1.b),
    new GasketCircle(k4[0], center2.a, center2.b),
    new GasketCircle(k4[1], center3.a, center3.b),
    new GasketCircle(k4[1], center4.a, center4.b),
  ];
}

function descartes(c1, c2, c3) {
  let k1 = c1.bend;
  let k2 = c2.bend;
  let k3 = c3.bend;

  let sum = k1 + k2 + k3;
  let product = abs(k1 * k2 + k2 * k3 + k1 * k3);
  let root = 2 * sqrt(product);
  return [sum + root, sum - root];
}

class GasketCircle {
  constructor(bend, x, y) {
    this.center = new Complex(x, y);
    this.bend = bend;
    this.radius = abs(1 / this.bend);
  }

  show(c, sw) {
    stroke(c);
    let sw2 = map(this.radius, 0, width / 2, 1, 36);
    strokeWeight(sw2);
    noFill();
    circle(this.center.a, this.center.b, this.radius * 2);
  }

  dist(other) {
    return dist(this.center.a, this.center.b, other.center.a, other.center.b);
  }
}
