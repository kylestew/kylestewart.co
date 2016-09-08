
#ifdef GL_ES
precision mediump float;
#endif

void main() {
  // gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
  gl_Position = gl_Vertex;
}
