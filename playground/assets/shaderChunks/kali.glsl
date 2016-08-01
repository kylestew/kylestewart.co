/*
https://github.com/cabbibo/wombs/blob/8ebd5f5c527318262e5edc9e26de135fd6fdfd13/js/Wombs/Utils/Shaders/shaderChunks.js
*/

vec3 kali( vec3 v , vec3 s ){
  float m = 0.0;
  for( int i = 0; i < 20; i ++){
    v.x = abs(v.x);
    v.y = abs(v.y);
    v.z = abs(v.z);
    m = v.x * v.x + v.y * v.y + v.z * v.z;
    v.x = v.x / m + s.x;
    v.y = v.y / m + s.y;
    v.z = v.z / m + s.z;
  }
  return v;
}

vec3 kali3( vec3 v , vec3 s ){
  float m = 0.0;
  for( int i = 0; i < 15; i ++){
    v.x = abs(v.x);
    v.y = abs(v.y);
    v.z = abs(v.z);
    m = v.x * v.x + v.y * v.y + v.z * v.z;
    v.x = v.x / m + s.x;
    v.y = v.y / m + s.y;
    v.z = v.z / m + s.z;
  }
  return v;
}
