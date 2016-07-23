
uniform float Time;
uniform sampler2D AudioTexture;
uniform float NoisePower;
uniform float AudioPower;

varying vec3 vNPos;
varying float vDisplacement;

$simplex

void main() {

  // use some normal thing for position into noise
  // TODO: what is this?
  vNPos = normalize(position);
  vec3 offset;
  offset.x = vNPos.x + Time * .3;
  offset.y = vNPos.y + Time * .2;
  offset.z = vNPos.z + Time * .24;
  // ??? huh
  vec2 a = vec2(abs(vNPos.y), 0.);

  // use combo of audio texture and noise to determine vertex displacement
  float audio = texture2D(AudioTexture, a).r;
  vDisplacement = NoisePower * snoise(offset);
  vDisplacement += AudioPower * audio * audio;

  // diplace vertex
  vec3 pos = position;
  pos *= .1 * abs(vDisplacement + 3.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
