define(['lib/underscore-min'], function(_) {

  function Superformula() {
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

  Superformula.prototype.presetKeys = function() {
    return Object.keys(this.presets);
  }

  return Superformula;
});

// // Thanks to Paul Bourke
// //   http://paulbourke.net/geometry/supershape/index.html
// //
// function superformula(phi, a, b) {
//   var n1 = params.shape.n1;
//   var n2 = params.shape.n2;
//   var n3 = params.shape.n3;
//   var m = params.shape.m;
//
//   var t1 = cos(m * phi / 4) / a;
//   t1 = abs(t1);
//   t1 = pow(t1, n2);
//
//   var t2 = sin(m * phi / 4) / b;
//   t2 = abs(t2);
//   t2 = pow(t2,n3);
//
//   var r = pow(t1 + t2, 1 / n1);
//
//   if (abs(r) == 0) {
//     return 0;
//   }
//   return 1 / r;
// }
//
// function init() {
//
// }
//
// function Supershape() {
//
// }
