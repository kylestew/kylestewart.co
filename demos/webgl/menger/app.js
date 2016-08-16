define(function(require) {
  require('lib/three.min');
  require('lib/underscore-min');
  require('lib/stats.min');
  require('lib/OrbitControls');

  // == Menger Sponge ==
  function Menger(geometry, material) {
    this.geometry = geometry;
    this.material = material;
    this.group = new THREE.Group();
    this._setGeneration(0);
  }
  Menger.prototype._makeBoxGroup = function(gen) {
    var boxGroup = new THREE.Group();
    for (var x = -1; x < 2; x++) {
      for (var y = -1; y < 2; y++) {
        for (var z = -1; z < 2; z++) {
          // skip centers
          if ((Math.abs(x) + Math.abs(y) + Math.abs(z)) <= 1)
            continue;

          var box = new THREE.Mesh(this.geometry, this.material);
          box.position.set(x * CUBE_SIZE, y * CUBE_SIZE, z * CUBE_SIZE);

          box.castShadow = true;
          box.receiveShadow = true;
          boxGroup.add(box);
        }
      }
    }
    return boxGroup;
  }
  Menger.prototype._setGeneration = function(gen) {
    this.generation = gen;

    var box = this._makeBoxGroup();
    var scale = 1/3;
    box.scale.set(scale, scale, scale);
    this.group.add(box);

    // TODO: take last group and duplicate it in the following pattern



  }
  Menger.prototype.increaseGeneration = function() {
    // clear all children
    // for (var i = 0; i < this.group.children.length; i++) {
    //   this.group.children.remove(this.group.children[i]);
    // }

    this._setGeneration(this.generation + 1);
  }


  // constants
  const CUBE_SIZE = 100;
  const MAX_GENERATION = 3;

  // scene objects
  var menger;
  var clock = new THREE.Clock();
  var generation = 0;

  function makeScene() {
    // Plane
    var geometry = new THREE.PlaneGeometry(200, 200, 1, 1);
    var material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0,
    });
    var plane = new THREE.Mesh(geometry, material);
    plane.position.set(-155.58, -75, -158.64);
    plane.rotation.set(Math.radians(-90), 0, 0);
    plane.scale.set(3, 3, 3);
  	plane.receiveShadow = true;
    scene.add(plane);

    // Menger Sponge
    geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 1, 1, 1);
    material = new THREE.MeshStandardMaterial({
      color: 0xFF57A1,
      roughness: 0.5,
      metalness: 0,
    });
    menger = new Menger(geometry, material);
    scene.add(menger.group);
    menger.increaseGeneration();

    // enable shadow maps
    renderer.shadowMap.enabled = true;
  	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // spotlight 1
    var spotLight = new THREE.SpotLight(0x8168FF, 1.2, 1000, 0.314, 0, 2);
    spotLight.position.set(100, 200, 200);
    // shadowmap
    spotLight.castShadow = true;
    scene.add(spotLight);

    // spotlight 2
    var spotLight2 = new THREE.SpotLight(0xFF98D1, 1.0, 1000, 0.314, 0, 2);
    spotLight2.position.set(200, 200, 150);
    // shadowmap
    spotLight2.castShadow = true;
    scene.add(spotLight2);
  }

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    menger.group.rotation.x += 0.01;
  	menger.group.rotation.y += 0.02;

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
    camera = new THREE.PerspectiveCamera(50, w/h, 0.1, 1000000);
    camera.position.set(194.27, 91.54, 194.24);
    camera.rotation.set(Math.radians(-26.57), Math.radians(41.81), Math.radians(18.43));
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
    // stats
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
