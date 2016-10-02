define(['p5'], function(P5) {

  function DNA(p5, lifetime, newGenes) {
    this.p5 = p5;
    this.lifetime = lifetime;

    if (arguments.length > 2) {
      this.genes = newGenes;
    } else {
      // the genetic sequence
      this.genes = [];

      // the maximum strength of the forces
      this.maxforce = 0.4;
      for (var i = 0; i < lifetime; i++) {
        var angle = p5.random(p5.TWO_PI);
        this.genes[i] = P5.Vector.fromAngle(angle);
        this.genes[i].mult(p5.random(0, this.maxforce));
      }
    }
  }

  DNA.prototype.crossover = function(partner) {
    var child = [];
    // pick a midpoint
    var crossover = this.p5.floor(this.p5.random(this.genes.length));
    // take "half" from one and "half" from the other
    for (var i = 0; i < this.genes.length; i++) {
      if (i > crossover)
        child[i] = this.genes[i];
      else
        child[i] = partner.genes[i];
    }
    var newGenes = new DNA(this.p5, this.lifetime, child);
    return newGenes;
  }

  DNA.prototype.mutate = function(mutationRate) {
    for (var i = 0; i < this.genes.length; i++) {
      if (Math.random() < mutationRate) {
        var angle = this.p5.random(this.p5.TWO_PI);
        this.genes[i] = P5.Vector.fromAngle(angle);
        this.genes[i].mult(this.p5.random(0, this.maxforce));
      }
    }
  }

  return DNA;
});
