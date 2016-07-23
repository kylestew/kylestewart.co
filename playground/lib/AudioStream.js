define(function() {

  function AudioStream(file, params) {
    this.params = _.defaults(params || {}, {
      loop: false,
    });

    this.ctx = new AudioContext();
    this.file = file;

    this._createSource();

    // empty texture needed to bind to shader right away
    var data = this._processAudio();
    this.texture = new THREE.DataTexture(
      data,
      data.length / 16,
      1,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    this.texture.needsUpdate = true;
  }

  AudioStream.prototype._createSource = function() {
    this.audio = new Audio();
    this.audio.src = this.file;
    this.audio.loop = this.params.loop;

    this.source = this.ctx.createMediaElementSource(this.audio);
    this.gain = this.ctx.createGain();
    this.analyser = this.ctx.createAnalyser();

    this.source.connect(this.gain);
    this.gain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    this.analyser.frequencyBinCount = 1024;
    this.analyser.array = new Uint8Array(this.analyser.frequencyBinCount);
  }

  AudioStream.prototype.play = function() {
    //doing tiny timeout or for some reason
    //song won't play.. TODO: Investigate
    var self = this;
    setTimeout(function(){
      self.audio.play();
      self.playing = true;
    },10);
  }

  AudioStream.prototype.stop = function() {
    this.audio.pause();
  }

  AudioStream.prototype.update = function() {
    // load FFT data into array
    this.analyser.getByteFrequencyData(this.analyser.array);

    this.audioData = this._processAudio();
    this.texture.image.data = this.audioData;
    this.texture.needsUpdate = true;
  }

  AudioStream.prototype._processAudio = function() {
    // pack FFT data into texture format
    var width = this.analyser.frequencyBinCount;
    var audioTextureData = new Float32Array(width);
    for (var i = 0; i < width; i+=4) {
      audioTextureData[ i+0 ] = this.analyser.array[ (i/4) + 0 ] / 256;
      audioTextureData[ i+1 ] = this.analyser.array[ (i/4) + 1 ] / 256;
      audioTextureData[ i+2 ] = this.analyser.array[ (i/4) + 2 ] / 256;
      audioTextureData[ i+3 ] = this.analyser.array[ (i/4) + 3 ] / 256;
    }
    return audioTextureData;
  }

  return AudioStream;
});
