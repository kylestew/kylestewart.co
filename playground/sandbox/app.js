define(function(require) {
  require('lib/three.min');
  require('lib/stats.min');
  require('lib/OrbitControls');
  require('lib/OBJLoader');


  // boilerplate constants
  var CAM_FOV = 72;
  var CAM_POS = [0, 0.2, 12.2];
  var CAM_ROT = [0, 0, 0];
  var ORBIT_CONTROLS = true;

  // scene objects
  var lights;
  var mesh;

  function prepareScene() {
    // cornell box
    var geometry = new THREE.BoxGeometry(1.2, 1.2, 1);
    var material = new THREE.MeshStandardMaterial({
      color: 0xFFFCF8,
      roughness: 1.0,
      metalness: 0.0,
      side: THREE.BackSide,
    });
    var room = new THREE.Mesh(geometry, material);
    room.receiveShadow = true;
    room.scale.set(10, 10, 10);
    scene.add(room);

    // enable shadow maps
    renderer.shadowMap.enabled = true;
  	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    lights = new THREE.Group();
    scene.add(lights);

    // point light 1
    var light1 = new THREE.PointLight(0xd312e7, 2.6, 12, 2);
    light1.position.set(0, 3, 0);
    light1.castShadow = true;
    light1.shadow.radius = 10;
    lights.add(light1);
    scene.add(new THREE.PointLightHelper(light1, 0.4));

    // point light 2
    var light2 = new THREE.PointLight(0xdc3df, 3, 12, 2);
    light2.position.set(0, -3, 0);
    light2.castShadow = true;
    light2.shadow.radius = 10;
    lights.add(light2);
    scene.add(new THREE.PointLightHelper(light2, 0.4));

    // fill light
    var light = new THREE.HemisphereLight(0xffffff, 0x080808, 0.2);
    scene.add( light );

    // load mat cap for prefab
    var loader = new THREE.TextureLoader();
    var matCap = loader.load('../assets/mats/matcap_gold.jpg');
  	matCap.mapping = THREE.SphericalReflectionMapping; // use as a mat cap instead of a env map

    // load masking map
    var maskMap = loader.load("../assets/mats/line_repeating.png");
  	maskMap.mapping = THREE.CubeReflectionMapping; // use as a mat cap instead of a env map
    maskMap.magFilter = THREE.NearestFilter;
    // maskMap.wrapS = THREE.MirroredRepeatWrapping;
    // maskMap.wrapT = THREE.MirroredRepeatWrapping;
    // maskMap.repeat = new THREE.Vector2(2,2);

    // create model texture
    var mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.0,
      metalness: 1.0,
      envMap: matCap,
      metalnessMap: maskMap,
      bumpMap: maskMap,
    });

    var loader = new THREE.OBJLoader();
    loader.load("../assets/obj/quad_pod.obj", function(obj) {
      mesh = obj;

      // apply material to all sub meshes
  		mesh.traverse(function(child) {
  		  if (child instanceof THREE.Mesh) {
  			  child.material = mat;
      child.castShadow = true;
      child.receiveShadow = true;
  			}
  		});
  		scene.add(mesh);

      // scale and configure for shadows
      mesh.scale.set(1.8, 1.8, 1.8);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
  	});
  }

  function animate() {
    requestAnimationFrame(animate);
    if (stats) stats.begin();

    var time = clock.getElapsedTime() * 0.4;

    // rotate camera
  	camera.position.x = Math.cos( time ) * 8;
  	camera.position.z = Math.sin( time ) * 8;
  	camera.lookAt(scene.position);

    // counter rotate mesh
    if (mesh) {
      mesh.rotation.y = Math.sin( time/4 ) * 4;
      mesh.rotation.z = Math.sin( time/8 ) * 4;
    }

    // rotate lights
    lights.rotation.x = Math.sin(time) * 4;

    renderer.render(scene, camera);
    if (stats) stats.end();
  }

  // === BOILERPLATE ===
  var scene, camera, renderer;
  var clock = new THREE.Clock();
  var stats;
  function initGL() {
    // prep scene and camera
    scene = new THREE.Scene();
    var w = window.innerWidth;
    var h = window.innerHeight;
    camera = new THREE.PerspectiveCamera(CAM_FOV, w/h, 0.1, 1000000);
    camera.position.set(CAM_POS[0], CAM_POS[1], CAM_POS[2]);
    camera.rotation.set(Math.radians(CAM_ROT[0]), Math.radians(CAM_ROT[1]), Math.radians(CAM_ROT[2]));
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
    // controls
    if (ORBIT_CONTROLS) {
      var orbit = new THREE.OrbitControls(camera, renderer.domElement);
    }
    // stats
    stats = new Stats();
    document.body.appendChild(stats.dom);
  }

  // some helpers
  Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  }

  // GO!
  initGL();
  prepareScene();
  animate();
});
