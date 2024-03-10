class Complex {
  float a, b;

  Complex(float a, float b) {
    this.a = a;
    this.b = b;
  }

  Complex add(Complex other) {
    return new Complex(this.a + other.a, this.b + other.b);
  }

  Complex sub(Complex other) {
    return new Complex(this.a - other.a, this.b - other.b);
  }

  Complex scale(float value) {
    return new Complex(this.a * value, this.b * value);
  }

  Complex mult(Complex other) {
    float a = this.a * other.a - this.b * other.b;
    float b = this.a * other.b + other.a * this.b;
    return new Complex(a, b);
  }

  Complex csqrt() {
    float m = sqrt(this.a * this.a + this.b * this.b);
    float angle = atan2(this.b, this.a);
    m = sqrt(m);
    angle = angle / 2;
    return new Complex(m * cos(angle), m * sin(angle));
  }
}
