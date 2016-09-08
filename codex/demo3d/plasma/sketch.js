/*
 * Based on an example from Justin Windle aka Soulwire
 * http://soulwire.co.uk/experiments/plasmatic-isosurface/
 */
define(['lib/lightgl', 'lib/ShaderLoader', 'lib/stats.min'], function(GL, ShaderLoader, stats) {

  // lightgl scripts always need shaders
  var shader;
  var shaderLoader = new ShaderLoader('.', '../codex/shaderchunks');
  shaderLoader.load('vert', 'main', 'vertex');
  shaderLoader.load('frag', 'main', 'fragment');
  shaderLoader.shaderSetLoaded = function() {
    shader = new GL.Shader(shaderLoader.vertexShaders.main, shaderLoader.fragmentShaders.main);

    gl.fullscreen();
    gl.animate();
  };

  var millis = 0;
  var time = 0;
  var gl = GL.create();
  var mesh = GL.Mesh.plane({ coords: true });

  gl.onupdate = function(delta) {
    time += delta;
    var perc = Math.linMap(time % 12, 0, 12, 0, Math.PI);
    millis = Math.cos(perc) * 4000;
  };

  gl.ondraw = function() {
    stats.begin();

    // update uniforms
    // TODO: only do this when needed
    shader.uniforms({
      u_resolution: [gl.canvas.width, gl.canvas.height],
      u_millis: millis,
      u_energy: 1.01,
      u_particles: 32,
      u_brightness: 1.1,
      u_blobiness: 1.0,
    });

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.loadIdentity();
    gl.translate(0, 0, -5);
    gl.rotate(30, 1, 0, 0);

    shader.draw(mesh);

    stats.end();
  }

  // handle resize event
  window.addEventListener('resize', function() {
    // self.camera.aspect = window.innerWidth / window.innerHeight;
    // self.camera.updateProjectionMatrix();
    // self.renderer.setSize( window.innerWidth, window.innerHeight );
    // this.viewport(0, 0, this.width, this.height);
    // return this.updateUniforms();
  }, false);

  // create stats window bottom left
  var stats = new stats();
  stats.dom.style.cssText="position:fixed;bottom:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
  document.body.appendChild(stats.dom);

  Math.linMap = function(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  };
});
