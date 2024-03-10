ArrayList<Shape> shapes = new ArrayList<Shape>();
JSONObject data; // Assuming you've loaded this somehow in setup or before
float logoScale = 12;
ArrayList<Gasket> gaskets = new ArrayList<Gasket>();

float logoSW;

void setup() {
  size(15000, 15000);
  randomSeed(10);
  logoScale = map(width, 400, 800, 6, 12);

  data = loadJSONObject("logo.json");
  logoSW = data.getFloat("strokeWeight");

  JSONArray shapesData = data.getJSONArray("shapes");
  for (int i = 0; i < shapesData.size(); i++) {
    JSONObject shape = shapesData.getJSONObject(i);
    String type = shape.getString("type");
    String hexColor = shape.getString("color");
    int r = unhex(hexColor.substring(1, 3));
    int g = unhex(hexColor.substring(3, 5));
    int b = unhex(hexColor.substring(5, 7));
    int colorValue = color(r, g, b);
    if (type.equals("line")) {
      shapes.add(new LineSegment(
        shape.getFloat("x1") * logoScale,
        shape.getFloat("y1") * logoScale,
        shape.getFloat("x2") * logoScale,
        shape.getFloat("y2") * logoScale,
        color(colorValue)
        ));
    } else if (type.equals("circle")) {
      shapes.add(new Circle(
        shape.getFloat("x") * logoScale,
        shape.getFloat("y") * logoScale,
        shape.getFloat("r") * logoScale,
        color(colorValue) // Adjust color parsing as needed
        ));
      //float rw = (logoSW * logoScale) / 2;
      float rw = map( shape.getFloat("r"), 0, width / 2, 1, 36);

      gaskets.add(new Gasket(
        shape.getFloat("x") * logoScale,
        shape.getFloat("y") * logoScale,
        shape.getFloat("r") * logoScale,
        color(colorValue)
        ));
    }
  }

  for (int n = 0; n < 10; n++) {
    int initialSize = gaskets.size();
    for (int i = initialSize - 1; i >= 0; i--) {
      ArrayList<Gasket> nextG = gaskets.get(i).recurse();
      gaskets.addAll(nextG);
    }
  }
}

void draw() {
  background(255);
  translate(width / 2, height / 2);
  scale(1);
  for (Shape shape : shapes) {
    shape.show();
  }

  for (Gasket gasket : gaskets) {
    gasket.show();
  }
  saveFrame("render.png");
  exit();
  noLoop();
}
