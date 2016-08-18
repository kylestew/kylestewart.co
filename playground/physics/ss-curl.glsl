
uniform sampler2D t_oPos; // old positions
uniform sampler2D t_pos; // current positions
uniform vec2  resolution; // resolution of simulation

uniform float dT;
uniform float noiseSize;

varying vec2 vUv;

$simplex
$curl

float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  // which point are we operating on?
  vec2 uv = gl_FragCoord.xy / resolution;

  // get the positions from our "textures"
  vec4 oPos = texture2D(t_oPos, uv);
  vec4 pos  = texture2D(t_pos, uv);

  // particles velocity can be determined by the current and last position
  vec3 vel = pos.xyz - oPos.xyz;

  // make a new position - this is your custom code
  vec3 curl = curlNoise( pos.xyz * noiseSize );
  vel += curl * .01;
  vel *= .97; // dampening
  vec3 p = pos.xyz + vel;

  // position is returned via frag color
  gl_FragColor = vec4(p , 1.);
}
