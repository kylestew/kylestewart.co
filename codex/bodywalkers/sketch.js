define(function(require) {
  require('lib/dat.gui.min');
  var Superformula = require('codex/superformula');

  var drawWidth, drawHeight;
  var superformula;
  var points;
  var time;

  var params = {
    shape: "triangle",

    pointCount: 50,
    pointWeight: 0.66,

    backColor: '#000000',
    color0: '#88b1be',
    // color1:
    // color2:
  };
  var createUI = function(sketch, p5) {
    var gui = new dat.GUI();

    gui.add(params, 'shape', Object.keys(superformula.presets)).onChange(function(newShape) {
      superformula.setPreset(params.shape);
      points = superformula.generateVectorPointArray(params.pointCount);
    });
    gui.add(params, 'pointCount').min(10).max(1000).step(1);

    var style = gui.addFolder('Style');
    style.addColor(params, 'backColor');

    sketch.addResetToGUI(gui, params);
    sketch.addSaveToGUI(gui, params);
  }

  var setup = function(p5) {
    superformula = new Superformula(p5);
  }

  var reset = function(p5) {
    p5.background(params.backColor);
    p5.strokeWeight(params.pointWeight);
    p5.noFill();

    // make centered draw square with borders - for dramatic effect
    if (p5.width > p5.height) {
      drawHeight = p5.floor(p5.height * 0.6);
      drawWidth = drawHeight;
    } else {
      drawWidth = p5.floor(p5.width * 0.6);
      drawHeight = drawWidth;
    }

    // reset
    time = 0;

    // generate shape using selected superformula
    superformula.setPreset(params.shape);
    // set size of shape based on window size - not scaling it
    superformula.a = drawWidth / 2;
    superformula.b = drawWidth / 2;
    points = superformula.generateVectorPointArray(params.pointCount);
  }

  var draw = function(p5) {
    // center drawing
    p5.translate(p5.width / 2, p5.height / 2);
    p5.rotate(params.shape.orientation);

    for (var i = 0; i < points.length; i++) {
      var p = points[i];

// TODO: colors
  //   // select color from palette (index based on noise)
  //   var cn = (int)(100*pal.length*noise(idx))%pal.length;
  //   stroke(pal[cn]);

      // draw point
      // p5.stroke(params.color0);
      p5.stroke(255, 255, 255, 100);
      p5.strokeWeight(10);
      p5.point(p.x, p.y);

      // apply noise
      // TODO: apply alpha
      // TODO: lines for prev position - not points
      // p.x += 12.8 * (p5.noise(p.x, p.y, time) - 0.5);
      // p.y += 20.0 * (p5.noise(p.x, p.y, time) - 0.5);
    }

    time += 0.001;
  }

  var p5Boiler = require('codex/p5boiler');
  var sketch = p5Boiler(10, setup, createUI, reset, draw);
});
