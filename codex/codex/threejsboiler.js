define(['lib/three.min', 'lib/underscore-min', 'lib/stats.min', 'lib/OrbitControls', 'lib/canvas-toBlob', 'lib/filesaver.min'], function(threejs, _, stats, orbit, blob, fs) {

  // some helpers
  Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  }
  Math.linMap = function(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  };

  function threejsboiler(frameRate, makeScene, animate) {

    // prep scene and camera
    var w = window.innerWidth;
    var h = window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, w/h, 0.1, 1000000);
    this.camera.position.set(194.27, 91.54, 194.24);
    this.camera.rotation.set(Math.radians(-26.57), Math.radians(41.81), Math.radians(18.43));

    // prep renderer
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setClearColor(new THREE.Color(0x000000));
    document.body.appendChild(this.renderer.domElement);

    // resize event
    window.addEventListener('resize', function() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }, false);

    // orbit controls
    var orbit = new THREE.OrbitControls(camera, renderer.domElement);

    // stats
    this.stats = new stats();
    this.stats.dom.style.cssText="position:fixed;bottom:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
    document.body.appendChild(this.stats.dom);

    // setup
    this.clock = new THREE.Clock();
    makeScene();
    
    this.renderFrame = function() {
      requestAnimationFrame(this.renderFrame);
      this.stats.begin();

      animate();

      this.renderer.render(this.scene, this.camera);

      this.stats.end();
    }

    // run!
    renderFrame();
  }

  return threejsboiler;

});
