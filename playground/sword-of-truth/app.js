define(function(require) {
  require('lib/three.min');
  require('lib/underscore-min');
  require('lib/stats.min');
  require('lib/OrbitControls');


  var scene, camera, renderer;
  var stats;
  var clock = new THREE.Clock();

  var AudioStream = require('lib/AudioStream');
  var stream = new AudioStream('../audio/MS_02.mp3'); // AUDIO FILE

  var ShaderLoader = require('lib/ShaderLoader')
  var shaders = new ShaderLoader('.', '../shaderChunks');
  shaders.shaderSetLoaded = function() {
    init();
    animate();
  }
  shaders.load('shader-vert', 'main', 'vertex');
  shaders.load('shader-frag', 'main', 'fragment');

  var uniforms = {
    Time:         { type: "f", value: 0 },
    Color:        { type: "v3", value: new THREE.Vector3(-.7, -.8, -.3) },
    AudioTexture: { type: "t", value: stream.texture },
    NoisePower:   { type: "f", value: .9 },
    AudioPower:   { type: "f", value: 1.4 },
  };

  function init() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    // prep scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(65, w/h, 1, 2000);
    camera.position.z = 1000;

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

    // create a scene
    var geometry = new THREE.SphereGeometry(200, 3, 1000);

    var material = new THREE.ShaderMaterial({
      uniforms:       uniforms,
      vertexShader:   shaders.vertexShaders.main,
      fragmentShader: shaders.fragmentShaders.main,
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.z = Math.PI/2;
    mesh.scale.y = 5;
    scene.add(mesh);

    // start audio
    stream.play();
  }

  window.addEventListener('resize', onWindowResize, false);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
  	camera.updateProjectionMatrix();
  	renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    stream.update();
    uniforms.Time.value += clock.getDelta();

    renderer.render(scene, camera);

    stats.end();
  }
});
