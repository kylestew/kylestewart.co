
uniform vec3      Color;
uniform vec3      NoiseSeed;
uniform float     NoisePower;

varying vec2 vUv;
varying vec3 vPos;
varying float vDisplacement;

$kali

void main() {

  vec3 nPos = .4 * normalize(vPos);
  vec3 normalColor = normalize(Color);
  vec3 c = kali3(nPos, NoiseSeed);
  vec3 cN = normalize(normalize(c) + 3.0 * Color + 1.0 * nPos);

  gl_FragColor = vec4(cN * ((vDisplacement - .5) / 0.4), 1.0);

}
