#include <common>

#define delta (1.0 / 60.0)

uniform float gravityConstant;
uniform float density;

// resolution automatically defined by GPUComputationRenderer as size of texture in texels
const float width = resolution.x;
const float height = resolution.y;

float radiusFromMass(float mass) {
  // calculate radius of a sphere from mass and density
  return pow( (3.0 / (4.0 * PI)) * mass / density, 1.0 / 3.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  // index / id of our particle
  float idParticle = uv.y * resolution.x + uv.x;

  // lookup position - passed in from first compute pass
  vec4 tmpPos = texture2D(texturePosition, uv);
  vec3 pos = tmpPos.xyz;

  // lookup velocity
  vec4 tmpVel = texture2D(textureVelocity, uv);
  vec3 vel = tmpVel.xyz;
  float mass = tmpVel.w;

  if (mass > 0.0) {
    float radius = radiusFromMass(mass);
    vec3 acceleration = vec3(0.0);

    // gravity interaction
    // check this particles interaction with EVERY OTHER PARTICLE
    // this is a two way check - particle aggregation should only happen on one of the particles
    for (float y = 0.0; y < height; y++) {
      for (float x = 0.0; x < width; x++) {

        vec2 secondParticleCoords = vec2(x + 0.5, y + 0.5) / resolution.xy;
        vec3 pos2 = texture2D(texturePosition, secondParticleCoords).xyz;
        vec4 velTemp2 = texture2D(textureVelocity, secondParticleCoords);
        vec3 vel2 = velTemp2.xyz;
        float mass2 = velTemp2.w;

        // index / id of their particle
        float idParticle2 = secondParticleCoords.y * resolution.x + secondParticleCoords.x;

        if (idParticle == idParticle2) {
          continue; // don't compare with ourselves
        }

        if (mass2 == 0.0) {
          continue; // wouldn't have effect
        }

        // distance between
        vec3 dPos = pos2 - pos;
        float distance = length(dPos);
        // size of second particle
        float radius2 = radiusFromMass(mass2);

        if (distance == 0.0) {
          continue;
        }

        // check collision
        if (distance < radius + radius2) {
          if (idParticle < idParticle2) {
            // this particle consumes the other
            vel = (vel * mass + vel2 * mass2) / (mass + mass2);
            mass += mass2;
            radius = radiusFromMass(mass);
          } else {
            // this particle is consumed and dies
            mass = 0.0;
            radius = 0.0;
            vel = vec3(0.0);
            break;
          }
        }

        // determine gravity interaction
        float distanceSq = distance * distance;
        float gravityField = gravityConstant * mass2 / distanceSq;
        gravityField = min(gravityField, 1000.0);
        acceleration += gravityField * normalize(dPos);
      }

      // someone consumed us?
      if (mass == 0.0) {
        break;
      }
    }

    vel += delta * acceleration;
  }

  gl_FragColor = vec4(vel, mass);
}
