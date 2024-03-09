let cells = [];
let history = [];
let ruleSet;
let w = 10;

let startRule = 90;

let ruleCollection = [235, 30, 110, 90, 110, 90, 30, 57, 62, 75, 22];
let logoPixels;

let otherOptions = [];

let logoPNG;
function preload() {
  logoPNG = loadImage('logo.png');
}

function setRules(ruleValue) {
  ruleSet = ruleValue.toString(2);
  while (ruleSet.length < 8) {
    ruleSet = '0' + ruleSet;
  }
}

function setup() {
  createCanvas(1920, 8000);
  setRules(startRule);
  otherOptions = [
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

  logoPNG.resize(width, height);
  logoPixels = new PixelLogo(logoPNG.width, logoPNG.height, w);
  logoPixels.fillPixels(logoPNG);

  //let row = logoPixels.getRow(0);
  let firstRow = logoPixels.getFirst();
  let total = width / w;
  for (let i = 0; i < total; i++) {
    cells[i] = firstRow[i];
  }
  background(255);
}

async function draw() {
  history.push(cells);

  if (random(1) < 0.01) {
    let nextRule = random(ruleCollection);
    console.log(nextRule);
    setRules(nextRule);
    // startRule++;
    // console.log(startRule);
    // setRules(startRule);
  }

  let cols = height / w;
  if (history.length > cols) {
    // history.splice(0, 1);
    noLoop();
  }

  let y = 0;
  for (let cells of history) {
    for (let i = 0; i < cells.length; i++) {
      let x = i * w;
      noStroke();
      fill(cells[i]);
      square(x, height - y - w, w);
    }
    y += w;
  }

  let nextCells = [];
  let len = cells.length;
  for (let i = 0; i < cells.length; i++) {
    let leftColor = cells[(i - 1 + len) % len];
    let rightColor = cells[(i + 1 + len) % len];
    let stateColor = cells[i];
    let left = brightness(leftColor) < 100 ? 1 : 0;
    let right = brightness(rightColor) < 100 ? 1 : 0;
    let state = brightness(stateColor) < 100 ? 1 : 0;
    let newState = calculateState(left, state, right);
    if (newState == 0) {
      nextCells[i] = color(255);
      if (random(1) < 0.01) {
        nextCells[i] = random(otherOptions);
      }
    } else {
      let options = [];
      if (left == 1) options.push(leftColor);
      if (right == 1) options.push(rightColor);
      if (state == 1) options.push(stateColor);
      if (options.length < 1) nextCells[i] = random(otherOptions);
      else nextCells[i] = random(options);
    }
  }

  cells = nextCells;

  // Call the postCanvasToServer function with the desired filename
  count++;
  // logoPixels.drawPixels();
  // await postCanvasToServer(`wolframLogo-${nf(count, 3, 0)}-test.png`);
  // noLoop();
}
let count = 0;

function calculateState(a, b, c) {
  let neighborhood = '' + a + b + c;
  // console.log(neighborhood);
  let value = 7 - parseInt(neighborhood, 2);
  return parseInt(ruleSet[value]);
}

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
