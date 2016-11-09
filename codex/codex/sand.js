define([], function() {

  function Sand(p5) {
    this.p5 = p5;

    this.rA = 255.0;
    this.gA = 0.0;
    this.bA = 0.0;
    this.aA = 0.0;

  }

  Sand.prototype.paintDot = function(x, y) {
    blend_over(this.p5, x, y);
  }

  // blend modes
  var blend_over = function(p5, x, y) {
    p5.loadPixels();

    var i = 4 * ((y * p5.width * p5.pixelDensity()) + x * p5.pixelDensity())

    console.log(i);

    // var bB = p5.pixels[i]
    // var gB = p5.pixels[i+1]
    // var rB = p5.pixels[i+2]
    // var aB = p5.pixels[i+3]
    //
    // var invaA = 1.0 - this.aA
    //
    // p5.pixels[i] = this.bA + bB*invaA
    // p5.pixels[i+1] = this.gA + gB*invaA
    // p5.pixels[i+2] = this.rA + rB*invaA
    // p5.pixels[i+3] = this.aA + aB*invaA

    p5.pixels[i] = 255;
    p5.pixels[i+1] = 255;
    p5.pixels[i+2] = 255;
    p5.pixels[i+3] = 255;

    p5.updatePixels();
  }

  return Sand;
});
