/*
  Based off https://github.com/cabbibo/wombs/blob/gh-pages/audioSketches/thing/app.js
  I understand about half of it :/
*/

uniform float     Time;
uniform sampler2D AudioTexture;
uniform float     NoiseSize;
uniform float     NoisePower;
uniform float     NoiseSpeed;
uniform float     AudioPower;

varying vec2 vUv;
varying vec3 vPos;
varying float vDisplacement;

$simplex

vec3 absAudioPosition(sampler2D t ,vec3 p) {
  vec3 nPos = normalize(p);
  nPos.x = length( texture2D( t , vec2( abs(nPos.x) , 0.0 ) ) );
  nPos.y = length( texture2D( t , vec2( abs(nPos.y) , 0.0 ) ) );
  nPos.z = length( texture2D( t , vec2( abs(nPos.z) , 0.0 ) ) );
  return nPos;
}

void main() {

  vUv = uv;
  vPos = position;

  vec3 pos = position;

  // use time to determine position to sample noise
  vec3 nPos = normalize(position);
  vec3 offset;
  offset.x = nPos.x + cos(Time * NoiseSpeed);
  offset.y = nPos.y + sin(Time * NoiseSpeed);
  offset.z = nPos.z;
  offset *= NoiseSize;
  float dNoise = snoise(offset);

  // use audio texture to determine another noise sample point
  vec3 audioPosition = absAudioPosition(AudioTexture, position);
  float dAudio = snoise(audioPosition);

  // combine noise samples to determine displacement
  vDisplacement = length(audioPosition * AudioPower) + (dNoise * NoisePower) + .8;

  // diplace vertex with final value
  pos *= vDisplacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
