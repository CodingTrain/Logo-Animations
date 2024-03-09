let points = [];

let delaunay, voronoi;

let logo_bw, logo_rgb;

let state = 1;

let lerpAmt = 0.001;

function preload() {
  logo_bw = loadImage('logo-bw.png');
  logo_rgb = loadImage('logo.png');
}

function setup() {
  createCanvas(1920, 1080);
  for (let i = 0; i < 2000; i++) {
    let x = random(width);
    let y = random(height);
    let bw = logo_bw.get(x, y);
    let col = logo_rgb.get(x, y);
    if (brightness(bw) < 10) {
      let v = createVector(x, y);
      v.col = col;
      v.sw = 4;
      points.push(v);
    } else {
      i--;
    }
  }

  //delaunay = calculateDelaunay(points);
  //voronoi = delaunay.voronoi([0, 0, width, height]);
  //noLoop();
}

function keyPressed() {
  if (key == ' ') {
    state = 0;
  }
}

function draw() {
  background(255);

  //image(gloria, 0, 0);

  // if (points.length < 2000) {
  //   for (let i = 0; i < 50; i++) {
  //     let x = random(width);
  //     let y = random(height);
  //     let col = gloria.get(x, y);
  //     if (col[1] < 200) {
  //       let v = createVector(x, y);
  //       v.col = col;
  //       points.push(v);
  //     } else {
  //       i--;
  //     }
  //   }
  // }
  for (let v of points) {
    let col = logo_rgb.get(v.x, v.y);
    let bw = logo_bw.get(v.x, v.y);
    if (state == 1) {
      v.col = lerpA(v.col, col, 1);
      let sw = map(brightness(bw), 0, 100, 12, 4);
      v.sw = lerp(v.sw, sw, 0.1);
    } else {
      v.sw = lerp(v.sw, 4, 0.01);
      //v.col = lerpA(v.col, col, 0.1);
    }
    stroke(v.col);
    strokeWeight(v.sw);
    point(v.x, v.y);
  }

  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);

  let polygons = voronoi.cellPolygons();
  let cells = Array.from(polygons);

  let centroids = new Array(cells.length);
  let weights = new Array(cells.length).fill(0);
  for (let i = 0; i < centroids.length; i++) {
    centroids[i] = createVector(0, 0);
  }

  for (let i = 0; i < cells.length; i++) {
    let poly = cells[i];
    strokeWeight(0.5);
    let col = points[i].col;
    stroke(0);
    noStroke();
    stroke(col[0], col[1], col[2], 100);
    fill(col[0], col[1], col[2], 50);
    beginShape();
    for (let i = 0; i < poly.length; i++) {
      vertex(poly[i][0], poly[i][1]);
    }
    endShape();
  }

  logo_bw.loadPixels();
  let delaunayIndex = 0;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let index = (i + j * width) * 4;
      let r = logo_bw.pixels[index + 0];
      let g = logo_bw.pixels[index + 1];
      let b = logo_bw.pixels[index + 2];
      let bright = (r + g + b) / 3;
      let weight = 1; //
      if (state == 1) {
        weight = 1 - bright / 255;
      }
      delaunayIndex = delaunay.find(i, j, delaunayIndex);
      centroids[delaunayIndex].x += i * weight;
      centroids[delaunayIndex].y += j * weight;
      weights[delaunayIndex] += weight;
    }
  }

  for (let i = 0; i < centroids.length; i++) {
    if (weights[i] > 0) {
      centroids[i].div(weights[i]);
    } else {
      centroids[i] = points[i].copy();
    }
  }

  for (let i = 0; i < points.length; i++) {
    if (state == 0) {
      points[i].lerp(centroids[i], lerpAmt);
    } else {
      points[i].lerp(centroids[i], 1);
    }
  }

  lerpAmt += 0.004;
  if (lerpAmt > 1) {
    lerpAmt = 1;
  }

  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);

  if (state == 0) {
    save('render' + frameCount + '.png');
  }
}

function calculateDelaunay(points) {
  let pointsArray = [];
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}

function lerpA(a1, a2, amt) {
  let a = new Array(a1.length);
  for (let i = 0; i < a.length; i++) {
    a[i] = lerp(a1[i], a2[i], amt);
  }
  return a;
}
