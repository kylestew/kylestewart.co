
uniform float NormalsMix;

uniform vec3 ambientLightColor;
uniform vec3 diffuseLightColor;
uniform vec3 specularLightColor;

uniform vec3 ambientMaterialColor;
uniform vec3 diffuseMaterialColor;
uniform vec3 specularMaterialColor;

uniform vec3 lightPosition;
uniform float shininess;

uniform sampler2D matcap;

varying vec3 vPos;
varying vec3 vNorm;
varying float vDisplacement;
varying vec2 vSEM;

$ADSLightModel

void main() {
	vec3 color = (1.0 - NormalsMix) * ADSLightModel(vNorm, vPos, cameraPosition);
	// color += NormalsMix * abs(vDisplacement * vNorm);

	// color += 0.9 * texture2D(matcap, vSEM).xyz;

	cat

	gl_FragColor = vec4(color, 1.0);
}
