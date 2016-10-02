define(['rocket', 'dna'], function(Rocket, DNA) {

  function Population(p5, m, num, lifetime) {
    this.p5 = p5;
    this.mutationRate = m;              // Mutation rate
    this.population = [];               // Array to hold the current population
    this.matingPool = [];               // ArrayList which we will use for our "mating pool"
    this.generations = 0;               // Number of generations

    // make a new set of creatures
    for (var i = 0; i < num; i++) {
      var location = p5.createVector(p5.width/2, p5.height+20);
      this.population[i] = new Rocket(p5, location, new DNA(p5, lifetime));
    }
  }

  Population.prototype.live = function(target) {
    // run every rocket
    for (var i = 0; i < this.population.length; i++) {
      this.population[i].run(target);
    }
  }

  Population.prototype.evolveNextGeneration = function(target) {
    // final fitness values for generational results
    this.calcFitness(target);

    // select the fittest
    this.doSelection();

    // create next generation
    this.doReproduction();
  }

  Population.prototype.calcFitness = function(target) {
    for (var i = 0; i < this.population.length; i++) {
      this.population[i].calcFitness(target);
    }
  }

  Population.prototype.doSelection = function() {
    this.matingPool = [];
    var maxFitness = this.getMaxFitness();
    for (var i = 0; i < this.population.length; i++) {
      // normalize values from 0 to 1
      var fitnessNormal = this.p5.map(this.population[i].getFitness(), 0, maxFitness, 0, 1);
      // add n times to gene pool for reproduction
      var n = this.p5.floor(fitnessNormal * 100);  // Arbitrary multiplier
      for (var j = 0; j < n; j++) {
        this.matingPool.push(this.population[i]);
      }
    }
  }

  Population.prototype.doReproduction = function() {
    // Refill the population with children from the mating pool
    var p5 = this.p5;
    for (var i = 0; i < this.population.length; i++) {
      // Sping the wheel of fortune to pick two parents
      var m = p5.floor(p5.random(this.matingPool.length));
      var d = p5.floor(p5.random(this.matingPool.length));
      // Pick two parents
      var mom = this.matingPool[m];
      var dad = this.matingPool[d];
      // Get their genes
      var momgenes = mom.getDNA();
      var dadgenes = dad.getDNA();
      // Mate their genes
      var child = momgenes.crossover(dadgenes);
      // Mutate their genes
      child.mutate(this.mutationRate);
      // Fill the new population with the new child
      var location = p5.createVector(p5.width/2, p5.height+20);
      this.population[i] = new Rocket(p5, location, child);
    }
    this.generations++;
  }

  Population.prototype.getGenerations = function() {
    return this.generations;
  }

  Population.prototype.getMaxFitness = function() {
    var record = 0;
    for (var i = 0; i < this.population.length; i++) {
      if (this.population[i].getFitness() > record) {
        record = this.population[i].getFitness();
      }
    }
    return record;
  }

  return Population;
});
