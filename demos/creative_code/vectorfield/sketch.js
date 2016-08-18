
var points;
var drawWidth, drawHeight;
var time;
var fieldFunc;

var FRAME_RATE = 30;
var FORCE_REDUCE = 0.1;

var fieldFunctions = {
  perlin: function(p) {
    var n = TWO_PI * noise(p.x, p.y, time);
    return createVector(cos(n), sin(n));
  },
  variant1: function(p) {
    var n = TWO_PI * noise(p.x, p.y);
    return createVector(cos(n), sin(n));
  },
  variant2: function(p) {
    var n = 10 * map(noise(p.x/5, p.y/5), 0, 1, -2, 1);
    return createVector(cos(n), sin(n));
  }
};

var params = {
  pointCount: 10000,
  fieldFunction: fieldFunctions.perlin,
  forceScale: 0.3,
  speed: 0.01,

  backColor: '#f0f0f0',
  //   color(0, 91, 197, 18),
  //   color(0, 180, 252, 18),
  //   color(23, 249, 255, 18),
  //   color(223, 147, 0, 18),
  //   color(248, 190, 0, 18)

  reset: function() {
    init()
  },
};
function setupGUI() {
  var gui = new dat.GUI();

  gui.add(params, 'pointCount').min(1000).max(20000).step(100);
  gui.add(params, 'fieldFunction', fieldFunctions).onChange(function(val) {
    // remove first & last line
    val = val.split('\n').slice(1, -1).join("");
    fieldFunc = new Function("p", val);
  });
  fieldFunc = params.fieldFunction; // set initially
  gui.add(params, 'forceScale').min(0).max(1);
  gui.add(params, 'speed').min(0).max(0.1);

  var style = gui.addFolder('Style');
  style.addColor(params, 'backColor');

  gui.add(params, 'reset');

  addSaveToGUI(gui, params);
}

function init() {
  background(params.backColor);
  strokeWeight(0.66);
  noFill();

  // make centered draw square with borders - for dramatic effect
  // bound to 80% of smallest dimension
  if (width > height) {
    drawHeight = floor(height * 0.4);
    drawWidth = drawHeight;
  } else {
    drawWidth = floor(width * 0.4);
    drawHeight = drawWidth;
  }

  // reset
  time = 0;

  // generate field of points [-1,1] range
  points = [];
  var size = floor(sqrt(params.pointCount));
  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      // scale x, y to [-1, 1] range
      var xx = map(x, 0, size, -1, 1);
      var yy = map(y, 0, size, -1, 1);

      // create point slightly distorted
      points.push(createVector(xx + randomGaussian() * 0.003, yy + randomGaussian() * 0.003));
    }
  }
}

function draw() {
  stats.begin();

  // center drawing
  translate((width - drawWidth) / 2, (height - drawHeight) / 2);

  for (var i = 0; i < points.length; i++) {
    var p = points[i];

    // map floating point coordinates to screen coordinates
    var xx = map(p.x, -1, 1, 0, drawWidth);
    var yy = map(p.y, -1, 1, 0, drawHeight);

// TODO: colors
  //   // select color from palette (index based on noise)
  //   var cn = (int)(100*pal.length*noise(idx))%pal.length;
  //   stroke(pal[cn]);

    // draw point
    stroke(12,12,12,08);
    point(xx, yy);

    // apply selected vector field
    var v = fieldFunc(p);

    // apply force - draws update position next frame
    p.x += params.forceScale * FORCE_REDUCE * v.x;
    p.y += params.forceScale * FORCE_REDUCE * v.y;
  }

  // time += params.speed;
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



/*
function variant3(p) {
  // treat perlin noise value as cartesian coordinate
  // all smeared at same angle
  // value used as length of vector
  var n = 5 * map(noise(p.x, p.y), 0, 1, -1, 1);
  // var n = 12 * map(noise(p.x, p.y), 0, 1, -1, 1);
  // var n = 1000 * map(noise(p.x/5, p.y/5), 0, 1, -2, 1);
  return createVector(n, n);
}
*/
/* http://www.wolframalpha.com/widgets/view.jsp?id=4e37f43fcbe8be03c20f977f32e20d15 */
/*
function astroid(p) {
  // var n = 5 * map(noise(p.x, p.y), 0, 1, -1, 1);
  var n = 2 * map(noise(p.x, p.y), 0, 1, -1, 1);

  var sinn = sin(n);
  var cosn = cos(n);

  var xt = sq(sinn) * sinn;
  var yt = sq(cosn) * cosn;

  return createVector(xt, yt);
}
function cissoid(p) {
  var n = 3*map(noise(p.x,p.y),0,1,-1,1);

  var sinn2 = 2*sq(sin(n));

  var xt = sinn2;
  var yt = sinn2*tan(n);

  return createVector(xt, yt);
}
function kampyle(p) {
  var n = 6*map(noise(p.x,p.y),0,1,-1,1);

  var sec = 1/sin(n);

  var xt = sec;
  var yt = tan(n)*sec;

  return createVector(xt,yt);
}
function rectangularHyperbola(p) {
  var n = 10 * map(noise(p.x,p.y),0,1,-1,1);

  var xt = 1/sin(n);
  var yt = tan(n);

  return createVector(xt,yt);
}
function quadrifolium(p) {
  var n = 1 * map(noise(p.x,p.y),0,1,-1,1);

  var xt = sin(2 * n) * cos(n);
  var yt = sin(n) * sin(2 * n);

  return createVector(xt,yt);
}
function malteseCross(p) {
  var n = 4 * map(noise(p.x,p.y),0,1,-1,1);

  var xt = (2 * cos(n)) / sqrt(sin(4 * n));
  var yt = (2 * sin(n)) / sqrt(sin(4 * n));

  return createVector(xt,yt);
}
function circle(n) {
  return createVector(cos(n), sin(n));
}

// http://noize.surge.sh/
function noisePainting(p) {
  var n1 = 10 * noise(1 + p.x / 20, 1 + p.y / 20);
  var n2 = 5 * noise(n1, n2);
  var n3 = 325 * map(noise(n2, n2), 0, 1, -1, 1);

  // now pass through one of above functions
  return circle(n3);
}
*/
/*https://gist.githubusercontent.com/tsulej/0d4677b5051aa6bb01fb600c32b154ee/raw/79e38ae17c17f3e7f7a47032a1450a6eb66ab840/nlinesvfield.pde */
