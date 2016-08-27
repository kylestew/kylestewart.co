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
    count: 3000,
    weight: 1.0,
    strength: 40, // 0 - 100

    // style
    backColor: '#121212',
    color0: '#88b1be',
    color1: '#d9718f',
    repeat: 4,

    // walkers
    bias: 0.466,
    multiply: 2.0,
    stride: 0.01,
    speed: 0.0001,
    indexMult: 0.2,
    lod: 4.0,
    falloff: 0.65,

    // post
    fade: 0,
  };
  var createUI = function(sketch, p5) {
    var gui = new dat.GUI();

    var shapeKeys = Object.keys(superformula.presets);
    gui.add(params, 'shape', shapeKeys).onChange(function(newShape) {
      resetShape();
    });

    var points = gui.addFolder('Points (must reset)');
    points.add(params, 'count').min(10).max(10000);
    points.add(params, 'weight').min(0.1).max(3);
    points.add(params, 'strength').min(0).max(100);
    // points.open();

    var style = gui.addFolder('Style (must reset)');
    style.addColor(params, 'backColor');
    style.addColor(params, 'color0');
    style.addColor(params, 'color1');
    style.add(params, 'repeat').min(0).max(64).step(1);
    // style.open();

    var walks = gui.addFolder('Walkers');
    walks.add(params, 'bias').min(0).max(1);
    walks.add(params, 'multiply').min(0).max(10);
    walks.add(params, 'stride').min(0).max(0.1);
    walks.add(params, 'speed').min(0).max(0.1);
    walks.add(params, 'indexMult').min(0).max(1.0);
    walks.add(params, 'lod').min(0).max(32);
    walks.add(params, 'falloff').min(0).max(1.0);
    walks.open();

    var post = gui.addFolder('Post');
    post.add(params, 'fade').min(0).max(10);
    // post.open();

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

    var col0 = _p5.color(params.color0);
    var col1 = _p5.color(params.color1);

    for (var i = 0; i < dots.length; i++) {

      var ang = _p5.map(i, 0, dots.length, 0, params.repeat * 2 * Math.PI);
      var col = col0;
      if (params.repeat > 0)
        col = _p5.lerpColor(col0, col1, Math.sin(ang));

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

    p5.noiseSeed(p5.random() * 100);

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
    p5.noiseDetail(params.lod, params.falloff);

    // apply optional fade
    if (params.fade > 0) {
      p5.noStroke();
      var back = p5.color(params.backColor);
      var col = p5.color(p5.red(back), p5.green(back), p5.blue(back), params.fade);
      p5.fill(col);
      p5.rect(0, 0, p5.width, p5.height);
    }

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
      // I realize there are a crazy amount of factors here
      // it just happened, not planned
      var idxFactor = p5.map(i, 0, points.length, 0, 32 * Math.PI);
      idxFactor = params.indexMult * p5.sin(idxFactor);
      p.x += params.multiply * (p5.noise(p.x * params.stride + idxFactor, time, time) - params.bias);
      p.y += params.multiply * (p5.noise(time, p.y * params.stride + idxFactor, time) - params.bias);
    }

    time += params.speed;
  }

  var p5Boiler = require('codex/p5boiler');
  var sketch = p5Boiler(60, setup, createUI, reset, draw);
});
