define(function(require) {
  require('lib/dat.gui.min');
  var Superformula = require('codex/superformula');

  var _p5;
  var drawWidth, drawHeight;
  var superformula;
  var points;
  var time;

  var params = {
    shape: "circle",

    // points
    count: 400,
    weight: 1.0,
    strength: 20, // 0 - 100

    // style
    backColor: '#000000',
    color0: '#88b1be',
    color1: '#ff0000',
    repeat: 2,

    // walking
    noiseBias: 0.466,
  };
  var createUI = function(sketch, p5) {
    var gui = new dat.GUI();

    var shapeKeys = Object.keys(superformula.presets);
    gui.add(params, 'shape', shapeKeys).onChange(function(newShape) {
      resetShape();
    });

    var points = gui.addFolder('Points');
    points.add(params, 'count').min(10).max(1000).step(1);
    points.add(params, 'weight').min(0.1).max(3);
    points.add(params, 'strength').min(0).max(100);

    var style = gui.addFolder('Style');
    style.addColor(params, 'backColor');
    style.addColor(params, 'color0');
    style.addColor(params, 'color1');
    style.add(params, 'repeat').min(1).max(8).step(1);

    sketch.addResetToGUI(gui, params);
    sketch.addSaveToGUI(gui, params);
  }

  var setup = function(p5) {
    _p5 = p5;
    superformula = new Superformula(p5);
    p5.smooth(8);
  }

  function resetShape() {
    // generate shape using selected superformula
    superformula.setPreset(params.shape);
    // set size of shape based on window size - not scaling it
    superformula.a = drawWidth / 2;
    superformula.b = drawWidth / 2;
    var dots = superformula.generateVectorPointArray(params.count);

    // convert to point objects and apply colors
    points = [];

// TODO: colors
  //   // select color from palette (index based on noise)
  //   var cn = (int)(100*pal.length*noise(idx))%pal.length;
  //   stroke(pal[cn]);

    var col0 = _p5.color(params.color0);
    var col1 = _p5.color(params.color1);

    for (var i = 0; i < dots.length; i++) {

      var ang = _p5.map(i, 0, dots.length, 0, params.repeat * 2 * Math.PI);
      var col = _p5.lerpColor(col0, col1, Math.sin(ang));

      var point = {
        x: dots[i].x,
        y: dots[i].y,
        color: col,
      }
      points.push(point);
    }
  }

  var reset = function(p5) {
    p5.background(params.backColor);
    p5.noStroke();

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
    resetShape();
  }

  var draw = function(p5) {
    // center drawing
    p5.translate(p5.width / 2, p5.height / 2);
    p5.rotate(params.shape.orientation);

    for (var i = 0; i < points.length; i++) {
      var p = points[i];

      // draw point with assigned color/weight/strength
      var col = p5.color(p5.red(p.color), p5.green(p.color), p5.blue(p.color), params.strength);
      p5.fill(col);
      p5.ellipse(p.x, p.y, params.weight);

      // apply noise
      // TODO: perlin noise displaying nasty semetry
      p.x += 20.0 * (p5.noise(p.x, p.y, time) - params.noiseBias);
      p.y += 20.0 * (p5.noise(p.x, p.y, time) - params.noiseBias);
    }

    // time += 0.001;
  }

  var p5Boiler = require('codex/p5boiler');
  var sketch = p5Boiler(60, setup, createUI, reset, draw);
});
