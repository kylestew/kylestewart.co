
uniform vec3      Color;
uniform vec3      NoiseSeed;
uniform float     NoisePower;

varying vec2 vUv;
varying vec3 vPos;
varying float vDisplacement;

$kali

void main() {

  vec3 nPos = normalize(vPos);
  vec3 c = kali3(nPos, NoiseSeed);
  vec3 cN = normalize(normalize(c) + 3.0 * Color);

  gl_FragColor = vec4(cN * ((vDisplacement - .5) / (NoisePower * 2.0)), 1.0);

  // vec3 color = abs(Color + .3 * abs(vNPos) + vDisplacement);
  // vec3 normalColor = normalize(Color);
  // color += .1 * kali3(vNPos, -1. * normalColor);
  // gl_FragColor = vec4(normalize(color) * vDisplacement, 1.);

}
