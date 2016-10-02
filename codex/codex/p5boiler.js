define(['p5', 'lib/underscore-min', 'lib/stats.min', 'lib/canvas-toBlob', 'lib/filesaver.min'], function(p5, _, stats, blob, fs) {

  function p5boiler(frameRate, setup, setupUI, reset, draw) {

    this.sketch = function(_p5) {

      this.self = this;

      _p5.setup = function() {
        var canvas = _p5.createCanvas(_p5.windowWidth, _p5.windowHeight);
        canvas.id("renderCanvas"); // for image saver
        _p5.frameRate(frameRate);

        // create stats window bottom left
        self.stats = new stats();
        self.stats.dom.style.cssText="position:fixed;bottom:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
        document.body.appendChild(self.stats.dom);

        setup(_p5);
        if (setupUI)
          setupUI(self, _p5);
        reset(_p5);
      };

      _p5.windowResized = function() {
        _p5.resizeCanvas(_p5.windowWidth, _p5.windowHeight);
        reset(_p5);
      }

      _p5.draw = function() {
        this.stats.begin();

        draw(_p5);

        this.stats.end();
      }

      this.addResetToGUI = function(gui, params) {
        params.reset = function() {
          reset(_p5);
        }
        gui.add(params, 'reset');
      };

      this.addSaveToGUI = function(gui, params) {
        params.save = function() {
          var canvas = document.getElementById("renderCanvas"), ctx = canvas.getContext("2d");
          canvas.toBlob(function(blob) {
            saveAs(blob, "output.png");
          });
        }
        gui.add(params, 'save');
      };

    }

    this.sketchInstance = new p5(this.sketch);
  }

  return p5boiler;

});
