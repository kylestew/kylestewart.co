define(function(require) {
  require('lib/dat.gui.min');
  var Superformula = require('codex/superformula');

  var drawWidth, drawHeight;
  var superformula;
  var points;
  var time;

  var params = {
    shape: "triangle",

    pointCount: 500,
    pointWeight: 0.66,

    backColor: '#000000',
    color0: '#88b1be',
    // color1:
    // color2:
  };

  var setupUI = function(sketch, p5) {
    var gui = new dat.GUI();

    gui.add(params, 'shape', Object.keys(superformula.presets));
    // TODO: update preset and reset

    gui.add(params, 'pointCount').min(10).max(1000).step(1);

    var style = gui.addFolder('Style');
    style.addColor(params, 'backColor');

    sketch.addApplyToGUI(gui, params);
    sketch.addSaveToGUI(gui, params);
  }

  var awake = function(p5) {
    superformula = new Superformula();
  }

  var setup = function(p5) {
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
    // points = [];
    // var rad = drawWidth / 2;
    // for (var i = 0; i < params.pointCount; i++) {
    //   var phi = map(i, 0, params.pointCount, 0, TWO_PI);
    //   var r = superformula(phi, rad, rad);
    //   var x = r * sin(phi);
    //   var y = r * cos(phi);
    //   points.push(createVector(x, y));
    // }
  }

  var draw = function(p5) {
    // center drawing
    // translate(width / 2, height / 2);
    // rotate(params.shape.orientation);

/*
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
  */
  }

  var p5Boiler = require('codex/p5boiler');
  var sketch = p5Boiler(30, awake, setupUI, setup, draw);
});
