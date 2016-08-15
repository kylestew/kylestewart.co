function windowResized() {
  resizeCanvas(windowWidth, windowHeight-4);
  init();
}

/* == GUI == */
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

/* == Main Event == */
function setup() {
  var canvas = createCanvas(windowWidth, windowHeight-4);
  canvas.id("renderCanvas");
  smooth();
  frameRate(30);

  init();
}

function init() {
  // initialize frame dependent variables here
}

function draw() {
  background(color(props.backColor));
}
