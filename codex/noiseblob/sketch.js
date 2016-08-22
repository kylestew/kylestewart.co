define(function(require) {
  require('lib/dat.gui.min');

  var mesh;

  var uniforms = {
    Time:    { type: "f" , value: 0 },
    Offset:  { type: "f" , value: 0 },
    Color:   { type: "v3", value: new THREE.Vector3(0.4, 1.9, 2.4) },
  };

  var params = {
    size: 100,
  };
  function createUI(sketch) {
    var gui = new dat.GUI();

    gui.add(params, 'size').min(10).max(400);

    sketch.addResetToGUI(gui, params);
  }

  function setup(scene, camera, renderer) {
    camera.fov = 65;
    camera.position.z = 1000;

    http://codepen.io/kylestew/pen/jAYRbq
  }

  function loadShaders(shaderLoader) {
    shaderLoader.load('vert', 'main', 'vertex');
    shaderLoader.load('frag', 'main', 'fragment');
  }

  function resetScene(scene, renderer, shaders) {
    var geometry = new THREE.OctahedronGeometry(250, 6); // rad, detail

    var material = new THREE.ShaderMaterial({
      uniforms:       uniforms,
      vertexShader:   shaders.vertexShaders.main,
      fragmentShader: shaders.fragmentShaders.main,
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  function animate(scene, clock) {
    var length = 8;
    var tick = clock.getElapsedTime() % length;

    // update uniforms
    uniforms.Time.value = tick;
    uniforms.Offset.value = 2.0 * Math.sin(Math.linMap(tick, 0, length, 0, Math.PI));

    // rotate
    mesh.rotation.y = Math.linMap(tick, 0, length, 0, Math.PI);
  }

  var threejsboiler = require('codex/threejsboiler');
  var sketch = new threejsboiler(setup, createUI, resetScene, animate, loadShaders);
});
