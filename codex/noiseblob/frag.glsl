uniform vec3 Color;

varying vec2 vUv;
varying vec3 vPos;
varying float vDisplacement;

void main() {
	// colorize via normals
	vec3 nPos = normalize(vPos);
	gl_FragColor = vec4(Color * abs(nPos) * vDisplacement, 1.0);
}
