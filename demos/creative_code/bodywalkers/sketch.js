
var points;
var drawWidth, drawHeight;
var time;

var FRAME_RATE = 30;
// var FORCE_REDUCE = 0.1;

var shapeParams = {
  circle: {
    orientation: 0,
    n1: 1,
    n2: 1,
    n3: 1,
    m: 0
  },
  triangle: {
    orientation: Math.PI/3,
    n1: 0.5,
    n2: 0.5,
    n3: 0.5,
    m: 3
  },
  fat_star: {
    orientation: Math.PI,
    n1: 1,
    n2: 1,
    n3: 1,
    m: 5
  },
  skiny_star: {
    orientation: Math.PI,
    n1: 0.4,
    n2: 0.4,
    n3: 0.4,
    m: 5
  },
  plus_star: {
    orientation: 0,
    n1: 0.4,
    n2: 0.4,
    n3: 0.4,
    m: 4
  },
  diamond: {
    orientation: Math.PI,
    n1: 1,
    n2: 1,
    n3: 1,
    m: 4
  },
  eye: {
    orientation: Math.PI/2,
    n1: 0.4,
    n2: 0.4,
    n3: 0.4,
    m: 2
  },
  bob: {
    orientation: Math.PI/2,
    n1: 0.5,
    n2: 0.5,
    n3: 16,
    m: 16
  },
}

var params = {
  shape: "triangle",

  pointCount: 500,
  pointWeight: 0.66,

  backColor: '#000000',
  color0: '#88b1be',
  // color1:
  // color2:

  reset: function() {
    init()
  },
};
function setupGUI() {
  var gui = new dat.GUI();


// use underscore to boil down shapes
// shapes = [
//   "circle",
//   "triangle",
//   "fat_star",
//   "skiny_star",
//   "plus_star",
//   "diamond",
//   "eye",
//   "bob"
// ];
  gui.add(params, 'shape', shapes);

  gui.add(params, 'pointCount').min(10).max(1000).step(1);

  var style = gui.addFolder('Style');
  style.addColor(params, 'backColor');

  gui.add(params, 'reset');

  addSaveToGUI(gui, params);
}

/* Thanks to Paul Bourke
   http://paulbourke.net/geometry/supershape/index.html
*/
function superformula(phi, a, b) {
  var n1 = params.shape.n1;
  var n2 = params.shape.n2;
  var n3 = params.shape.n3;
  var m = params.shape.m;

  var t1 = cos(m * phi / 4) / a;
  t1 = abs(t1);
  t1 = pow(t1, n2);

  var t2 = sin(m * phi / 4) / b;
  t2 = abs(t2);
  t2 = pow(t2,n3);

  var r = pow(t1 + t2, 1 / n1);

  if (abs(r) == 0) {
    return 0;
  }
  return 1 / r;
}

function init() {
  background(params.backColor);
  strokeWeight(params.pointWeight);
  noFill();

  // make centered draw square with borders - for dramatic effect
  if (width > height) {
    drawHeight = floor(height * 0.6);
    drawWidth = drawHeight;
  } else {
    drawWidth = floor(width * 0.6);
    drawHeight = drawWidth;
  }

  // reset
  time = 0;

  // generate shape using selected superformula
  points = [];
  var rad = drawWidth / 2;
  for (var i = 0; i < params.pointCount; i++) {
    var phi = map(i, 0, params.pointCount, 0, TWO_PI);
    var r = superformula(phi, rad, rad);
    var x = r * sin(phi);
    var y = r * cos(phi);
    points.push(createVector(x, y));
  }
}

function draw() {
  stats.begin();

  // center drawing
  translate(width / 2, height / 2);
  rotate(params.shape.orientation);

  beginShape();
  for (var i = 0; i < points.length; i++) {
    var p = points[i];

// TODO: colors
  //   // select color from palette (index based on noise)
  //   var cn = (int)(100*pal.length*noise(idx))%pal.length;
  //   stroke(pal[cn]);

    // draw point
    stroke(params.color0);
    vertex(p.x, p.y);

    // apply noise
    // TODO: apply alpha
    // TODO: lines for prev position - not points
    // p.x += 12.8 * (noise(p.x, p.y, time) - 0.5);
    // p.y += 20.0 * (noise(p.x, p.y, time) - 0.5);
  }
  endShape(CLOSE);

  time += 0.001;
  stats.end();
}



/* == BOILERPLATE ==*/
var stats;
function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("renderCanvas"); // for image saver
  frameRate(FRAME_RATE);
  smooth();

  stats = new Stats();
  document.body.appendChild(stats.dom);

  setupGUI();
  init();
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  init();
}
function addSaveToGUI(gui, params) {
  params.save = function() {
    var canvas = document.getElementById("renderCanvas"), ctx = canvas.getContext("2d");
    canvas.toBlob(function(blob) {
      saveAs(blob, "output.png");
    });
  };
  gui.add(params, 'save');
}
