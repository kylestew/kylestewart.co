
uniform sampler2D t_audio;

varying vec3 vNorm;
varying vec2 vUv;

varying vec4 vAudio;

void main() {

  vec4 audio = texture2D(t_audio, vec2(vUv.x, 0.));

  vec3 col = vNorm * .5 + .5; // color based on normal
  col *= 1.5 * audio.xyz;

  gl_FragColor = vec4(col, 1.);
}
