define([
  'codex/threejsboiler', 'lib/three', 'effects/EffectComposer', 'effects/ShaderPass', 'shaders/CopyShader', 'effects/RenderPass', 'effects/BloomPass', 'shaders/ConvolutionShader', 'shaders/BokehShader', 'effects/BokehPass', 'shaders/FXAAShader', 'effects/FilmPass'
], function(Sketch, THREE, EffectComposer, ShaderPass, CopyShader, RenderPass, BloomPass, ConvolutionShader, BokehShader, BokehPass, FXAAShader, FilmPass) {

  // constants

  // scene objects
  var geometry;
  var mesh, particles;

  function setup(scene, camera, renderer) {
    camera.fov = 50;
    camera.position.set(15, 15, 18);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer.sortObjects = false;
    renderer.autoClear = false;
  }

  /* https://github.com/mrdoob/three.js/blob/master/src/extras/geometries/SphereBufferGeometry.js */
  function createSphereGeometry(radius, widthSegments, heightSegments) {
    // bound inputs with defaults
    radius = radius || 50;
    widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
    heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

    var geometry = new THREE.Geometry();
    var vertices = [];
    var index = 0;
    for (var y = 0; y <= heightSegments; y++) {

      var verticesRow = [];
      var v = y / heightSegments;

      for (var x = 0; x <= widthSegments; x++) {

        var u = x / widthSegments;

        // position of vertices
        var px = -radius * Math.cos( u * 2 * Math.PI ) * Math.sin( v * Math.PI );
        var py = radius * Math.cos( v * Math.PI );
        var pz = radius * Math.sin( u * 2 * Math.PI ) * Math.sin( v * Math.PI );

        // add to geometry
        geometry.vertices.push( new THREE.Vector3(px, py, pz) );

        // track its index for later use in faces
        verticesRow.push(index);

        index++;
      }
      vertices.push(verticesRow);
    }

    // add faces using indice array
    for (var y = 0; y < heightSegments; y++) {
      for (var x = 0; x < widthSegments; x++) {

        // mesh is made of triangles bridging the vertice rows
        var v1 = vertices[ y ][ x + 1 ];
        var v2 = vertices[ y ][ x ];
        var v3 = vertices[ y + 1 ][ x ];
        var v4 = vertices[ y + 1 ][ x + 1 ];

        if ( y !== heightSegments - 1 )
          geometry.faces.push( new THREE.Face3( v2, v3, v4) );

      }
    }

    geometry.computeBoundingSphere();

    return geometry;
  }

  function prepareEffectComposer(scene, camera, renderer) {
    var width = window.innerWidth || 2;
		var height = window.innerHeight || 2;

    var composer = new THREE.EffectComposer( renderer );

    var renderModel = new THREE.RenderPass( scene, camera );

    effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
		effectFXAA.uniforms[ 'resolution' ].value.set( 1 / width, 1 / height );

    var effectBloom = new THREE.BloomPass( 0.8 );
    var effectFilm = new THREE.FilmPass( 0.45, 0.025, 648, false );

    var effectCopy = new THREE.ShaderPass( THREE.CopyShader );
    effectCopy.renderToScreen = true;

    composer.addPass( renderModel );
    composer.addPass( effectFXAA );
    composer.addPass( effectBloom );
    composer.addPass( effectFilm );
    composer.addPass( effectCopy );

    return composer;
  }

  function resetScene(scene, renderer) {
    // directional light
    var light = new THREE.DirectionalLight(0xffffff, 0.75);
    light.position.set(-100, 100, 150);
    scene.add(light);

    // we are inside an icosahedron!
    // gives a subtle gradient backdrop
    var geometry = new THREE.IcosahedronGeometry(75, 1);
    var material = new THREE.MeshStandardMaterial({
      color: 0x0f0f0f,
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.BackSide,
    });
    var ico = new THREE.Mesh(geometry, material);
    scene.add(ico);

    // sphere mesh
    geometry = createSphereGeometry(10, 32, 32);

    // display lines
    material = new THREE.MeshBasicMaterial({
      color: 0xeeeeee,
      wireframe: true,
      wireframeLinewidth: 0.333,
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // display vertices
    material = new THREE.PointsMaterial({
      color: 0xeeeeee,
      size: 0.333,
    });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
  }

  function animate(scene, camera, renderer, clock) {
    var time = clock.getElapsedTime();

    mesh.rotation.x = particles.rotation.x += 0.001;
  	mesh.rotation.y = particles.rotation.y += 0.005;

    // TODO: update vertice positions
  }

  var sketch = new Sketch(setup, null, resetScene, animate, {
    prepareEffectComposer: prepareEffectComposer
  });
});
