JSONArray shapes;
ArrayList<Shape> shapeObjects = new ArrayList<Shape>();
ArrayList<Drop> drops = new ArrayList<Drop>();
int logoScale = 4;
Animator animator;
color[] palette = {
  color(11, 106, 136), color(45, 197, 244), color(112, 50, 126), color(146, 83, 161),
  color(164, 41, 99), color(236, 1, 90), color(240, 99, 164), color(241, 97, 100),
  color(248, 158, 79), color(252, 238, 33)
};

void setup() {
  size(1920, 1080);
  JSONObject data = loadJSONObject("logo.json");
  JSONArray jsonShapes = data.getJSONArray("shapes");
  for (int i = 0; i < jsonShapes.size(); i++) {
    JSONObject shape = jsonShapes.getJSONObject(i);
    String type = shape.getString("type");
    String colorHex = shape.getString("color").substring(1); // Remove the '#' character
    int colorValue = unhex("FF" + colorHex); // Add 'FF' for full opacity and convert

    if (type.equals("line")) {
      shapeObjects.add(new LineSegment(
        shape.getFloat("x1") * logoScale, shape.getFloat("y1") * logoScale,
        shape.getFloat("x2") * logoScale, shape.getFloat("y2") * logoScale,
        colorValue
        ));
    } else if (type.equals("circle")) {
      shapeObjects.add(new Circle(
        shape.getFloat("x") * logoScale, shape.getFloat("y") * logoScale,
        shape.getFloat("r") * logoScale, colorValue
        ));
    }
  }
  float x = 0;//random(width)-width/2;
  float y = 0;//random(height)-height/2;
  animator = new Animator(x, y, 5, palette[9]); // Correct way to pick a random element from an array in Processing
}


void newInkFunction(float x, float y, float r, color col) {
  Drop drop = new Drop(x, y, r, col);
  for (Drop other : drops) {
    other.marble(drop);
  }
  for (Shape shape : shapeObjects) {
    shape.marble(drop);
  }
  drops.add(drop);
}

void draw() {
  newInkFunction(animator.x, animator.y, 36, animator.col);
  animator.update(); // Update animator state
  background(255);
  translate(width / 2, height / 2);
  for (Shape shape : shapeObjects) {
    shape.show();
  }
  for (Drop drop : drops) {
    drop.show();
  }

  saveFrame("render/render-####.png");
}
