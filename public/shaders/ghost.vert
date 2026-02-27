precision highp float;

uniform float uTime;
uniform vec2 uPointer;
uniform float uVelocity;
uniform float uReducedMotion;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec2 vUv;
varying float vPulse;

float hash31(vec3 p) {
  p = fract(p * vec3(0.1031, 0.11369, 0.13787));
  p += dot(p, p.yzx + 19.19);
  return fract((p.x + p.y) * p.z);
}

float noise3d(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float n000 = hash31(i + vec3(0.0, 0.0, 0.0));
  float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash31(i + vec3(1.0, 1.0, 1.0));

  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);

  float nxy0 = mix(nx00, nx10, f.y);
  float nxy1 = mix(nx01, nx11, f.y);

  return mix(nxy0, nxy1, f.z);
}

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  float motionScale = mix(1.0, 0.38, uReducedMotion);
  float t = uTime * motionScale;

  vec3 displaced = position;
  vec3 pointerDir = normalize(vec3(uPointer * 1.25, 0.75));

  float wobbleA = sin(position.y * 6.0 + t * 2.1) * 0.022;
  float wobbleB = sin(position.x * 5.0 - t * 1.7) * 0.018;
  float flow = noise3d(position * 2.4 + vec3(0.0, t * 0.8, t * 0.35)) - 0.5;

  float pull = max(dot(normalize(normal), pointerDir), 0.0);
  float drag = pull * (0.06 + uVelocity * 0.1) * motionScale;

  displaced += normalize(normal) * (wobbleA + wobbleB + flow * 0.12 + drag);

  vec4 world = modelMatrix * vec4(displaced, 1.0);
  vWorldPosition = world.xyz;
  vPulse = wobbleA + wobbleB + flow + drag;

  gl_Position = projectionMatrix * viewMatrix * world;
}
