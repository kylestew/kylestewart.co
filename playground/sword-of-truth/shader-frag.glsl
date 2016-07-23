
uniform vec3 Color;

varying vec3 vNPos;
varying float vDisplacement;

$kali

void main() {

  vec3 color = abs(Color + .3 * abs(vNPos) + vDisplacement);
  vec3 normalColor = normalize(Color);
  color += .1 * kali3(vNPos, -1. * normalColor);

  gl_FragColor = vec4(normalize(color) * vDisplacement, 1.);
}
