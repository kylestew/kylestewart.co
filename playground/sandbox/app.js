
var loader = new THREE.TextureLoader();
var matcap = loader.load('../img/rough-aluminium.jpg');
var uniforms = {
  t_matcap: {
    type: "t",
    value: matcap
  }
}

var scene, camera, renderer;
var stats;

var shaders = new ShaderLoader('.', '../shaderChunks');
shaders.shaderSetLoaded = function() {
  init();
  animate();
}
shaders.load('vs-rainbow', 'rainbow', 'vertex');
shaders.load('fs-rainbow', 'rainbow', 'fragment');


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

  renderer.render(scene, camera);

  stats.end();
}
