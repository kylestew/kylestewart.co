define(function(require) {
  require('lib/dat.gui.min');

  // constants
  var WIDTH = 128;
  var NUM_TEXELS = WIDTH * WIDTH;

  var BOUNDS = 512;
  var BOUNDS_HALF = BOUNDS / 2;

  // scene
  // var waterMesh;
  // var meshRay;
  // var gpuCompute;
  // var waterUniforms;
  // var smoothShader;

  // var simplex = new SimplexNoise();

  // var mouseCoords = new THREE.Vector2();
  // var raycaster = new THREE.Raycaster();


  // var uniforms = {
  //   Time:    { type: "f" , value: 0 },
  //   Offset:  { type: "f" , value: 0 },
  //   Color:   { type: "v3", value: new THREE.Vector3(0.4, 1.9, 2.4) },
  // };

  var params = {
  };
  function createUI(sketch) {
    var gui = new dat.GUI();

    // gui.add(params, 'size').min(10).max(400);

    sketch.addResetToGUI(gui, params);
  }

  function setup(scene, camera, renderer) {
    camera.fov = 75;
    camera.position.set(0, 200, 350);
  }

  function loadShaders(shaderLoader) {
    // shaderLoader.load('vert', 'main', 'vertex');
    // shaderLoader.load('frag', 'main', 'fragment');
  }

  function initWater(scene) {
    var geometry = new THREE.PlaneBufferGeometry(BOUNDS, BOUNDS, WIDTH - 1, WIDTH - 1);
    var material = new THREE.MeshPhongMaterial({
      color: 0x0040C0,
      specular: 0x111111,
      shininess: 50,
    });

    waterMesh = new THREE.Mesh(geometry, material);
    waterMesh.rotation.x = - Math.PI / 2;
		waterMesh.matrixAutoUpdate = false;
		waterMesh.updateMatrix();
    scene.add(waterMesh);
  }

  function resetScene(scene, renderer, shaders) {
    var sun = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
		sun.position.set( 300, 400, 175 );
		scene.add(sun);

		var sun2 = new THREE.DirectionalLight( 0x40A040, 0.6 );
		sun2.position.set( -100, 350, -200 );
		scene.add(sun2);

    initWater(scene);



    // var geometry = new THREE.OctahedronGeometry(250, 6); // rad, detail
    //
    // var material = new THREE.ShaderMaterial({
    //   uniforms:       uniforms,
    //   vertexShader:   shaders.vertexShaders.main,
    //   fragmentShader: shaders.fragmentShaders.main,
    // });
    //
    // mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);
  }

  function animate(scene, clock) {
    // var length = 8;
    // var tick = clock.getElapsedTime() % length;

    // // update uniforms
    // uniforms.Time.value = tick;
    // uniforms.Offset.value = 2.0 * Math.sin(Math.linMap(tick, 0, length, 0, Math.PI));
    //
    // // rotate
    // mesh.rotation.y = Math.linMap(tick, 0, length, 0, Math.PI);
  }

  var threejsboiler = require('codex/threejsboiler');
  var sketch = new threejsboiler(setup, createUI, resetScene, animate);
});
