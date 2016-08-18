define(function(require) {
  require('lib/three.min');
  require('lib/underscore-min');
  require('lib/stats.min');
  require('lib/OrbitControls');


  var scene, camera, renderer;
  var clock = new THREE.Clock();
  var stats;

  var SIZE = 256;
  var simulation;

  var simulationUniforms = {
    dT: {
      type: "f",
      value: 0,
    },
    noiseSize: {
      type: "f",
      value: .1,
    },
  };
  var renderUniforms = {
    t_pos: {
      type: "t",
      value: null,
    },
  };

  var ShaderLoader = require('lib/ShaderLoader')
  var shaders = new ShaderLoader('.', '../assets/shaderChunks');
  shaders.shaderSetLoaded = function() {
    init();
    makeScene();
    animate();
  }
  shaders.load('ss-curl', 'sim', 'simulation');
  shaders.load('vs-lookup', 'lookup', 'vertex');
  shaders.load('fs-lookup', 'lookup', 'fragment');

  function makeScene() {
    var PhysicsRenderer = require('lib/PhysicsRenderer');
    simulation = new PhysicsRenderer(SIZE, shaders.ss.sim, renderer);

    var geo = createLookupGeometry(SIZE);

    // material for point cloud
    var mat = new THREE.ShaderMaterial({
      uniforms: renderUniforms,
      vertexShader: shaders.vs.lookup,
      fragmentShader: shaders.fs.lookup,
    });

    var particles = new THREE.Points(geo, mat);
    particles.frustumCulled = false;
    scene.add(particles);

    simulation.setUniforms(simulationUniforms);
    simulation.addBoundTexture(renderUniforms.t_pos , 'output');
    simulation.resetRand(5);

    simulation.addDebugScene(scene);
    simulation.debugScene.scale.multiplyScalar(.1);
  }

  function createLookupGeometry(size) {
    var geo = new THREE.BufferGeometry();
    var positions = new Float32Array(  size * size * 3 );

    // x, y positions?
    for (var i = 0, j = 0, l = positions.length / 3; i < l; i++, j += 3) {
      positions[ j     ] = ( i % size ) / size;
      positions[ j + 1 ] = Math.floor( i / size ) / size;
    }

    geo.addAttribute('position', new THREE.BufferAttribute(positions, 3));

    return geo;
  }

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    simulationUniforms.dT.value = clock.getDelta() * 0.1;
    simulation.update();

    renderer.render(scene, camera);
    stats.end();
  }

  function init() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    // prep scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, w/h, 1, 2000);
    camera.position.z = 100;

    // prep renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(new THREE.Color(0x000000));
    document.body.appendChild(renderer.domElement);

    // orbit controls
    var orbit = new THREE.OrbitControls(camera, renderer.domElement);

    // fps stats
    stats = new Stats();
    document.body.appendChild(stats.dom);
  }

  window.addEventListener('resize', onWindowResize, false);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
  	camera.updateProjectionMatrix();
  	renderer.setSize( window.innerWidth, window.innerHeight );
  }
});
