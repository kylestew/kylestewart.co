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
