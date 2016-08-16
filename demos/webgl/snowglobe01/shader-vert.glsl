
uniform sampler2D t_audio;

varying vec3 vNorm;
varying vec2 vUv;

varying float vAudioLookup;
varying vec4 vAudio;

void main(){

  // pass along data to the frag shader
  vNorm = normal;

  vAudioLookup = abs(normal.x * normal.y * normal.z * 3.);
  vec4 audio = texture2D(t_audio, vec2(vAudioLookup, 0.));

  vAudio = audio;

  vUv = uv;

  vec3 pos = position;

  // add a really cheap effect
  pos.x += audio.x * 100.;
  pos.y += audio.y * -40.;
  pos.z += audio.z * 20.;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
