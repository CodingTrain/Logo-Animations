class Animator {
  float x, y; // Position
  int max;    // Maximum counter value
  int counter; // Current counter value
  color col;  // Current color

  Animator(float x, float y, int max, color col) {
    this.x = x;
    this.y = y;
    this.max = max;
    this.counter = 0;
    this.col = col;
  }

  void update() {
    counter++;
    if (counter > max) {
      reset();
    }
  }

  void reset() {
    counter = 0;

    float r = random(1);
    if (r < 0.5) {
      max = floor(random(1, 5));
    } else {
      max = floor(random(1, 30));
    }

    x = random(width) - width / 2;
    y = random(height) - height / 2;
    col = palette[(int) random(palette.length)]; // Randomly select a new color from global palette
  }
}
