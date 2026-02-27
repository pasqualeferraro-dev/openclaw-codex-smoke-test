precision highp float;

uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uVelocity;
uniform float uAmount;
uniform float uReducedMotion;

varying vec2 vUv;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  float motion = mix(1.0, 0.25, uReducedMotion);
  float amount = uAmount * motion * (0.5 + uVelocity * 0.7);

  vec2 uv = vUv;

  float tapeRow = floor(uv.y * 320.0) / 320.0;
  float tracking = (hash12(vec2(tapeRow, floor(uTime * 22.0))) - 0.5) * 0.008 * amount;
  uv.x += tracking;

  float chroma = 0.0016 + 0.0032 * amount;

  vec4 r = texture2D(tDiffuse, uv + vec2(chroma, 0.0));
  vec4 g = texture2D(tDiffuse, uv);
  vec4 b = texture2D(tDiffuse, uv - vec2(chroma, 0.0));

  vec3 color = vec3(r.r, g.g, b.b);

  float scanline = sin((uv.y + uTime * 0.14) * 960.0) * 0.034 * motion;
  float grain = (hash12(gl_FragCoord.xy + uTime * 71.0) - 0.5) * 0.05 * motion;

  float vignette = smoothstep(1.2, 0.25, length(vUv - 0.5));

  color += scanline + grain;
  color *= mix(1.0, vignette, 0.28);

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
