define(function(require) {
  require('lib/dat.gui.min');

  var drawWidth, drawHeight;
  var counts;
  var time;

  var params = {
    bias: 0.466,
  };
  var createUI = function(sketch, p5) {
    var gui = new dat.GUI();

    gui.add(params, 'bias').min(0).max(1);

    sketch.addResetToGUI(gui, params);
    sketch.addSaveToGUI(gui, params);
  }

  var setup = function(p5) {
    p5.noiseSeed(0);
    p5.noiseDetail(8, 0.65);
  }

  var reset = function(p5) {
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

    // subdivide drawWidth by slots to count into
    counts = [];
    for (var i = 0; i < drawWidth; ++i)
      counts.push(0);
  }

  var draw = function(p5) {
    p5.background(200, 255, 255);
    p5.strokeWeight(1);
    p5.stroke(0);
    p5.noFill();

    // center drawing
    p5.translate((p5.width - drawWidth) / 2, p5.height/2);
    // make graph mode by inverting y axis
    p5.scale(1, -1);

    // draw counts
    for (var i = 0; i < counts.length; i++) {
      // perlin
      counts[i] += 0.5 * (p5.noise(i, time) - params.bias);

      var len = counts[i];

      p5.line(i, 0, i, len);
    }

    // rough idea of imbalance
    var above = 0;
    var below = 0;
    for (var i = 0; i < counts.length; i++) {
      if (counts[i] > 0)
        above += counts[i];
      else
        below += Math.abs(counts[i]);
    }
    if (above > below) {
      console.log("above :: " + (above - below));
    } else {
      console.log("below :: " + (below - above));
    }

    time += 0.001;
  }

  var p5Boiler = require('codex/p5boiler');
  var sketch = p5Boiler(60, setup, createUI, reset, draw);
});
