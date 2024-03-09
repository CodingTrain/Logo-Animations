class Shape {
  constructor(x, y) {
    // let r = random(1);
    // this.position = createVector(0, 0);
    // if (r < 0.25) {
    //   this.position.x = -width / 2;
    //   this.position.y = random(-height / 2, height / 2);
    // } else if (r < 0.5) {
    //   this.position.x = width / 2;
    //   this.position.y = random(-height / 2, height / 2);
    // } else if (r < 0.75) {
    //   this.position.x = random(-width / 2, width / 2);
    //   this.position.y = -height / 2;
    // } else {
    //   this.position.x = random(-width / 2, width / 2);
    //   this.position.y = height / 2;
    // }
    this.position = createVector(x, y);
    this.home = createVector(x, y);
    this.angle = 0;
    this.homeAngle = 0;
    this.velocity = createVector();
    this.acceleration = createVector();

    this.r = 4.0;
    this.maxspeed = 4; // Maximum speed
    this.maxforce = 0.05; // Maximum steering force
  }

  run(boids) {
    this.flock(boids);
    this.update();
    this.borders();
    this.show();
  }

  // Method to update location
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // We accumulate a new acceleration each time based on three rules
  flock(boids) {
    let sep = this.separate(boids); // Separation
    let ali = this.align(boids); // Alignment
    let coh = this.cohere(boids); // Cohesion
    // Arbitrarily weight these forces
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
    let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
  }

  // Wraparound
  borders() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }

  // Separation
  // Method checks for nearby boids and steers away
  separate(boids) {
    let desiredSeparation = this.r * 4;
    let steer = createVector(0, 0);
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if (d > 0 && d < desiredSeparation) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.position, boids[i].position);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++; // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  align(boids) {
    let neighborDistance = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < neighborDistance) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  cohere(boids) {
    let neighborDistance = 50;
    let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position, boids[i].position);
      if (d > 0 && d < neighborDistance) {
        sum.add(boids[i].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // Steer towards the location
    } else {
      return createVector(0, 0);
    }
  }
}

class LineSegment extends Shape {
  constructor(x1, y1, x2, y2, strokeColor) {
    super(x1, y1);
    let x = (x1 + x2) * 0.5;
    let y = (y1 + y2) * 0.5;
    let v = createVector(x2 - x1, y2 - y1);
    this.homeAngle = v.heading();
    this.angle = v.heading();
    this.r = dist(x1, y1, x2, y2) / 2;
    this.home.x = x;
    this.home.y = y;
    this.position.x = x;
    this.position.y = y;
    this.strokeColor = strokeColor;

    this.lerpTimer = 100;
  }

  update() {
    super.update();
    this.lerpTimer--;
    if (this.lerpTime > 0) {
      this.angle = lerp(this.angle, this.velocity.heading(), 0.01);
    } else {
      this.angle = this.velocity.heading();
    }
  }
  show() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    stroke(this.strokeColor);
    line(-this.r, 0, this.r, 0);
    pop();
  }
}

class Circle extends Shape {
  constructor(x, y, radius, strokeColor) {
    super(x, y);
    this.r = radius;
    this.strokeColor = strokeColor;
  }

  show() {
    stroke(this.strokeColor);
    noFill();
    circle(this.position.x, this.position.y, this.r * 2);
  }
}
