define([], function() {

  function Rocket(p5, pos, _dna) {
    this.p5 = p5;

    this.acceleration = p5.createVector();
    this.velocity = p5.createVector();
    this.position = pos.copy();

    this.r = 4;

    this.fitness = 0;
    this.dna = _dna;

    this.geneCounter = 0;

    this.hitTarget = false;   // Did I reach the target
  }

  // Did I make it to the target?
  Rocket.prototype.checkTarget = function(target) {
    var d = this.p5.dist(this.position.x, this.position.y, target.x, target.y);
    if (d < 12) {
      this.hitTarget = true;
    }
  }

  Rocket.prototype.applyForce = function(f) {
    this.acceleration.add(f);
  }

  Rocket.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  Rocket.prototype.display = function() {
    var p5 = this.p5;
    var theta = this.velocity.heading() + p5.PI/2;
    var r = this.r;
    p5.stroke(0);
    p5.push();
    p5.translate(this.position.x, this.position.y);
    p5.rotate(theta);

    // Thrusters
    p5.rectMode(p5.CENTER);
    p5.fill(0);
    p5.rect(-r/2, r*2, r/2, r);
    p5.rect(r/2, r*2, r/2, r);

    // Rocket body
    p5.fill(255);
    p5.beginShape(p5.TRIANGLES);
    p5.vertex(0, -r*2);
    p5.vertex(-r, r*2);
    p5.vertex(r, r*2);
    p5.endShape(p5.CLOSE);

    p5.pop();
  };

  Rocket.prototype.run = function(target) {
    // Run in relation to all the obstacles
    // If I'm stuck, don't bother updating or checking for intersection
    this.checkTarget(target); // Check to see if we've reached the target
    if (!this.hitTarget) {
      this.applyForce(this.dna.genes[this.geneCounter]);
      this.geneCounter = (this.geneCounter + 1) % this.dna.genes.length;
      this.update();
    }
    this.display();
  }

  // Fitness function
  // fitness = one divided by distance squared
  Rocket.prototype.calcFitness = function(target) {
    var d = this.p5.dist(this.position.x, this.position.y, target.x, target.y);
    this.fitness = this.p5.pow(1/d, 2);
  }

  Rocket.prototype.getFitness = function(target) {
    return this.fitness;
  }

  Rocket.prototype.getDNA = function(target) {
    return this.dna;
  }

  return Rocket;
});
