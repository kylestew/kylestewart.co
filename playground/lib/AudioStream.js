define(function() {

  function AudioStream(file, params) {
    this.params = _.defaults(params || {}, {
      loop: false,
    });

    this.ctx = new AudioContext();
    this.file = file;

    this.createSource();
  }

  AudioStream.prototype.createAudio = function() {
    this.audio = new Audio();

    this.audio.src = this.file;
    this.audio.loop = this.params.loop;
  }

  AudioStream.prototype.createSource = function() {
    this.createAudio();

    this.gain = this.ctx.createGain();

    this.source         = this.ctx.createMediaElementSource( this.audio );

    this.source.connect(this.gain);

    this.gain.connect(this.ctx.destination);


  }

  AudioStream.prototype.play = function() {
    var self = this;

//doing tiny timeout or for some reason
//song won't play.. TODO: Investigate
setTimeout(function(){
  if(!self.source){
      self.createSource();
      self.audio.play();

  }else{

      self.audio.play();
  }
  self.playing = true;
},10);
  }

  return AudioStream;
});
