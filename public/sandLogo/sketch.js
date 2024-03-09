let w = 4;
let logoPixels;
let palette;

// The grid
let grid;
// How big is each square?
let cols, rows;

let logoPNG;

function preload() {
  logoPNG = loadImage('logo.png');
}

// Check if a row is within the bounds
function withinCols(i) {
  return i >= 0 && i <= cols - 1;
}

// Check if a column is within the bounds
function withinRows(j) {
  return j >= 0 && j <= rows - 1;
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
    // Fill the array with 0s
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = { state: 0, color: color(0) };
    }
  }
  return arr;
}

function setup() {
  createCanvas(640, 640);
  palette = [
    color(11, 106, 136),
    color(25, 297, 244),
    color(112, 50, 126),
    color(146, 83, 161),
    color(164, 41, 99),
    color(236, 1, 90),
    color(240, 99, 164),
    color(241, 97, 100),
    color(248, 158, 79),
  ];
  cols = width / w;
  rows = height / w;
  fallRow = rows - 1;
  grid = make2DArray(cols, rows);
  logoPNG.resize(width, height);
  logoPixels = new PixelLogo(logoPNG.width, logoPNG.height, w);
  logoPixels.fillPixels(logoPNG);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let c = logoPixels.get(i, j);
      grid[i][j] = { state: 0, color: color(0) };
      // if (red(c) !== 255 || green(c) !== 255 || blue(c) !== 255) {
      //   grid[i][j] = { state: 1, color: logoPixels.get(i, j) };
      // } else {
      //   grid[i][j] = { state: 0, color: logoPixels.get(i, j) };
      // }
    }
  }
}

function mousePressed() {
  animationState = 1;
  fallAgain();
}

let animationState = 0;
function fallAgain() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let c = grid[i][j].color;
      if (red(c) !== 255 || green(c) !== 255 || blue(c) !== 255) {
        grid[i][j] = {
          state: 1,
          color: logoPixels.get(i, j),
        };
      } else {
        grid[i][j] = {
          state: 0,
          color: logoPixels.get(i, j),
        };
      }
    }
  }
}

function draw() {
  background(255);

  if (animationState == 0) {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let c = logoPixels.get(i, j);
        if (red(c) !== 255 || green(c) !== 255 || blue(c) !== 255) {
          if (random(1) < 0.1)
            grid[i][j] = { state: 1, color: logoPixels.get(i, j) };
        } else {
          if (random(1) < 0.1 && grid[i][j].state == 0)
            grid[i][j] = { state: 1, color: logoPixels.get(i, j) };
        }
      }
    }
  }

  let c = logoPixels.get();

  // Draw the sand
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      noStroke();
      if (grid[i][j].state !== 0) {
        fill(grid[i][j].color);
        let x = i * w;
        let y = j * w;
        square(x, y, w);
      }
    }
  }

  // Create a 2D array for the next frame of animation
  let nextGrid = make2DArray(cols, rows);

  // Check every cell
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // What is the state?
      let state = grid[i][j].state;
      let cell = grid[i][j];

      // If it's a piece of sand!
      if (state > 0) {
        // What is below?
        let belowState = 1;
        if (withinRows(j + 1)) {
          belowState = grid[i][j + 1].state;
        }

        // Randomly fall left or right
        let dir = 1;
        if (random(1) < 0.5) {
          dir *= -1;
        }

        // Check below left or right
        let belowA = 1;
        let belowB = 1;
        if (withinCols(i + dir) && withinRows(j + 1)) {
          belowA = grid[i + dir][j + 1].state;
        }
        if (withinCols(i - dir) && withinRows(j + 1)) {
          belowB = grid[i - dir][j + 1].state;
        }

        // Can it fall below or left or right?
        if (belowState === 0) {
          nextGrid[i][j + 1] = cell;
        } else if (belowA === 0) {
          nextGrid[i + dir][j + 1] = cell;
        } else if (belowB === 0) {
          nextGrid[i - dir][j + 1] = cell;
          // Stay put!
        } else {
          nextGrid[i][j] = cell;
        }
      }
    }
  }
  grid = nextGrid;
}
let count = 0;

async function postCanvasToServer(filename) {
  const canvas = document.querySelector('canvas');
  const base64Image = canvas.toDataURL();
  const data = {
    image: base64Image,
    filename,
  };
  const response = await fetch('/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  console.log(result);
}
