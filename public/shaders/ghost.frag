precision highp float;

uniform float uTime;
uniform vec2 uPointer;
uniform float uVelocity;
uniform vec2 uResolution;
uniform float uReducedMotion;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec2 vUv;
varying float vPulse;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPosition);

  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.35);

  vec2 screenUv = gl_FragCoord.xy / uResolution.xy;
  float reduced = uReducedMotion;

  float quantize = mix(220.0, 72.0, reduced);
  float row = floor((screenUv.y + uTime * 0.055) * quantize) / quantize;
  float jitter = (hash12(vec2(row, floor(uTime * 19.0))) - 0.5) * 0.032 * (0.28 + uVelocity);
  float scan = sin((screenUv.y + jitter) * uResolution.y * 0.63) * 0.5 + 0.5;

  float grain = hash12(gl_FragCoord.xy + uTime * 57.0) - 0.5;

  vec3 cA = vec3(0.30, 0.36, 1.0);
  vec3 cB = vec3(0.86, 0.42, 0.98);
  vec3 cC = vec3(0.23, 0.85, 0.97);

  float s = 0.5 + 0.5 * sin(uTime * 0.9 + vPulse * 8.0 + uPointer.x * 1.4);
  vec3 spectral = mix(mix(cA, cB, s), cC, 0.34 + 0.22 * scan);

  float core = 0.24 + fresnel * 0.62 + uVelocity * 0.18;
  float vignette = 1.0 - smoothstep(0.18, 1.04, length(screenUv - 0.5) * 1.5);

  vec3 color = spectral * core;
  color += grain * 0.055;
  color *= (0.74 + 0.26 * vignette);

  float alpha = clamp((0.14 + fresnel * 0.5 + uVelocity * 0.14) * (0.7 + 0.3 * vignette), 0.08, 0.72);

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), alpha);
}
