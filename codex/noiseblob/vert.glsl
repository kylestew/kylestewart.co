
uniform float Time;
uniform float Stride;
uniform float Multiply;

varying vec3 vPos;
varying vec3 vNorm;
varying float vDisplacement;
varying vec2 vSEM;

$simplex
$semLookup

void main() {
  // determine a position to sample in the noise
  // use time and some good ole trig
  vec3 nPos = normalize(position);
  vec3 offset;
  offset.x = nPos.x + cos(Time / 10.0);
  offset.y = nPos.y + sin(Time / 10.0);
  offset.z = nPos.z;
  offset *= Stride;

  // sample noise at offset
  // float displacement = snoise(offset);
	// displacement *= Multiply;
  // displacement += 0.5; // zero = base geometry
  // TEMP
  float displacement = 1.0;

	// apply displacement to model space vertex
	vec4 pos = vec4(position * displacement, 1.0);

	// convert vertex to world space before sending to fragment
	pos *= modelMatrix;

	// pass needed data to fragment shader
	vPos = pos.xyz; // world coords
	vNorm = normalMatrix * normal; // world coords
	vDisplacement = displacement;

	// calculate SEM shit
	vec4 mvPos = projectionMatrix * viewMatrix * pos;
	vSEM = semLookup( normalize(mvPos.xyz), normalize(vNorm) );

	// convert position all the way to projection coordinates
	gl_Position = mvPos;
}
