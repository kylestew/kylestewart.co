
var points;
var pal;
var vectorScale;
var time;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("renderCanvas");

  frameRate(30);

  background(0, 5, 25);
  strokeWeight(0.66);
  smooth(8);
  noFill();

  // noiseSeed(1111); // sometimes we select one noise field

  // create our vector field
  // points from [-3,3] range
  points = [];
  for (var x = -3; x <= 3; x += 0.07) {
    for (var y = -3; y <= 3; y += 0.07) {
      // create point slightly distorted
      points.push(createVector(x + randomGaussian() * 0.003, y + randomGaussian() * 0.003));
    }
  }

  time = 0;
  vectorScale = 0.01;
  pal = [
    color(0, 91, 197, 18),
    color(0, 180, 252, 18),
    color(23, 249, 255, 18),
    color(223, 147, 0, 18),
    color(248, 190, 0, 18)
  ];
}

function draw() {
  var idx = 0;
  var p = points[0];
  for (var i = 0; i < points.length; i++) {
    var p = points[i];

    // map floating point coordinates to screen coordinates
    var xx = map(p.x, -6.5, 6.5, 0, width);
    var yy = map(p.y, -6.5, 6.5, 0, height);

    // select color from palette (index based on noise)
    var cn = (int)(100*pal.length*noise(idx))%pal.length;
    stroke(pal[cn]);
    point(xx, yy);

    // vector field calculations
    // v is the vector from the field
    var v = noisePainting(p);
    p.x += vectorScale * v.x;
    p.y += vectorScale * v.y;

    // goto the next point
    idx++;
  }

  time += 0.001;
}

function variant1(p) {
  // treat perlin noise as an angle
  var n = TWO_PI * noise(p.x, p.y);
  return createVector(cos(n), sin(n));
}
function variant2(p) {
  // treat perlin noise as an angle
  var n = 10 * map(noise(p.x/5, p.y/5), 0, 1, -2, 1);
  // var n = 100 * map(noise(p.x/5, p.y/5), 0, 1, -2, 1);
  // var n = 300 * map(noise(p.x/5, p.y/5), 0, 1, -1, 1);
  // var n = 1000 * map(noise(p.x/5, p.y/5), 0, 1, -2, 1);
  return createVector(cos(n), sin(n));
}
function variant3(p) {
  // treat perlin noise value as cartesian coordinate
  // all smeared at same angle
  // value used as length of vector
  var n = 5 * map(noise(p.x, p.y), 0, 1, -1, 1);
  // var n = 12 * map(noise(p.x, p.y), 0, 1, -1, 1);
  // var n = 1000 * map(noise(p.x/5, p.y/5), 0, 1, -2, 1);
  return createVector(n, n);
}
/* http://www.wolframalpha.com/widgets/view.jsp?id=4e37f43fcbe8be03c20f977f32e20d15 */
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

/* http://noize.surge.sh/ */
function noisePainting(p) {
  var n1 = 10 * noise(1 + p.x / 20, 1 + p.y / 20);
  var n2 = 5 * noise(n1, n2);
  var n3 = 325 * map(noise(n2, n2), 0, 1, -1, 1);

  // now pass through one of above functions
  return circle(n3);
}



/*https://gist.githubusercontent.com/tsulej/0d4677b5051aa6bb01fb600c32b154ee/raw/79e38ae17c17f3e7f7a47032a1450a6eb66ab840/nlinesvfield.pde */






/*
function windowResized() {
  resizeCanvas(windowWidth, windowHeight-4);
  init();
}

var props = {
  rad: 3.1415,
  backColor: "#00FF00",

  save: function() {
    var canvas = document.getElementById("renderCanvas"), ctx = canvas.getContext("2d");
    canvas.toBlob(function(blob) {
      saveAs(blob, "output.png");
    });
  },
}
window.onload = function() {
  var gui = new dat.GUI();

  gui.add(props, 'rad').min(0).max(3.1415*2).step(0.1);

  var style = gui.addFolder('Style');
  style.addColor(props, 'backColor');
  style.open();

  var actions = gui.addFolder('Actions');
  actions.add(props, 'save');
  actions.open();

  // any change will fire a redraw
  _.each(gui.__folders, function(folder) {
    if (folder.name != "Actions") { // don't rerender on action commands
      _.each(folder.__controllers, function(controller) {
        controller.onChange(function() {
          redraw();
        });
      });
    }
  });
};


function init() {
  // initialize frame dependent variables here
}

*/
