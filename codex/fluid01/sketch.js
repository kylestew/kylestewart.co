define(['lib/lightgl', 'lib/ShaderLoader', 'lib/stats.min'], function(GL, ShaderLoader, stats) {

  var shader;
  var shaderLoader = new ShaderLoader('.', '../codex/shaderchunks');
  shaderLoader.load('vert', 'main', 'vertex');
  shaderLoader.load('frag', 'main', 'fragment');
  shaderLoader.shaderSetLoaded = function() {
    // shader = new GL.Shader(shaderLoader.vertexShaders.main, shaderLoader.fragmentShaders.main);
    // gl.fullscreen();
    // gl.animate();
  };

  // var angle = 0;
  var gl = GL.create();
  // var mesh = GL.Mesh.cube();

  gl.onupdate = function(seconds) {

  };

  gl.ondraw = function() {
    stats.begin();



    stats.end();
  }

  var stats = new stats();
  stats.dom.style.cssText="position:fixed;bottom:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
  document.body.appendChild(stats.dom);
});
