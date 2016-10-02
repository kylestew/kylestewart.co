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

  var angle = 0;
  var gl = GL.create();
  var mesh = GL.Mesh.cube();

  gl.onupdate = function(seconds) {
    angle += 12 * seconds;
  };

  gl.ondraw = function() {
    stats.begin();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.loadIdentity();
    gl.translate(0, 0, -5);
    gl.rotate(30, 1, 0, 0);
    gl.rotate(angle, 0, 1, 0);

    shader.draw(mesh);

    stats.end();
  }

  // create stats window bottom left
  var stats = new stats();
  stats.dom.style.cssText="position:fixed;bottom:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
  document.body.appendChild(stats.dom);
});
