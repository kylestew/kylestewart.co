define(function(require) {
  require('lib/three.min');
  require('lib/underscore-min');
  require('lib/dat.gui.min');
  require('lib/stats.min');
  require('lib/OrbitControls');

  var scene, camera, renderer, mesh;
  var clock = new THREE.Clock();

  var AudioStream = require('lib/AudioStream');
  var stream = new AudioStream('../audio/MS_02.mp3'); // AUDIO FILE

  var ShaderLoader = require('lib/ShaderLoader')
  var shaders = new ShaderLoader('.', '../shaderChunks');
  shaders.shaderSetLoaded = function() {
    init();
    initGUI();
    animate();
  }
  shaders.load('shader-vert', 'main', 'vertex');
  shaders.load('shader-frag', 'main', 'fragment');

  var uniforms = {
    Time:         { type: "f", value: 0 },
    Color:        { type: "v3", value: new THREE.Vector3(-.7, -.8, -.3) },
    AudioTexture: { type: "t", value: stream.texture },
    NoiseSeed:    { type: "v3", value: new THREE.Vector3(-0.1, -0.1, -0.9) },
    NoiseSize:    { type: "f", value: 1 },
    NoisePower:   { type: "f", value: .05 },
    NoiseSpeed:   { type: "f", value: .2 },
    AudioPower:   { type: "f", value: 0.2 },
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

    // create a scene
    // var geometry = new THREE.BoxGeometry(300, 300, 300, 100, 100, 100);
    // var geometry = new THREE.TorusGeometry(300, 60, 32, 64); // rad, tube diam, rad seg, tube segs
    // var geometry = new THREE.DodecahedronGeometry(300, 4); // rad, detail
    var geometry = new THREE.OctahedronGeometry(250, 6); // rad, detail

    var material = new THREE.ShaderMaterial({
      uniforms:       uniforms,
      vertexShader:   shaders.vertexShaders.main,
      fragmentShader: shaders.fragmentShaders.main,
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = 0.15;
    mesh.rotation.y = 0.15;
    scene.add(mesh);

    // start audio
    stream.play();
  }

  var params = {
    color: "#0b1066",
    noiseSize: 1.0,
    noisePower: 0.08,
    noiseSpeed: 0.2,
    audioPower: 0.2,
  }

  var stats;
  function initGUI() {
    // fps stats
    stats = new Stats();
    document.body.appendChild(stats.dom);

    // GUI
    var gui = new dat.GUI();
    gui.addColor(params, 'color');
    gui.add(params, 'noiseSize', 0, 6);
    gui.add(params, 'noisePower', 0, 0.5);
    gui.add(params, 'noiseSpeed', 0, 0.5);
    gui.add(params, 'audioPower', 0, 0.5);

    // gui.close();
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

    // slowly rotate
    mesh.rotation.y += 0.001;

    // update time
    uniforms.Time.value += clock.getDelta();

    // slowly walk the noise landscape
    uniforms.NoiseSeed.value.x = ( 0.5 * Math.sin( uniforms.Time.value / 50.0 ) +0.7 ) / -2;
    uniforms.NoiseSeed.value.y = ( 0.5 * Math.sin( uniforms.Time.value / 50.0 ) +0.7 ) / -2;

    // bind latest GUI settings
    uniforms.Color.value = new THREE.Color(params.color);
    uniforms.NoiseSize.value = params.noiseSize;
    uniforms.NoisePower.value = params.noisePower;
    uniforms.NoiseSpeed.value = params.noiseSpeed;
    uniforms.AudioPower.value = params.audioPower;

    renderer.render(scene, camera);

    stats.end();
  }
});
