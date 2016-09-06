define(['codex/threejsboiler', 'lib/three'], function(Sketch, THREE) {

  // constants

  // scene objects
  var group;

  function setup(scene, camera, renderer) {
    renderer.setClearColor(new THREE.Color(0x121212));
    camera.fov = 50;
    camera.position.set(24, 20, 24);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  function resetScene(scene, camera, renderer, shaders) {
    // directional light
    var light = new THREE.DirectionalLight(0xffffff, 0.7);
    light.position.set(-10, 20, 10);
    scene.add(light);
    // var helper = new THREE.DirectionalLightHelper(light, 10.0);
    // scene.add(helper);

    // directional light 2
    light = new THREE.DirectionalLight(0xbfc0d0, 0.55);
    light.position.set(20, 4, -20);
    scene.add(light);
    // helper = new THREE.DirectionalLightHelper(light, 10.0);
    // scene.add(helper);

    // cube prefab
    geometry = new THREE.SphereBufferGeometry(0.5, 8, 8);
    var material = new THREE.MeshPhongMaterial({
      color: 0xe71fe8,
      specular: 0x1aeaf1,
      emissive: 0x030c27,
      shininess: 94,
      shading: THREE.FlatShading
    });
    var prefab = new THREE.Mesh(geometry, material);

    // create grid
    group = new THREE.Group();
    var count = 16;
    for (var x = 0; x < count; x++) {
      for (var z = 0; z < count; z++) {
        var clone = prefab.clone();
        clone.material = prefab.material.clone();
        clone.position.x = x - count/2.0;
        clone.position.z = z - count/2.0;
        group.add(clone);
      }
    }
    scene.add(group);
  }

  function animate(scene, camera, renderer, clock) {
    // set animation time
    var loopTime = 12;
    var ang = Math.linMap(clock.getElapsedTime() % 12, 0, loopTime, 0, 2*Math.PI);

    camera.position.x = Math.sin(ang) * 40;
    camera.position.z = Math.cos(ang) * 40;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var center = new THREE.Vector3(0, 0, 0);
    var children = group.children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];

      var dist = child.position.distanceTo(center);
      dist = Math.linMap(dist, 0, 14, -Math.PI/2, Math.PI/2);
      dist += ang;
      child.scale.y = 16.0 * Math.abs(Math.sin(dist));
    }
  }

  var sketch = new Sketch(setup, null, resetScene, animate);
});
