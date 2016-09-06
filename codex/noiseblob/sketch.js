define(function(require) {
  require('lib/dat.gui.min');
  var THREE = require('lib/three.min');

  var mesh;
  var matcap;
  matcap = THREE.ImageUtils.loadTexture('../assets/mats/matcap_candy.png');
  matcap.mapping = THREE.SphericalReflectionMapping;

  var uniforms = {
    ambientLightColor: { type: "c", value: new THREE.Color(0xffffff) },
    diffuseLightColor: { type: "c", value: new THREE.Color(0xffffff) },
    specularLightColor: { type: "c", value: new THREE.Color(0xffffff) },

    ambientMaterialColor: { type: "c", value: new THREE.Color(0x000000) },
    diffuseMaterialColor: { type: "c", value: new THREE.Color(0x000000) },
    specularMaterialColor: { type: "c", value: new THREE.Color(0x000000) },

    matcap: { type: "t", value: matcap },

    shininess: { type: "f", value: 0 },
    lightPosition: { type: "v3", value: new THREE.Vector3(300, 300, 300) },

    Time:       { type: "f" , value: 0 },
    Stride:     { type: "f" , value: 0 },
    Multiply:   { type: "f" , value: 0 },
    NormalsMix: { type: "f" , value: 0 },
  };

  var params = {

    material: "#626262",

    shininess: 80,
    // diffuse
    // ambient
    // specular

    stride: 0.8,
    multiply: 1,
    speed: 1,

    normalsMix: 0,
    // TODO: selectable material?
    matsMix: 0,
  };
  function createUI(sketch) {
    var gui = new dat.GUI();

    var adsl = gui.addFolder('Lighting Model - ASDL');

    adsl.addColor(params, 'material');
    // TODO: add rest of params

    adsl.add(params, 'shininess').min(0).max(100);

    adsl.open();

    var noise = gui.addFolder('Noise');
    noise.add(params, 'stride').min(0).max(2);
    noise.add(params, 'multiply').min(0).max(1.5);
    noise.add(params, 'speed').min(0).max(10);
    // noise.open();

    // gui.add
    gui.add(params, 'normalsMix').min(0).max(1);

    sketch.addResetToGUI(gui, params);
  }

  function setup(scene, camera, renderer) {
    camera.fov = 50;
    camera.position.set(240, 124, 147);
    camera.rotation.set(Math.radians(-40), Math.radians(50), Math.radians(33));
  }

  function loadShaders(shaderLoader) {
    shaderLoader.load('vert', 'main', 'vertex');
    shaderLoader.load('frag', 'main', 'fragment');
  }

  function resetScene(scene, camera, renderer, shaders) {
    // backdrop (causes subtle lighting changes on rotate)
    var geometry = new THREE.IcosahedronGeometry(600, 1);
    var material = new THREE.MeshStandardMaterial({
      color: 0x808080,
      roughness: 1.0,
      metalness: 0.5,
      side: THREE.BackSide,
    });
    var ico = new THREE.Mesh(geometry, material);
    scene.add(ico);

    // point light 1
    var pointlight1 = new THREE.PointLight(0xE7F7FD, 2, 750, 2);
    pointlight1.position.set(300, 230, 0);
    scene.add(pointlight1);

    // point light 2
    var pointlight2 = new THREE.PointLight(0x9BB9FF, 1, 500, 2);
    pointlight2.position.set(35, -50, 100);
    scene.add(pointlight2);

    // hemisphere light
    var hemilight = new THREE.HemisphereLight(0x9CFDFB, 0x161B67, 0.4);
    hemilight.position.set(0, 10, 0);
    scene.add(hemilight);

    // blob (custom shader)
    var geometry = new THREE.OctahedronGeometry(50, 6); // rad, detail
    geometry.computeVertexNormals();

    var material = new THREE.ShaderMaterial({
      uniforms:       uniforms,
      vertexShader:   shaders.vertexShaders.main,
      fragmentShader: shaders.fragmentShaders.main,
      lights: true,
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  function animate(scene, camera, renderer, clock) {
    var time = clock.getElapsedTime() * 0.4;

    // slowly rotate camera
    camera.position.x = Math.cos( time ) * 200;
    camera.position.z = Math.sin( time ) * 200;
    camera.lookAt( new THREE.Vector3() );

    // update uniforms
    // uniforms.ambientMaterialColor.value = new THREE.Color(params.material);

    // uniforms.shininess.value = params.shininess;

    // uniforms.Time.value = time * params.speed;
    // uniforms.Stride.value = params.stride;
    // uniforms.Multiply.value = params.multiply;
    // uniforms.NormalsMix.value = params.normalsMix;
  }

  var threejsboiler = require('codex/threejsboiler');
  var sketch = new threejsboiler(setup, createUI, resetScene, animate, loadShaders);
});
