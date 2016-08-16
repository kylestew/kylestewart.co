
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
    color(0, 91, 197),
    color(0, 180, 252),
    color(23, 249, 255),
    color(223, 147, 0),
    color(248, 190, 0)
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
    stroke(pal[cn], 15);
    point(xx, yy);

    // vector field calculations
    // v is the vector from the field
    var v = variant1(p);
    p.x += vectorScale * v.x;
    p.y += vectorScale * v.y;

    // goto the next point
    idx++;
  }

  time += 0.001;
}

function variant1(p) {
  var n = TWO_PI * noise(p.x, p.y);
  return createVector(cos(n), sin(n));
}












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
