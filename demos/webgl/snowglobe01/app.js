define(function(require) {
  require('lib/three.min');
  require('lib/underscore-min');
  require('lib/stats.min');
  require('lib/OrbitControls');

  /* TODO TODO TODO
  * - Starfield
  * - Day night texture cycles for skybox
  * - Height mapped terrain
  * - Animate camera rotation timed
  * - Animate terrain?
  */

  // constants
  // SCALE: meters
  const PLANE_SIZE = 12;
  const SUN_MOON_RADIUS = 14;
  const DAY_NIGHT_ANIMATION_TIME = 24;
  const SUN_LIGHT_INTENSITY = 0.8;
  const MOON_LIGHT_INTENSITY = 0.4;

  // scene objects
  var plane;
  var ambient;
  var sun, sunLight;
  var moon, moonLight;

  function makeScene() {
    // terrain geometry
    var geometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, 32, 32);

    // heightmap terrain
    geometry.vertices.map(function (vertex) {
      vertex.x += -.5 + Math.random() / 10;
      vertex.y += -.5 + Math.random() / 10;
      vertex.z = -.5 + Math.random() / 5;
      return vertex;
    });
    geometry.computeFaceNormals();

    var material = new THREE.MeshPhongMaterial({
      color: 0xe71fe8,
      specular: 0x1aeaf1,
      emissive: 0x030c27,
      shininess: 44,
      shading: THREE.FlatShading
    });
    plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI/2;
    scene.add(plane);

    // terrain lines
    var mat = new THREE.LineBasicMaterial({
      color: 0x030c27,
      transparent: true,
      opacity: 0.1
    });
    var lines = new THREE.LineSegments(geometry, mat);
    lines.rotation.x = -Math.PI/2;
    // scene.add(lines);

    // sun / moon
    sun = new THREE.Object3D();
    scene.add(sun);

    geometry = new THREE.IcosahedronGeometry(3, 2);
    var sunMesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
      color: 0x995d16,
      emissive: 0xd07f1f,
      specular: 0xeeeeee,
      shininess: 20,
      shading: THREE.FlatShading,
      fog: false,
    }));
    sun.add(sunMesh);

    sunLight = new THREE.DirectionalLight(0xbfc0d0, SUN_LIGHT_INTENSITY);
    sun.add(sunLight);
    // scene.add(new THREE.DirectionalLightHelper(sunLight, 1));

    moon = new THREE.Object3D();
    scene.add(moon);

    var moonMesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
      color: 0x666666,
      specular: 0xeeeeee,
      shininess: 10,
      shading: THREE.FlatShading,
      fog: false,
    }));
    moon.add(moonMesh);

    moonLight = new THREE.DirectionalLight(0xa4c4e7, MOON_LIGHT_INTENSITY);
    moon.add(moonLight);
    // scene.add(new THREE.DirectionalLightHelper(moonLight, 1));

    // EFFECTS
    // enable fog
    scene.fog = new THREE.FogExp2( 0xefd1b5, 0.07 );
  }

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    // animation time from 0 to 2PI
    var theta = Math.linMap(clock.getElapsedTime() % DAY_NIGHT_ANIMATION_TIME, 0, DAY_NIGHT_ANIMATION_TIME, 0, 2 * Math.PI);

    // sun/moon cycle
    sun.position.x = SUN_MOON_RADIUS * Math.sin(theta);
    sun.position.y = SUN_MOON_RADIUS * Math.cos(theta);
    sun.rotation.z = -Math.sin(theta);
    moon.position.x = SUN_MOON_RADIUS * Math.sin(theta - Math.PI);
    moon.position.y = SUN_MOON_RADIUS * Math.cos(theta - Math.PI);
    moon.rotation.z = -Math.sin(theta - Math.PI);

    // ambient.intensity = Math.abs(AMBIENT_MULT * Math.cos(clock.getElapsedTime() * DAY_NIGHT_SPEED));


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

  // some helpers
  Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  }
  Math.linMap = function(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  };

  initThree();
  makeScene();
  animate();
});
