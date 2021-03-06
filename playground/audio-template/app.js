define(function(require) {
  require('lib/three.min');
  require('lib/underscore-min');
  require('lib/stats.min');
  require('lib/OrbitControls');


  var scene, camera, renderer;
  var stats;

  var AudioStream = require('lib/AudioStream');
  var stream = new AudioStream('../audio/MS_01.mp3'); // AUDIO FILE

  var ShaderLoader = require('lib/ShaderLoader')
  var shaders = new ShaderLoader('.', '../shaderChunks');
  shaders.shaderSetLoaded = function() {
    init();
    animate();
  }
  shaders.load('shader-vert', 'rainbow', 'vertex');
  shaders.load('shader-frag', 'rainbow', 'fragment');

  var uniforms = {
    t_audio: {
      type: "t",
      value: stream.texture
    }
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
    var geometry = new THREE.BoxGeometry( 200, 200 , 200 , 10 , 10 , 10 );

    var material = new THREE.ShaderMaterial({
      uniforms:       uniforms,
      vertexShader:   shaders.vertexShaders.rainbow,
      fragmentShader: shaders.fragmentShaders.rainbow,
    });

    var mesh = new THREE.Mesh(geometry, material);
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


    renderer.render(scene, camera);

    stats.end();
  }
});
