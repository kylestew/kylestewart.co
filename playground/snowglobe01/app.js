define(function(require) {
  require('lib/three.min');
  require('lib/underscore-min');
  require('lib/stats.min');
  require('lib/OrbitControls');

  // constants
  // SCALE: meters
  const PLANE_SIZE = 12;
  const SUN_MOON_RADIUS = 14;
  const DAY_NIGHT_SPEED = 0.4;
  const SUN_MOON_LIGHT_DISTANCE = 20;
  const SUN_MOON_LIGHT_DECAY = 0;
  const SUN_LIGHT_INTENSITY = 1.5;
  const MOON_LIGHT_INTENSITY = 0.5;
  const AMBIENT_MULT = 3.0;

  // scene objects
  var plane;
  var ambient;
  var sun, moon;

  function makeScene() {
    // TODO: deformable geometry
    var geometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, 64, 64);
    var material = new THREE.MeshLambertMaterial({ color: 0x333399 })
    plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI/2;
    scene.add(plane);

    // TEMP
    var mat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });
    var lines = new THREE.LineSegments(geometry, mat);
    lines.rotation.x = -Math.PI/2;
    scene.add(lines);

    // dynamic ambient lighting
    ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

    // sun / moon
    sun = new THREE.Object3D();

    geometry = new THREE.SphereGeometry(2, 32, 32);
    var sunMesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
      emissive: 0xdddd00,
      roughness: 0.6,
      metalness: 0.4,
    }));
    sun.add(sunMesh);

    var sunLight = new THREE.PointLight(0xffffdd, SUN_LIGHT_INTENSITY, SUN_MOON_LIGHT_DISTANCE, SUN_MOON_LIGHT_DECAY);
    sun.add(sunLight);

    scene.add(sun);

    moon = new THREE.Object3D();
    var moonMesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
      emissive: 0x666666,
      roughness: 0.6,
      metalness: 0.4,
    }));
    moon.add(moonMesh);

    var moonLight = new THREE.PointLight(0xffffff, MOON_LIGHT_INTENSITY, SUN_MOON_LIGHT_DISTANCE, SUN_MOON_LIGHT_DECAY);
    moon.add(moonLight);

    scene.add(moon);
  }

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    // sun/moon cycle
    sun.position.x = SUN_MOON_RADIUS * Math.sin(clock.getElapsedTime() * DAY_NIGHT_SPEED);
    sun.position.y = SUN_MOON_RADIUS * Math.cos(clock.getElapsedTime() * DAY_NIGHT_SPEED);
    moon.position.x = SUN_MOON_RADIUS * Math.sin(Math.PI + clock.getElapsedTime() * DAY_NIGHT_SPEED);
    moon.position.y = SUN_MOON_RADIUS * Math.cos(Math.PI + clock.getElapsedTime() * DAY_NIGHT_SPEED);
    ambient.intensity = Math.abs(AMBIENT_MULT * Math.cos(clock.getElapsedTime() * DAY_NIGHT_SPEED));


    renderer.render(scene, camera);

    stats.end();
  }


  var scene, camera, renderer;
  var clock = new THREE.Clock();
  var stats;
  function initThree() {
    // prep scene and camera
    scene = new THREE.Scene();
    var w = window.innerWidth;
    var h = window.innerHeight;
    camera = new THREE.PerspectiveCamera(65, w/h, 0.1, 1000);
    camera.position.z = 18;
    camera.position.y = 8;

    // prep renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(new THREE.Color(0x000000));
    document.body.appendChild(renderer.domElement);

    // resize event
    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
    	camera.updateProjectionMatrix();
    	renderer.setSize( window.innerWidth, window.innerHeight );
    }, false);

    // orbit controls
    var orbit = new THREE.OrbitControls(camera, renderer.domElement);

    // fps stats
    stats = new Stats();
    document.body.appendChild(stats.dom);
  }


//  var AudioStream = require('lib/AudioStream');
//  var stream = new AudioStream('../audio/MS_01.mp3'); // AUDIO FILE

  // var ShaderLoader = require('lib/ShaderLoader')
  // var shaders = new ShaderLoader('.', '../shaderChunks');
  // shaders.shaderSetLoaded = function() {

    //stream.play(); // start audio

    initThree();
    makeScene();
    animate();
  // }
  // shaders.load('shader-vert', 'main', 'vertex');
  // shaders.load('shader-frag', 'main', 'fragment');

  // var uniforms = {
    // t_audio: {
    //   type: "t",
    //   value: stream.texture
    // }
  // };

});
