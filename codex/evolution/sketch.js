define(function(require) {
  require('lib/dat.gui.min');
  var Population = require('population');

  var lifetime;
  var population;
  var lifeCounter;
  var target;
  var info;

  var generations = 0;
  var avgFitness;

  var setup = function(p5) {
    p5.createCanvas(640, 360);

    lifetime = p5.height;
    lifeCounter = 0;
    target = p5.createVector(p5.width/2, 24);

    // create a population with a mutation rate, and population max
    var mutationRate = 0.01;
    population = new Population(p5, mutationRate, 50, lifetime);
  }

  var reset = function(p5) {
  }

  var draw = function(p5) {
    p5.background(255);

    // draw the start and target positions
    p5.fill(0);
    p5.stroke(0);
    p5.ellipse(target.x, target.y, 24, 24);

    if (lifeCounter < lifetime) {
      // continue generation
      population.live(target);
      lifeCounter++;
    } else {
      // start a new generation
      lifeCounter = 0;
      population.evolveNextGeneration(target);
    }
  }

  var p5Boiler = require('codex/p5boiler');
  var sketch = p5Boiler(60, setup, null, reset, draw);
});
