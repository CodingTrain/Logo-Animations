const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

const { strokeWeight, shapes } = data;

// find the maximum x,y values and minimum x,y values in all the shapes
let maxX = 0;
let maxY = 0;
let minX = Infinity;
let minY = Infinity;

shapes.forEach((shape) => {
  if (shape.type === 'line') {
    maxX = Math.max(maxX, shape.x1, shape.x2);
    maxY = Math.max(maxY, shape.y1, shape.y2);
    minX = Math.min(minX, shape.x1, shape.x2);
    minY = Math.min(minY, shape.y1, shape.y2);
  } else if (shape.type === 'circle') {
    maxX = Math.max(maxX, shape.x + shape.r);
    maxY = Math.max(maxY, shape.y + shape.r);
    minX = Math.min(minX, shape.x - shape.r);
    minY = Math.min(minY, shape.y - shape.r);
  }
});

// find center of min and max
const centerX = (minX + maxX) / 2;
const centerY = (minY + maxY) / 2;

// re-orient all shapes around the center
shapes.forEach((shape) => {
  if (shape.type === 'line') {
    shape.x1 -= centerX;
    shape.x2 -= centerX;
    shape.y1 -= centerY;
    shape.y2 -= centerY;
  } else if (shape.type === 'circle') {
    shape.x -= centerX;
    shape.y -= centerY;
  }
});

// save back out revised JSON
fs.writeFileSync('./logo.json', JSON.stringify(data, null, 2));
