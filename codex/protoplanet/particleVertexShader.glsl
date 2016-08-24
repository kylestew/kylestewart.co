#include <common>

uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;

varying vec4 vColor;

float radiusFromMass(float mass) {
  return 0;
}

void main() {
  gl_Position = vec4(0,0,0,0);
}
