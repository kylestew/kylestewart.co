define(function(require) {
  require('lib/dat.gui.min');
  var THREE = require('lib/three');

  // constants
  // texture width for simulation
  const WIDTH = 128;
  const NUM_TEXELS = WIDTH * WIDTH;

  // water size in system units
  var BOUNDS = 512;
  var BOUNDS_HALF = BOUNDS / 2;

  // scene objects
  var waterMesh;
  var meshRay;
  var gpuCompute;
  var heightmapVariable;
  var waterUniforms;
  // var smoothShader;

  var mouseMoved = false;
  var mouseCoords = new THREE.Vector2();
  var raycaster = new THREE.Raycaster();

  var params = {
    mouseSize: 20.0,
    viscosity: 0.03,
  };
  function updateDynamicParams() {
    heightmapVariable.material.uniforms.mouseSize.value = params.mouseSize;
    heightmapVariable.material.uniforms.viscosityConstant.value = params.viscosity;
  }
  function createUI(sketch) {
    var gui = new dat.GUI();

    gui.add(params, "mouseSize", 1.0, 100.0, 1.0).onChange(updateDynamicParams);
    gui.add(params, "viscosity", 0.0, 0.1, 0.001).onChange(updateDynamicParams);

    var buttonSmooth = {
      smoothWater: function() {
        smoothWater();
      }
    };
    gui.add(buttonSmooth, 'smoothWater');

    sketch.addResetToGUI(gui, params);
  }

  function setup(scene, camera, renderer) {
    camera.fov = 75;
    camera.position.y = 200;
    camera.position.z = 350;

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
  }

  function loadShaders(shaderLoader) {
    shaderLoader.load('waterVertexShader', 'water', 'vertex');
    shaderLoader.load('computeShaderHeightmap', 'heightmap', 'simulation');
  }

  function resetScene(scene, camera, renderer, shaders) {
    var sun = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
    sun.position.set( 300, 400, 175 );
    scene.add( sun );

    var sun2 = new THREE.DirectionalLight( 0x40A040, 0.6 );
    sun2.position.set( -100, 350, -200 );
    scene.add( sun2 );

    initWater(scene, renderer, shaders);

    updateDynamicParams();
  }

  function initWater(scene, renderer, shaders) {
  	var geometry = new THREE.PlaneBufferGeometry(BOUNDS, BOUNDS, WIDTH - 1, WIDTH -1);

		// material: make a ShaderMaterial clone of MeshPhongMaterial, with customized vertex shader
    // we need to be able to apply a heightmap
		var material = new THREE.ShaderMaterial( {
			uniforms: THREE.UniformsUtils.merge([
				THREE.ShaderLib['phong'].uniforms, {
					heightmap: { value: null }
				}
			]),
			vertexShader: shaders.vertexShaders.water,
			fragmentShader: THREE.ShaderChunk['meshphong_frag']
		});

    material.lights = true;

    // Material attributes from MeshPhongMaterial
		material.color = new THREE.Color(0x0040C0);
		material.specular = new THREE.Color(0x111111);
		material.shininess = 50;

		// Sets the uniforms with the material values
		material.uniforms.diffuse.value = material.color;
		material.uniforms.specular.value = material.specular;
		material.uniforms.shininess.value = Math.max(material.shininess, 1e-4);
		material.uniforms.opacity.value = material.opacity;

    // Defines
    material.defines.WIDTH = WIDTH.toFixed(1);
    material.defines.BOUNDS = BOUNDS.toFixed(1);

    waterUniforms = material.uniforms;

    waterMesh = new THREE.Mesh(geometry, material);
    waterMesh.rotation.x = -Math.PI/2;
    waterMesh.matrixAutoUpdate = false;
    waterMesh.updateMatrix();

    scene.add(waterMesh);

    // Mesh just for mouse raycasting
    var geometryRay = new THREE.PlaneBufferGeometry(BOUNDS, BOUNDS, 1, 1);
    meshRay = new THREE.Mesh( geometryRay, new THREE.MeshBasicMaterial({color: 0xFFFFFF, visible: false}));
    meshRay.rotation.x = -Math.PI/2;
    meshRay.matrixAutoUpdate = false;
    meshRay.updateMatrix();
    scene.add(meshRay);

    // setup gpu computation
    var GPUComputationRenderer = require('lib/GPUComputationRenderer');
    gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);

    var heightmap0 = gpuCompute.createTexture();
    fillTexture(heightmap0);

    heightmapVariable = gpuCompute.addVariable("heightmap", shaders.simulationShaders.heightmap, heightmap0);

    gpuCompute.setVariableDependencies(heightmapVariable, [ heightmapVariable ]);

    // keep handle to compute uniforms
    heightmapVariable.material.uniforms.mousePos = { value: new THREE.Vector2(10000, 10000) };
    heightmapVariable.material.uniforms.mouseSize = { value: 20.0 };
    heightmapVariable.material.uniforms.viscosityConstant = { value: 0.03 };
    heightmapVariable.material.defines.BOUNDS = BOUNDS.toFixed(1);

    var error = gpuCompute.init();
    if ( error !== null ) {
      console.error( error );
    }

    // create computer shader to smooth the water surface and velocity
    // smoothShader = gpuCompute.createShaderMaterial( document.getElementById( 'smoothFragmentShader' ).textContent, { texture: { value: null } } );
  }

  function fillTexture(texture) {
    var SimplexNoise = require('lib/SimplexNoise');
    var simplex = new SimplexNoise();

    var waterMaxHeight = 10;

    function noise(x, y, z) {
      var multR = waterMaxHeight;
      var mult = 0.025;
      var r = 0;
      // sample noise in octaves?
      for (var i = 0; i < 15; i++) {
        r += multR * simplex.noise3d(x * mult, y * mult, z * mult);
        multR *= 0.53 + 0.025 * i;
        mult *= 1.25;
      }
      return r;
    }

    var pixels = texture.image.data;

    var p = 0;
    for (var j = 0; j < WIDTH; j++) {
      for (var i = 0; i < WIDTH; i++) {
        var x = i * 128 / WIDTH;
        var y = j * 128 / WIDTH;

        pixels[p + 0] = noise(x, y, 123.4);
        pixels[p + 1] = 0;
        pixels[p + 2] = 0;
        pixels[p + 3] = 1;

        p += 4;
      }
    }
  }

  function smoothWater() {
    debugger;
//     var currentRenderTarget = gpuCompute.getCurrentRenderTarget( heightmapVariable );
// var alternateRenderTarget = gpuCompute.getAlternateRenderTarget( heightmapVariable );
//
// for ( var i = 0; i < 10; i++ ) {
//
//   smoothShader.uniforms.texture.value = currentRenderTarget.texture;
//   gpuCompute.doRenderTarget( smoothShader, alternateRenderTarget );
//
//   smoothShader.uniforms.texture.value = alternateRenderTarget.texture;
//   gpuCompute.doRenderTarget( smoothShader, currentRenderTarget );
//
// }
  }

  function animate(scene, camera) {
    // Set uniforms: mouse interaction
    var uniforms = heightmapVariable.material.uniforms;
    if (mouseMoved) {
      raycaster.setFromCamera(mouseCoords, camera);

      var intersects = raycaster.intersectObject(meshRay);

      if ( intersects.length > 0 ) {
          var point = intersects[ 0 ].point;
          uniforms.mousePos.value.set( point.x, point.z );
      }
      else {
          uniforms.mousePos.value.set( 10000, 10000 );
      }

      mouseMoved = false;
    } else {
      uniforms.mousePos.value.set( 10000, 10000 );
    }

    gpuCompute.compute();

    // feed compute output to visual shader
    waterUniforms.heightmap.value = gpuCompute.getCurrentRenderTarget(heightmapVariable).texture;
  }

  /*== Interaction ==*/
  function setMouseCoords(x, y) {
    mouseCoords.set( ( x / sketch.renderer.domElement.clientWidth ) * 2 - 1, - ( y / sketch.renderer.domElement.clientHeight ) * 2 + 1 );
    mouseMoved = true;
  }
  function onDocumentMouseMove( event ) {
	  setMouseCoords( event.clientX, event.clientY );
	}
	function onDocumentTouchStart( event ) {
  	if ( event.touches.length === 1 ) {
  		event.preventDefault();
  		setMouseCoords( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
  	}
	}
	function onDocumentTouchMove( event ) {
		if ( event.touches.length === 1 ) {
			event.preventDefault();
			setMouseCoords( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
		}
	}

  var threejsboiler = require('codex/threejsboiler');
  var sketch = new threejsboiler(setup, createUI, resetScene, animate, loadShaders);
});
