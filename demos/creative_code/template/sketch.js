

function init() {
  // initialize window size dependent variables here
}

function draw() {
  background(color(props.backColor));
  ellipse(width/2, height/2, props.rad, props.rad);
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
