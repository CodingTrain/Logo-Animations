class PixelLogo {
  constructor(width, height, w) {
    this.width = width;
    this.height = height;
    this.cols = width / w;
    this.rows = height / w;
    this.w = w;
    this.grid = new Array(this.cols * this.rows);
  }

  getRow(y) {
    return this.grid.slice(y * this.cols, (y + 1) * this.cols);
  }

  getFirst() {
    for (let j = 0; j < this.rows; j++) {
      // calculate the average color of all pixels in the row
      let sumBrightness = 0;
      for (let i = 0; i < this.cols; i++) {
        let index = i + j * this.cols;
        sumBrightness += brightness(this.grid[index]);
      }
      let avgBrightness = sumBrightness / this.cols;
      console.log(avgBrightness);
      if (sumBrightness / this.cols < 99) {
        return this.getRow(j);
      }
    }
  }

  fillPixels(img) {
    img.loadPixels();
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        for (let i = 0; i < this.w; i++) {
          for (let j = 0; j < this.w; j++) {
            let index =
              (x * this.w + i + (y * this.w + j) * img.width) * 4;
            sumR += img.pixels[index];
            sumG += img.pixels[index + 1];
            sumB += img.pixels[index + 2];
          }
        }
        let avgR = sumR / (this.w * this.w);
        let avgG = sumG / (this.w * this.w);
        let avgB = sumB / (this.w * this.w);
        let index = x + y * this.cols;
        this.grid[index] = color(avgR, avgG, avgB);
      }
    }
  }

  get(i, j) {
    if (arguments.length < 2) {
      i = floor(random(this.cols));
      j = floor(random(this.rows));
    }
    return this.grid[i + j * this.cols];
  }

  drawPixels() {
    for (let i = 0; i < this.grid.length; i++) {
      let x = i % this.cols;
      let y = floor(i / this.cols);
      let c = this.grid[i];
      fill(c);
      noStroke();
      square(x * this.w, y * this.w, this.w);

      // if (x == 0) {
      //   fill(0);
      //   textSize(this.w * 2);
      //   text(y, 10, y * this.w + this.w / 2);
      // }
    }
  }
}
