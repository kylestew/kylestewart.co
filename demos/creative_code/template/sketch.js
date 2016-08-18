
var FRAME_RATE = 30;

/* == GUI == */
var params = {
  rad: 100,
  backColor: "#00FF00",
}
function setupGUI() {
  var gui = new dat.GUI();

  gui.add(params, 'rad').min(0).max(1000);

  var style = gui.addFolder('Style');
  style.addColor(params, 'backColor');

  addSaveToGUI(gui, params);
};

function init() {
  // initialize window size dependent variables here
}

function draw() {
  background(color(params.backColor));
  ellipse(width/2, height/2, params.rad, params.rad);
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
