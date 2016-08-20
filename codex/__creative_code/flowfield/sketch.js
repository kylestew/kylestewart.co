
var inc = 0.1;
var scl = 20;
var w, h;
var cols, rows;
var zoff = 0;

var particles = [];
var flowfield;

function init() {
  // initialize window size dependent variables here
  w = 640;
  h = 640;
  cols = floor(w / scl);
  rows = floor(h / scl);

  flowfield = new Array(cols * rows);

  for (var i = 0; i < 2000; i++) {
    particles[i] = new Particle();
  }

  background(255);
}

function draw() {
  if (stats) stats.begin();

  translate((width - w) / 2, (height - h) / 2);

  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var idx = x + y * cols;
      flowfield[idx] = p5.Vector.fromAngle(noise(xoff, yoff, zoff) * TWO_PI * 4);
      xoff += inc;

      // draw field
      // stroke(0);
      // strokeWeight(1);
      // push();
      // translate(x*scl, y*scl);
      // rotate(flowfield[idx].heading());
      // line(0, 0, scl, 0);
      // pop();
    }
    yoff += inc;
  }
  zoff += 0.01;

  for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].show();
  }

  if (stats) stats.end();
}


/* == GUI == */
var props = {
  rad: 100,
  backColor: "#00FF00",
}

function prepGUI() {
  var gui = new dat.GUI();

  gui.add(props, 'rad').min(0).max(1000);

  var style = gui.addFolder('Style');
  style.addColor(props, 'backColor');

  addSaveToGUI(gui, props);
  addStats();
};


/* == Boilerplate == */
function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("renderCanvas");
  smooth();
  frameRate(30);
  init();
  prepGUI();
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  init();
}
function addSaveToGUI(gui, props) {
  props.save = function() {
    var canvas = document.getElementById("renderCanvas"), ctx = canvas.getContext("2d");
    canvas.toBlob(function(blob) {
      saveAs(blob, "output.png");
    });
  };

  gui.add(props, 'save');
}
var stats;
function addStats() {
  // fps stats
  stats = new Stats();
  document.body.appendChild(stats.dom);
}
