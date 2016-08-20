define(['lib/underscore-min'], function(_) {

  function Superformula(p5) {
    this.p5 = p5;

    // default: circle
    this.orientation = 0;
    this.n1 = 1;
    this.n2 = 1;
    this.n3 = 1;
    this.m = 0;
    this.a = 1;
    this.b = 1;

    this.presets = {
      circle: {
        orientation: 0,
        n1: 1,
        n2: 1,
        n3: 1,
        m: 0
      },
      triangle: {
        orientation: Math.PI/3,
        n1: 0.5,
        n2: 0.5,
        n3: 0.5,
        m: 3
      },
      fat_star: {
        orientation: Math.PI,
        n1: 1,
        n2: 1,
        n3: 1,
        m: 5
      },
      skiny_star: {
        orientation: Math.PI,
        n1: 0.4,
        n2: 0.4,
        n3: 0.4,
        m: 5
      },
      plus_star: {
        orientation: 0,
        n1: 0.4,
        n2: 0.4,
        n3: 0.4,
        m: 4
      },
      diamond: {
        orientation: Math.PI,
        n1: 1,
        n2: 1,
        n3: 1,
        m: 4
      },
      eye: {
        orientation: Math.PI/2,
        n1: 0.4,
        n2: 0.4,
        n3: 0.4,
        m: 2
      },
      bob: {
        orientation: Math.PI/2,
        n1: 0.5,
        n2: 0.5,
        n3: 16,
        m: 16
      },
    }

  }

  Superformula.prototype.setPreset = function(presetKey) {
    var preset = this.presets[presetKey];
    if (preset) {
      this.orientation = preset.orientation;
      this.n1 = preset.n1;
      this.n2 = preset.n2;
      this.n3 = preset.n3;
      this.m = preset.m;
    }
  }

  Superformula.prototype.generateVectorPointArray = function(pointCount) {
    var points = [];
    for (var i = 0; i < pointCount; i++) {
      var phi = this.p5.map(i, 0, pointCount, 0, Math.PI * 2);
      var r = this._superformula(phi);
      var x = r * Math.sin(phi);
      var y = r * Math.cos(phi);
      points.push(this.p5.createVector(x, y));
    }
    return points;
  }

  Superformula.prototype._superformula = function(phi) {
    // Thanks to Paul Bourke
    //   http://paulbourke.net/geometry/supershape/index.html
    var n1 = this.n1;
    var n2 = this.n2;
    var n3 = this.n3;
    var a = this.a;
    var b = this.b;
    var m = this.m;

    var t1 = Math.cos(m * phi / 4) / a;
    t1 = Math.abs(t1);
    t1 = Math.pow(t1, n2);

    var t2 = Math.sin(m * phi / 4) / b;
    t2 = Math.abs(t2);
    t2 = Math.pow(t2,n3);

    var r = Math.pow(t1 + t2, 1 / n1);

    if (Math.abs(r) == 0) {
      return 0;
    }
    return 1 / r;
  }

  return Superformula;
});
