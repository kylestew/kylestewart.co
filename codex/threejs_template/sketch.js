define(function(require) {

  // constants
  const CUBE_SIZE = 100;

  // scene objects
  var box;

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

    // Box
    geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 1, 1, 1);
    material = new THREE.MeshStandardMaterial({
      color: 0xFF57A1,
      roughness: 0.5,
      metalness: 0,
    });
    box = new THREE.Mesh(geometry, material);
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add(box);

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
    box.rotation.x += 0.01;
  	box.rotation.y += 0.02;
  }

  var threejsboiler = require('codex/threejsboiler');
  var sketch = threejsboiler(60, makeScene, animate);
});
