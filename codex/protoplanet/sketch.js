define(function(require) {
  require('lib/dat.gui.min');
  var THREE = require('lib/three.min');

  // constants
  const WIDTH = 64;
  const PARTICLES = WIDTH * WIDTH;

  // scene objects
  var geometry, material;
  var gpuCompute;
  var velocityVariable, positionVariable;
  var velocityUniforms, positionUniforms;
  var particleUniforms;

  var params = {
    gravityConstant: 100.0,
    density: 0.45,

    radius: 300,
    height: 8,
    exponent: 0.4,
    maxMass: 15.0,
    velocity: 70,
    velocityExponent: 0.2,
    randVelocity: 0.001
  };
  function updateDynamicParams() {
    velocityUniforms.gravityConstant.value = params.gravityConstant;
    velocityUniforms.density.value = params.density;
    particleUniforms.density.value = params.density;
  }
  function createUI(sketch) {
    var gui = new dat.GUI();

    var dynamic = gui.addFolder('Dynamic Parameters');
    dynamic.add(params, "gravityConstant", 0.0, 1000.0, 0.05).onChange(updateDynamicParams);
    dynamic.add(params, "density", 0.0, 10.0, 0.001).onChange(updateDynamicParams);
    dynamic.open();

    var normal = gui.addFolder('Static Parameters - Press Reset');
    normal.add(params, "radius", 10.0, 1000.0, 1.0);
    normal.add(params, "height", 0.0, 50.0, 0.01);
    normal.add(params, "exponent", 0.0, 2.0, 0.001);
    normal.add(params, "maxMass", 1.0, 50.0, 0.1);
    normal.add(params, "velocity", 0.0, 150.0, 0.1);
    normal.add(params, "velocityExponent", 0.0, 1.0, 0.01);
    normal.add(params, "randVelocity", 0.0, 50.0, 0.1);
    normal.open();

    sketch.addResetToGUI(gui, params);
  }

  function setup(scene, camera, renderer) {
    camera.fov = 75;
    camera.position.y = 120;
    camera.position.z = 400;
  }

  function loadShaders(shaderLoader) {
    shaderLoader.load('particleVertexShader', 'particles', 'vertex');
    shaderLoader.load('particleFragmentShader', 'particles', 'fragment');
    shaderLoader.load('computeShaderPosition', 'position', 'simulation');
    shaderLoader.load('computeShaderVelocity', 'velocity', 'simulation');
  }

  function resetScene(scene, camera, renderer, shaders) {
    // compute renderer
    var GPUComputationRenderer = require('lib/GPUComputationRenderer');
    gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);

    var dtPosition = gpuCompute.createTexture();
    var dtVelocity = gpuCompute.createTexture();
    fillTextures(dtPosition, dtVelocity);

    velocityVariable = gpuCompute.addVariable("textureVelocity", shaders.simulationShaders.velocity, dtVelocity);
    positionVariable = gpuCompute.addVariable("texturePosition", shaders.simulationShaders.position, dtPosition);

    gpuCompute.setVariableDependencies(velocityVariable, [ positionVariable, velocityVariable ]);
    gpuCompute.setVariableDependencies(positionVariable, [ positionVariable, velocityVariable ]);

    // keep handle to compute uniforms
    positionUniforms = positionVariable.material.uniforms;
    velocityUniforms = velocityVariable.material.uniforms;
    velocityUniforms.gravityConstant = { value: 0.0 };
    velocityUniforms.density = { value: 0.0 };

    var error = gpuCompute.init();
    if ( error !== null ) {
        console.error( error );
    }

    initProtoplanets(scene, camera, shaders);

    updateDynamicParams();
  }

  function fillTextures(texturePosition, textureVelocity) {
    var posArray = texturePosition.image.data;
    var velArray = textureVelocity.image.data;

    var radius = params.radius;
    var height = params.height;
    var exponent = params.exponent;
    var maxMass = params.maxMass * 1024 / PARTICLES;
    var maxVel = params.velocity;
    var velExponent = params.velocityExponent;
    var randVel = params.randVelocity;

    // fill in each position / velocity vector - stride by 4 (size of vector)
    for (var k = 0, kl = posArray.length; k < kl; k += 4) {
      // Position
      var x, y, z, rr;

      // pick a random x, z coord - make sure its in a circular radius of 1
      do {
        x = (Math.random() * 2 - 1);
        z = (Math.random() * 2 - 1);
        rr = x * x + z * z;
      } while (rr > 1);

      // distance to point from center
      rr = Math.sqrt(rr);

      // prepare a value to map from unit to real coordinates
      var rExp = radius * Math.pow(rr, exponent);

      // Velocity
      // using distance as a initial velocity factor
      var vel = maxVel * Math.pow(rr, velExponent);

      // break velocity into vector components
      // we need unit values for position here
      var vx = vel * z + (Math.random() * 2 - 1) * randVel;
      var vy = (Math.random() * 2 - 1) * randVel * 0.05;
      var vz = -vel * x + (Math.random() * 2 - 1) * randVel;

      // map out x, y coordinates from unit to real
      x *= rExp;
      z *= rExp;
      // give a little height variety
      y = (Math.random() * 2 - 1) * height;

      // random mass
      var mass = Math.random() * maxMass + 1;

      // fill in texture values
      posArray[k + 0] = x;
      posArray[k + 1] = y;
      posArray[k + 2] = z;
      posArray[k + 3] = 1;

      velArray[k + 0] = vx;
      velArray[k + 1] = vy;
      velArray[k + 2] = vz;
      velArray[k + 3] = mass;
    }
  }

  function initProtoplanets(scene, camera, shaders) {
    geometry = new THREE.BufferGeometry();

    var positions = new Float32Array(PARTICLES * 3);
    var p = 0;
    // positions aren't used, but are needed to fire shader
    for (var i = 0; i < PARTICLES * 3; i++) {
      positions[p++] = 0;
    }

    var uvs = new Float32Array( PARTICLES * 2 );
    p = 0;
    for ( var j = 0; j < WIDTH; j++ ) {
      for ( var i = 0; i < WIDTH; i++ ) {
        uvs[ p++ ] = i / ( WIDTH - 1 );
        uvs[ p++ ] = j / ( WIDTH - 1 );
      }
    }

    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    particleUniforms = {
      texturePosition: { value: null },
      textureVelocity: { value: null },
      cameraConstant: { value: getCameraConstant(camera) },
      density: { value: 0.0 }
    }

    material = new THREE.ShaderMaterial({
      uniforms: particleUniforms,
      vertexShader: shaders.vertexShaders.particles,
      fragmentShader: shaders.fragmentShaders.particles,
    });
    material.extensions.drawBuffers = true;

    var particles = new THREE.Points(geometry, material);
    particles.matrixAutoUpdate = false;
    particles.updateMatrix();

    scene.add(particles);
  }

  function getCameraConstant(camera) {
    return window.innerHeight / ( Math.tan( THREE.Math.DEG2RAD * 0.5 * camera.fov ) / camera.zoom );
  }

  function animate() {
    gpuCompute.compute();

    // feed compute shader output to particle shader
    particleUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
    particleUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget(velocityVariable).texture;
  }

  var threejsboiler = require('codex/threejsboiler');
  var sketch = new threejsboiler(setup, createUI, resetScene, animate, loadShaders);
});
