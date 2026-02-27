"use client";

import * as React from "react";

const CDN_BASE = "https://esm.sh/three@0.170.0";
const STORAGE_KEY = "spectral-effects";

const ANALOG_VERTEX = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const ANALOG_FRAGMENT = `
uniform sampler2D tDiffuse;
uniform float uTime;
uniform vec2 uResolution;
uniform float uAnalogGrain;
uniform float uAnalogBleeding;
uniform float uAnalogVSync;
uniform float uAnalogScanlines;
uniform float uAnalogVignette;
uniform float uAnalogJitter;
uniform float uAnalogIntensity;
uniform float uReducedMotion;
varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float gaussian(float z, float u, float o) {
  return (1.0 / (o * sqrt(2.0 * 3.1415))) * exp(-(((z - u) * (z - u)) / (2.0 * (o * o))));
}

vec3 grain(vec2 uv, float time, float intensity) {
  float seed = dot(uv, vec2(12.9898, 78.233));
  float noise = fract(sin(seed) * 43758.5453 + time * 2.0);
  noise = gaussian(noise, 0.0, 0.5 * 0.5);
  return vec3(noise) * intensity;
}

void main() {
  vec2 uv = vUv;
  float time = uTime * 1.8;
  float reduced = mix(1.0, 0.35, uReducedMotion);

  vec2 jitteredUV = uv;
  float jitterAmount = (random(vec2(floor(time * 60.0))) - 0.5) * 0.003 * uAnalogJitter * uAnalogIntensity * reduced;
  jitteredUV.x += jitterAmount;
  jitteredUV.y += (random(vec2(floor(time * 30.0) + 1.0)) - 0.5) * 0.001 * uAnalogJitter * uAnalogIntensity * reduced;

  float vsyncRoll = sin(time * 2.0 + uv.y * 100.0) * 0.02 * uAnalogVSync * uAnalogIntensity * reduced;
  float vsyncChance = step(0.95, random(vec2(floor(time * 4.0))));
  jitteredUV.y += vsyncRoll * vsyncChance;

  vec4 color = texture2D(tDiffuse, jitteredUV);

  float bleedAmount = 0.012 * uAnalogBleeding * uAnalogIntensity * reduced;
  float offsetPhase = time * 1.5 + uv.y * 20.0;

  vec2 redOffset = vec2(sin(offsetPhase) * bleedAmount, 0.0);
  vec2 blueOffset = vec2(-sin(offsetPhase * 1.1) * bleedAmount * 0.8, 0.0);

  float r = texture2D(tDiffuse, jitteredUV + redOffset).r;
  float g = texture2D(tDiffuse, jitteredUV).g;
  float b = texture2D(tDiffuse, jitteredUV + blueOffset).b;

  color = vec4(r, g, b, color.a);

  vec3 grainEffect = grain(uv, time, 0.075 * uAnalogGrain * uAnalogIntensity * reduced);
  grainEffect *= (1.0 - color.rgb);
  color.rgb += grainEffect;

  float scanlineFreq = 600.0 + uAnalogScanlines * 400.0;
  float scanlinePattern = sin(uv.y * scanlineFreq) * 0.5 + 0.5;
  float scanlineIntensity = 0.1 * uAnalogScanlines * uAnalogIntensity * reduced;
  color.rgb *= (1.0 - scanlinePattern * scanlineIntensity);

  vec2 vignetteUV = (uv - 0.5) * 2.0;
  float vignette = 1.0 - dot(vignetteUV, vignetteUV) * 0.3 * uAnalogVignette * uAnalogIntensity;
  color.rgb *= vignette;

  gl_FragColor = vec4(clamp(color.rgb, 0.0, 1.0), color.a);
}
`;

type AnyRecord = any;

type RuntimeModules = {
  THREE: AnyRecord;
  EffectComposer: new (...args: unknown[]) => AnyRecord;
  RenderPass: new (...args: unknown[]) => AnyRecord;
  UnrealBloomPass: new (...args: unknown[]) => AnyRecord;
  ShaderPass: new (...args: unknown[]) => AnyRecord;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isEffectsDisabledByQuery() {
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get("effects") ?? params.get("fx") ?? "").toLowerCase();
  return raw === "off" || raw === "0" || raw === "false";
}

function readStoredPreference() {
  return window.localStorage.getItem(STORAGE_KEY) === "off";
}

async function importFromUrl(url: string) {
  const importer = new Function("u", "return import(u);") as (u: string) => Promise<AnyRecord>;
  return importer(url);
}

async function loadRuntime(): Promise<RuntimeModules> {
  const [THREE, composerModule, renderPassModule, bloomModule, shaderPassModule] =
    await Promise.all([
      importFromUrl(CDN_BASE),
      importFromUrl(`${CDN_BASE}/examples/jsm/postprocessing/EffectComposer.js`),
      importFromUrl(`${CDN_BASE}/examples/jsm/postprocessing/RenderPass.js`),
      importFromUrl(`${CDN_BASE}/examples/jsm/postprocessing/UnrealBloomPass.js`),
      importFromUrl(`${CDN_BASE}/examples/jsm/postprocessing/ShaderPass.js`),
    ]);

  return {
    THREE,
    EffectComposer: composerModule.EffectComposer as RuntimeModules["EffectComposer"],
    RenderPass: renderPassModule.RenderPass as RuntimeModules["RenderPass"],
    UnrealBloomPass: bloomModule.UnrealBloomPass as RuntimeModules["UnrealBloomPass"],
    ShaderPass: shaderPassModule.ShaderPass as RuntimeModules["ShaderPass"],
  };
}

function isLowPowerDevice() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  return cores <= 4 || memory <= 4;
}

export default function SpectralGhostBackground() {
  const mountRef = React.useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = React.useState(false);
  const [effectsDisabled, setEffectsDisabled] = React.useState(false);
  const [webglFailed, setWebglFailed] = React.useState(false);
  const isDev = process.env.NODE_ENV !== "production";

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const disabled = isEffectsDisabledByQuery() || readStoredPreference();
    setEffectsDisabled(disabled);
    setIsReady(true);
  }, []);

  React.useEffect(() => {
    if (!isReady || effectsDisabled) return;
    const mount = mountRef.current;
    if (!mount) return;

    let cleanup = () => {};
    let disposed = false;

    const start = async () => {
      try {
        const { THREE, EffectComposer, RenderPass, UnrealBloomPass, ShaderPass } = await loadRuntime();
        if (disposed || !mountRef.current) return;

        setWebglFailed(false);

        const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        let reducedMotion = reducedMotionQuery.matches;
        const lowPower = isLowPowerDevice();
        const maxDpr = lowPower ? 1.0 : 1.5;

        const scene = new (THREE.Scene as new () => AnyRecord)();
        scene.background = null;

        const camera = new (THREE.PerspectiveCamera as new (...args: unknown[]) => AnyRecord)(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000,
        );
        camera.position.z = 20;

        const renderer = new (THREE.WebGLRenderer as new (...args: unknown[]) => AnyRecord)({
          antialias: !lowPower,
          powerPreference: "high-performance",
          alpha: true,
          premultipliedAlpha: false,
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = lowPower ? 0.8 : 0.9;
        renderer.setClearColor(0x000000, 0);

        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        renderer.domElement.setAttribute("aria-hidden", "true");
        mountRef.current.appendChild(renderer.domElement);

        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
          new (THREE.Vector2 as new (...args: unknown[]) => AnyRecord)(window.innerWidth, window.innerHeight),
          reducedMotion ? 0.18 : 0.32,
          1.25,
          0.0,
        );
        composer.addPass(bloomPass);

        const analogPass = new ShaderPass({
          uniforms: {
            tDiffuse: { value: null },
            uTime: { value: 0.0 },
            uResolution: {
              value: new (THREE.Vector2 as new (...args: unknown[]) => AnyRecord)(window.innerWidth, window.innerHeight),
            },
            uAnalogGrain: { value: reducedMotion ? 0.16 : 0.4 },
            uAnalogBleeding: { value: reducedMotion ? 0.22 : 1.0 },
            uAnalogVSync: { value: reducedMotion ? 0.08 : 1.0 },
            uAnalogScanlines: { value: reducedMotion ? 0.1 : 1.0 },
            uAnalogVignette: { value: 1.0 },
            uAnalogJitter: { value: reducedMotion ? 0.09 : 0.4 },
            uAnalogIntensity: { value: reducedMotion ? 0.3 : 0.6 },
            uReducedMotion: { value: reducedMotion ? 1.0 : 0.0 },
          },
          vertexShader: ANALOG_VERTEX,
          fragmentShader: ANALOG_FRAGMENT,
        });
        composer.addPass(analogPass);

        const atmosphereGeometry = new (THREE.PlaneGeometry as new (...args: unknown[]) => AnyRecord)(300, 300);
        const atmosphereMaterial = new (THREE.ShaderMaterial as new (...args: unknown[]) => AnyRecord)({
          uniforms: {
            ghostPosition: { value: new (THREE.Vector3 as new (...args: unknown[]) => AnyRecord)(0, 0, 0) },
            revealRadius: { value: 43.0 },
            fadeStrength: { value: 2.2 },
            baseOpacity: { value: 0.14 },
            revealOpacity: { value: 0.01 },
            time: { value: 0 },
          },
          vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
              vec4 worldPos = modelMatrix * vec4(position, 1.0);
              vWorldPosition = worldPos.xyz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 ghostPosition;
            uniform float revealRadius;
            uniform float fadeStrength;
            uniform float baseOpacity;
            uniform float revealOpacity;
            uniform float time;
            varying vec3 vWorldPosition;

            void main() {
              float dist = distance(vWorldPosition.xy, ghostPosition.xy);
              float dynamicRadius = revealRadius + sin(time * 2.0) * 5.0;
              float reveal = smoothstep(dynamicRadius * 0.2, dynamicRadius, dist);
              reveal = pow(reveal, fadeStrength);
              float opacity = mix(revealOpacity, baseOpacity, reveal);
              gl_FragColor = vec4(0.001, 0.001, 0.002, opacity);
            }
          `,
          transparent: true,
          depthWrite: false,
        });
        const atmosphere = new (THREE.Mesh as new (...args: unknown[]) => AnyRecord)(
          atmosphereGeometry,
          atmosphereMaterial,
        );
        atmosphere.position.z = -50;
        atmosphere.renderOrder = -100;
        scene.add(atmosphere);

        const ambientLight = new (THREE.AmbientLight as new (...args: unknown[]) => AnyRecord)(0x0a0a2e, 0.08);
        scene.add(ambientLight);

        const starfieldGroup = new (THREE.Group as new () => AnyRecord)();
        scene.add(starfieldGroup);

        const starCanvas = document.createElement("canvas");
        starCanvas.width = 64;
        starCanvas.height = 64;
        const starCtx = starCanvas.getContext("2d");
        if (starCtx) {
          const gradient = starCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
          gradient.addColorStop(0, "rgba(255,255,255,1)");
          gradient.addColorStop(0.28, "rgba(220,235,255,0.9)");
          gradient.addColorStop(1, "rgba(220,235,255,0)");
          starCtx.fillStyle = gradient;
          starCtx.fillRect(0, 0, 64, 64);
        }

        const starTexture = new (THREE.CanvasTexture as new (...args: unknown[]) => AnyRecord)(starCanvas);
        starTexture.needsUpdate = true;

        const nebulaCanvas = document.createElement("canvas");
        nebulaCanvas.width = 512;
        nebulaCanvas.height = 512;
        const nebulaCtx = nebulaCanvas.getContext("2d");
        if (nebulaCtx) {
          nebulaCtx.clearRect(0, 0, 512, 512);
          const blobs = [
            { x: 164, y: 190, r: 160, color: "rgba(110,120,255,0.42)" },
            { x: 356, y: 216, r: 180, color: "rgba(255,110,190,0.26)" },
            { x: 278, y: 340, r: 210, color: "rgba(80,225,255,0.22)" },
          ];
          for (const blob of blobs) {
            const gradient = nebulaCtx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
            gradient.addColorStop(0, blob.color);
            gradient.addColorStop(0.55, blob.color.replace("0.", "0.08"));
            gradient.addColorStop(1, "rgba(0,0,0,0)");
            nebulaCtx.fillStyle = gradient;
            nebulaCtx.fillRect(0, 0, 512, 512);
          }
        }
        const nebulaTexture = new (THREE.CanvasTexture as new (...args: unknown[]) => AnyRecord)(nebulaCanvas);
        nebulaTexture.needsUpdate = true;

        const starLayers = [
          { count: lowPower ? 420 : 940, radius: 62, size: 1.05, speed: 0.0038, opacity: 0.64, color: 0xd8e6ff },
          { count: lowPower ? 220 : 540, radius: 50, size: 1.55, speed: -0.0058, opacity: 0.44, color: 0xffdcf5 },
          { count: lowPower ? 140 : 320, radius: 38, size: 2.2, speed: 0.0084, opacity: 0.32, color: 0xc7fbff },
        ];

        const starPoints: AnyRecord[] = [];
        const nebulaPlanes: AnyRecord[] = [];

        for (const layer of starLayers) {
          const positions = new Float32Array(layer.count * 3);
          for (let i = 0; i < layer.count; i += 1) {
            const i3 = i * 3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = layer.radius + (Math.random() - 0.5) * 8;

            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.cos(phi) * 0.72;
            positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 24;
          }

          const geometry = new (THREE.BufferGeometry as new () => AnyRecord)();
          geometry.setAttribute(
            "position",
            new (THREE.Float32BufferAttribute as new (...args: unknown[]) => AnyRecord)(
              positions,
              3,
            ),
          );

          const material = new (THREE.PointsMaterial as new (...args: unknown[]) => AnyRecord)({
            map: starTexture,
            color: layer.color,
            transparent: true,
            opacity: layer.opacity,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            size: reducedMotion ? layer.size * 0.8 : layer.size,
            sizeAttenuation: false,
          });

          const points = new (THREE.Points as new (...args: unknown[]) => AnyRecord)(geometry, material);
          points.userData = {
            baseOpacity: layer.opacity,
            baseSize: layer.size,
            speed: layer.speed,
            phase: Math.random() * Math.PI * 2,
          };
          starfieldGroup.add(points);
          starPoints.push(points);
        }

        const nebulaDefs = [
          { w: 132, h: 88, z: -78, x: -24, y: 12, opacity: 0.24, speed: 0.031, tint: 0x7982ff },
          { w: 108, h: 74, z: -64, x: 20, y: -8, opacity: 0.2, speed: 0.026, tint: 0xff7cc4 },
          { w: 140, h: 96, z: -92, x: 10, y: 4, opacity: 0.16, speed: 0.022, tint: 0x6ce7ff },
        ];

        for (const def of nebulaDefs) {
          const geometry = new (THREE.PlaneGeometry as new (...args: unknown[]) => AnyRecord)(def.w, def.h);
          const material = new (THREE.MeshBasicMaterial as new (...args: unknown[]) => AnyRecord)({
            map: nebulaTexture,
            color: def.tint,
            transparent: true,
            opacity: def.opacity * (reducedMotion ? 0.8 : 1),
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          });
          const plane = new (THREE.Mesh as new (...args: unknown[]) => AnyRecord)(geometry, material);
          plane.position.set(def.x, def.y, def.z);
          plane.userData = {
            baseX: def.x,
            baseY: def.y,
            baseOpacity: def.opacity,
            speed: def.speed,
            phase: Math.random() * Math.PI * 2,
          };
          starfieldGroup.add(plane);
          nebulaPlanes.push(plane);
        }

        const ghostGroup = new (THREE.Group as new () => AnyRecord)();
        scene.add(ghostGroup);

        const ghostGeometry = new (THREE.SphereGeometry as new (...args: unknown[]) => AnyRecord)(2, 40, 40);
        const positionAttribute = ghostGeometry.getAttribute("position");
        const positions = positionAttribute.array;
        for (let i = 0; i < positions.length; i += 3) {
          if (positions[i + 1] < -0.2) {
            const x = positions[i];
            const z = positions[i + 2];
            const noise1 = Math.sin(x * 5) * 0.35;
            const noise2 = Math.cos(z * 4) * 0.25;
            const noise3 = Math.sin((x + z) * 3) * 0.15;
            positions[i + 1] = -2.0 + noise1 + noise2 + noise3;
          }
        }
        ghostGeometry.computeVertexNormals();

        const ghostMaterial = new (THREE.MeshStandardMaterial as new (...args: unknown[]) => AnyRecord)({
          color: 0x0f2027,
          transparent: true,
          opacity: 0.88,
          emissive: 0xff4500,
          emissiveIntensity: reducedMotion ? 3.0 : 5.8,
          roughness: 0.02,
          metalness: 0.0,
          side: THREE.DoubleSide,
          alphaTest: 0.1,
        });

        const ghostBody = new (THREE.Mesh as new (...args: unknown[]) => AnyRecord)(
          ghostGeometry,
          ghostMaterial,
        );
        ghostGroup.add(ghostBody);

        const rimLight1 = new (THREE.DirectionalLight as new (...args: unknown[]) => AnyRecord)(0x4a90e2, 1.8);
        rimLight1.position.set(-8, 6, -4);
        scene.add(rimLight1);

        const rimLight2 = new (THREE.DirectionalLight as new (...args: unknown[]) => AnyRecord)(0x50e3c2, 1.26);
        rimLight2.position.set(8, -4, -6);
        scene.add(rimLight2);

        const eyeGroup = new (THREE.Group as new () => AnyRecord)();
        ghostGroup.add(eyeGroup);

        const socketGeometry = new (THREE.SphereGeometry as new (...args: unknown[]) => AnyRecord)(0.45, 16, 16);
        const socketMaterial = new (THREE.MeshBasicMaterial as new (...args: unknown[]) => AnyRecord)({ color: 0x000000 });

        const leftSocket = new (THREE.Mesh as new (...args: unknown[]) => AnyRecord)(socketGeometry, socketMaterial);
        leftSocket.position.set(-0.7, 0.6, 1.9);
        leftSocket.scale.set(1.1, 1.0, 0.6);
        eyeGroup.add(leftSocket);

        const rightSocket = new (THREE.Mesh as new (...args: unknown[]) => AnyRecord)(socketGeometry, socketMaterial);
        rightSocket.position.set(0.7, 0.6, 1.9);
        rightSocket.scale.set(1.1, 1.0, 0.6);
        eyeGroup.add(rightSocket);

        const eyeGeometry = new (THREE.SphereGeometry as new (...args: unknown[]) => AnyRecord)(0.3, 12, 12);
        const outerGlowGeometry = new (THREE.SphereGeometry as new (...args: unknown[]) => AnyRecord)(0.525, 12, 12);

        const leftEyeMaterial = new (THREE.MeshBasicMaterial as new (...args: unknown[]) => AnyRecord)({
          color: 0x00ff80,
          transparent: true,
          opacity: 0,
        });
        const rightEyeMaterial = leftEyeMaterial.clone();

        const leftEye = new (THREE.Mesh as new (...args: unknown[]) => AnyRecord)(eyeGeometry, leftEyeMaterial);
        leftEye.position.set(-0.7, 0.6, 2.0);
        eyeGroup.add(leftEye);

        const rightEye = new (THREE.Mesh as new (...args: unknown[]) => AnyRecord)(eyeGeometry, rightEyeMaterial);
        rightEye.position.set(0.7, 0.6, 2.0);
        eyeGroup.add(rightEye);

        const leftOuterGlowMaterial = new (THREE.MeshBasicMaterial as new (...args: unknown[]) => AnyRecord)({
          color: 0x00ff80,
          transparent: true,
          opacity: 0,
          side: THREE.BackSide,
        });
        const rightOuterGlowMaterial = leftOuterGlowMaterial.clone();

        const leftOuterGlow = new (THREE.Mesh as new (...args: unknown[]) => AnyRecord)(
          outerGlowGeometry,
          leftOuterGlowMaterial,
        );
        leftOuterGlow.position.set(-0.7, 0.6, 1.95);
        eyeGroup.add(leftOuterGlow);

        const rightOuterGlow = new (THREE.Mesh as new (...args: unknown[]) => AnyRecord)(
          outerGlowGeometry,
          rightOuterGlowMaterial,
        );
        rightOuterGlow.position.set(0.7, 0.6, 1.95);
        eyeGroup.add(rightOuterGlow);

        const mouse = new (THREE.Vector2 as new (...args: unknown[]) => AnyRecord)();
        const prevMouse = new (THREE.Vector2 as new (...args: unknown[]) => AnyRecord)();
        const mouseSpeed = new (THREE.Vector2 as new (...args: unknown[]) => AnyRecord)();
        let starMotionFactor = reducedMotion ? 0.35 : 1.0;

        let currentMovement = 0;
        let isMouseMoving = false;
        let mouseMovementTimer: number | null = null;
        let rafId = 0;
        let hidden = document.hidden;

        const onMouseMove = (event: MouseEvent) => {
          prevMouse.x = mouse.x;
          prevMouse.y = mouse.y;
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          mouseSpeed.x = mouse.x - prevMouse.x;
          mouseSpeed.y = mouse.y - prevMouse.y;
          isMouseMoving = true;

          if (mouseMovementTimer) {
            window.clearTimeout(mouseMovementTimer);
          }
          mouseMovementTimer = window.setTimeout(() => {
            isMouseMoving = false;
          }, 80);
        };

        const onResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();

          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
          renderer.setSize(window.innerWidth, window.innerHeight);
          composer.setSize(window.innerWidth, window.innerHeight);
          bloomPass.setSize(window.innerWidth, window.innerHeight);
          analogPass.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        };

        const onVisibilityChange = () => {
          hidden = document.hidden;
          if (!hidden && rafId === 0) {
            rafId = window.requestAnimationFrame(animate);
          }
        };

        const onMotionPrefChange = (event: MediaQueryListEvent) => {
          reducedMotion = event.matches;
          starMotionFactor = reducedMotion ? 0.35 : 1.0;
          analogPass.uniforms.uReducedMotion.value = reducedMotion ? 1.0 : 0.0;
          analogPass.uniforms.uAnalogIntensity.value = reducedMotion ? 0.3 : 0.6;
          analogPass.uniforms.uAnalogJitter.value = reducedMotion ? 0.09 : 0.4;
          analogPass.uniforms.uAnalogBleeding.value = reducedMotion ? 0.22 : 1.0;
          analogPass.uniforms.uAnalogScanlines.value = reducedMotion ? 0.1 : 1.0;
          bloomPass.strength = reducedMotion ? 0.16 : 0.32;
          ghostMaterial.emissiveIntensity = reducedMotion ? 3.0 : 5.8;
          starPoints.forEach((points) => {
            points.material.size = points.userData.baseSize * (reducedMotion ? 0.8 : 1.0);
          });
          nebulaPlanes.forEach((plane) => {
            plane.material.opacity = plane.userData.baseOpacity * (reducedMotion ? 0.8 : 1.0);
          });
        };

        const clock = new (THREE.Clock as new () => AnyRecord)();

        const animate = () => {
          rafId = 0;
          if (disposed || hidden) return;

          const time = clock.getElapsedTime();
          analogPass.uniforms.uTime.value = time;
          atmosphereMaterial.uniforms.time.value = time;

          starfieldGroup.rotation.y += 0.00018 * starMotionFactor;
          starfieldGroup.rotation.x = Math.sin(time * 0.07) * 0.04;
          starfieldGroup.position.x = THREE.MathUtils.lerp(
            starfieldGroup.position.x,
            mouse.x * 1.2,
            0.02,
          );
          starfieldGroup.position.y = THREE.MathUtils.lerp(
            starfieldGroup.position.y,
            mouse.y * 0.8,
            0.02,
          );
          starPoints.forEach((points) => {
            points.rotation.y += points.userData.speed * 0.02 * starMotionFactor;
            points.material.opacity =
              points.userData.baseOpacity *
              (0.76 + 0.24 * Math.sin(time * 0.42 + points.userData.phase));
          });
          nebulaPlanes.forEach((plane) => {
            plane.position.x =
              plane.userData.baseX +
              Math.sin(time * plane.userData.speed + plane.userData.phase) * 3.8 +
              mouse.x * 0.9;
            plane.position.y =
              plane.userData.baseY +
              Math.cos(time * plane.userData.speed * 0.9 + plane.userData.phase) * 2.7 +
              mouse.y * 0.5;
            plane.rotation.z = Math.sin(time * plane.userData.speed * 0.45 + plane.userData.phase) * 0.08;
          });

          const targetX = mouse.x * 11;
          const targetY = mouse.y * 7;

          const prevGhostPosition = ghostGroup.position.clone();
          const followSpeed = reducedMotion ? 0.04 : 0.075;

          ghostGroup.position.x += (targetX - ghostGroup.position.x) * followSpeed;
          ghostGroup.position.y += (targetY - ghostGroup.position.y) * followSpeed;

          atmosphereMaterial.uniforms.ghostPosition.value.copy(ghostGroup.position);

          const movementAmount = prevGhostPosition.distanceTo(ghostGroup.position);
          currentMovement = currentMovement * 0.95 + movementAmount * 0.05;

          const float1 = Math.sin(time * 1.6 * 1.5) * 0.03;
          const float2 = Math.cos(time * 1.6 * 0.7) * 0.018;
          const float3 = Math.sin(time * 1.6 * 2.3) * 0.008;
          ghostGroup.position.y += float1 + float2 + float3;

          const pulse = Math.sin(time * 1.6) * 0.6;
          const breathe = Math.sin(time * 0.6) * 0.12;
          ghostMaterial.emissiveIntensity = (reducedMotion ? 3.0 : 5.8) + pulse + breathe;

          const mouseDirection = new (THREE.Vector2 as new (...args: unknown[]) => AnyRecord)(
            targetX - ghostGroup.position.x,
            targetY - ghostGroup.position.y,
          ).normalize();

          ghostBody.rotation.z = ghostBody.rotation.z * 0.95 + -mouseDirection.x * 0.1 * 0.05;
          ghostBody.rotation.x = ghostBody.rotation.x * 0.95 + mouseDirection.y * 0.1 * 0.05;
          ghostBody.rotation.y = Math.sin(time * 1.4) * 0.05;

          const scaleVariation = 1 + Math.sin(time * 2.1) * 0.025 + pulse * 0.015;
          const scaleBreath = 1 + Math.sin(time * 0.8) * 0.012;
          const finalScale = scaleVariation * scaleBreath;
          ghostBody.scale.set(finalScale, finalScale, finalScale);

          const movementThreshold = 0.07;
          const isMoving = currentMovement > movementThreshold;
          const targetGlow = isMoving ? 1.0 : 0.0;
          const glowResponse = reducedMotion ? 0.09 : 0.31;
          const glowChangeSpeed = isMoving ? glowResponse * 2 : glowResponse;

          const newOpacity = leftEyeMaterial.opacity + (targetGlow - leftEyeMaterial.opacity) * glowChangeSpeed;
          leftEyeMaterial.opacity = newOpacity;
          rightEyeMaterial.opacity = newOpacity;
          leftOuterGlowMaterial.opacity = newOpacity * 0.3;
          rightOuterGlowMaterial.opacity = newOpacity * 0.3;

          if (isMouseMoving) {
            const speed = Math.sqrt(mouseSpeed.x * mouseSpeed.x + mouseSpeed.y * mouseSpeed.y);
            bloomPass.strength = clamp((reducedMotion ? 0.16 : 0.3) + speed * 0.7, 0.12, 0.78);
          } else {
            bloomPass.strength = THREE.MathUtils.lerp(
              bloomPass.strength,
              reducedMotion ? 0.16 : 0.3,
              0.03,
            );
          }

          composer.render();
          rafId = window.requestAnimationFrame(animate);
        };

        const initialEvent = new MouseEvent("mousemove", {
          clientX: window.innerWidth / 2,
          clientY: window.innerHeight / 2,
        });
        window.dispatchEvent(initialEvent);

        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("resize", onResize, { passive: true });
        document.addEventListener("visibilitychange", onVisibilityChange);
        reducedMotionQuery.addEventListener("change", onMotionPrefChange);

        rafId = window.requestAnimationFrame(animate);

        cleanup = () => {
          disposed = true;

          if (rafId) {
            window.cancelAnimationFrame(rafId);
            rafId = 0;
          }

          if (mouseMovementTimer) {
            window.clearTimeout(mouseMovementTimer);
            mouseMovementTimer = null;
          }

          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("resize", onResize);
          document.removeEventListener("visibilitychange", onVisibilityChange);
          reducedMotionQuery.removeEventListener("change", onMotionPrefChange);

          starPoints.forEach((points) => {
            points.geometry.dispose();
            points.material.dispose();
          });
          starTexture.dispose();
          nebulaPlanes.forEach((plane) => {
            plane.geometry.dispose();
            plane.material.dispose();
          });
          nebulaTexture.dispose();

          atmosphereGeometry.dispose();
          atmosphereMaterial.dispose();
          ghostGeometry.dispose();
          ghostMaterial.dispose();
          socketGeometry.dispose();
          socketMaterial.dispose();
          eyeGeometry.dispose();
          outerGlowGeometry.dispose();
          leftEyeMaterial.dispose();
          rightEyeMaterial.dispose();
          leftOuterGlowMaterial.dispose();
          rightOuterGlowMaterial.dispose();

          if (typeof renderPass.dispose === "function") renderPass.dispose();
          if (typeof bloomPass.dispose === "function") bloomPass.dispose();
          if (typeof analogPass.dispose === "function") analogPass.dispose();
          if (typeof composer.dispose === "function") composer.dispose();

          renderer.dispose();
          if (typeof renderer.forceContextLoss === "function") {
            renderer.forceContextLoss();
          }

          if (renderer.domElement?.parentNode === mountRef.current) {
            mountRef.current?.removeChild(renderer.domElement);
          }
        };
      } catch (error) {
        setWebglFailed(true);
        if (isDev) {
          console.warn("Spectral runtime failed, fallback ghost enabled.", error);
        }
      }
    };

    void start();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [effectsDisabled, isDev, isReady]);

  const toggleEffects = React.useCallback(() => {
    setEffectsDisabled((current) => {
      const next = !current;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next ? "off" : "on");
      }
      return next;
    });
  }, []);

  const showFallback = !effectsDisabled && webglFailed;

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0" style={{ zIndex: -1 }}>
        <div className="spectral-stars spectral-stars-far" />
        <div className="spectral-stars spectral-stars-mid" />
        <div className="spectral-nebula spectral-nebula-a" />
        <div className="spectral-nebula spectral-nebula-b" />

        <div ref={mountRef} className="absolute inset-0" />

        {showFallback ? (
          <div className="absolute inset-0 grid place-items-center">
            <svg
              viewBox="0 0 512 512"
              className="h-[56vmin] w-[56vmin] min-h-[260px] min-w-[260px] opacity-90"
              style={{
                filter: "drop-shadow(0 0 36px rgba(255,95,31,0.32)) drop-shadow(0 0 90px rgba(80,227,194,0.18))",
              }}
            >
              <path
                d="m508.374 432.802s-46.6-39.038-79.495-275.781c-8.833-87.68-82.856-156.139-172.879-156.139-90.015 0-164.046 68.458-172.879 156.138-32.895 236.743-79.495 275.782-79.495 275.782-15.107 25.181 20.733 28.178 38.699 27.94 35.254-.478 35.254 40.294 70.516 40.294 35.254 0 35.254-35.261 70.508-35.261s37.396 45.343 72.65 45.343 37.389-45.343 72.651-45.343c35.254 0 35.254 35.261 70.508 35.261s35.27-40.772 70.524-40.294c17.959.238 53.798-2.76 38.692-27.94z"
                fill="rgba(244,248,255,0.86)"
              />
              <circle cx="208" cy="225" r="24" fill="black" />
              <circle cx="297" cy="225" r="24" fill="black" />
            </svg>
          </div>
        ) : null}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_38%,rgba(255,145,99,0.2),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(80,227,194,0.12),transparent_42%),radial-gradient(circle_at_18%_18%,rgba(74,144,226,0.15),transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,24,0.22)_0%,rgba(6,10,24,0.14)_38%,rgba(6,10,24,0.34)_100%)] dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.34)_0%,rgba(2,6,23,0.24)_36%,rgba(2,6,23,0.5)_100%)]" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(148,163,184,0.5)_3px)]" />
      </div>

      {isDev ? (
        <button
          type="button"
          onClick={toggleEffects}
          className="fixed bottom-4 right-4 z-50 rounded-lg border border-slate-300/80 bg-white/85 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur pointer-events-auto dark:border-white/20 dark:bg-slate-900/70 dark:text-slate-200"
        >
          {effectsDisabled ? "Enable effects" : "Disable effects"}
        </button>
      ) : null}

      <style jsx global>{`
        .spectral-stars,
        .spectral-nebula {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .spectral-stars-far {
          opacity: 0.34;
          background-image:
            radial-gradient(1px 1px at 12% 18%, rgba(236, 245, 255, 0.92), transparent 66%),
            radial-gradient(1px 1px at 44% 22%, rgba(220, 238, 255, 0.86), transparent 70%),
            radial-gradient(1px 1px at 72% 14%, rgba(206, 228, 255, 0.88), transparent 72%),
            radial-gradient(1px 1px at 84% 36%, rgba(255, 225, 244, 0.82), transparent 70%),
            radial-gradient(1px 1px at 18% 64%, rgba(208, 248, 255, 0.78), transparent 70%),
            radial-gradient(1px 1px at 58% 72%, rgba(224, 238, 255, 0.8), transparent 70%),
            radial-gradient(1px 1px at 92% 82%, rgba(198, 223, 255, 0.76), transparent 68%),
            radial-gradient(1px 1px at 26% 88%, rgba(226, 242, 255, 0.8), transparent 68%);
          animation: spectral-drift-far 80s linear infinite;
          transform: scale(1.12);
        }

        .spectral-stars-mid {
          opacity: 0.56;
          background-image:
            radial-gradient(1.6px 1.6px at 16% 26%, rgba(244, 250, 255, 0.95), transparent 72%),
            radial-gradient(1.6px 1.6px at 38% 42%, rgba(252, 226, 246, 0.86), transparent 74%),
            radial-gradient(1.7px 1.7px at 66% 31%, rgba(206, 246, 255, 0.88), transparent 74%),
            radial-gradient(1.4px 1.4px at 84% 58%, rgba(230, 240, 255, 0.84), transparent 72%),
            radial-gradient(1.8px 1.8px at 32% 74%, rgba(214, 236, 255, 0.86), transparent 74%),
            radial-gradient(1.4px 1.4px at 74% 78%, rgba(255, 214, 238, 0.82), transparent 70%);
          animation: spectral-drift-mid 58s ease-in-out infinite alternate;
          transform: scale(1.03);
        }

        .spectral-nebula-a {
          opacity: 0.3;
          background:
            radial-gradient(circle at 22% 52%, rgba(96, 120, 255, 0.26), transparent 44%),
            radial-gradient(circle at 68% 42%, rgba(255, 120, 196, 0.22), transparent 48%);
          filter: blur(18px);
          animation: spectral-nebula-a 44s ease-in-out infinite alternate;
        }

        .spectral-nebula-b {
          opacity: 0.26;
          background:
            radial-gradient(circle at 82% 74%, rgba(92, 228, 255, 0.22), transparent 42%),
            radial-gradient(circle at 42% 18%, rgba(126, 142, 255, 0.18), transparent 46%);
          filter: blur(24px);
          animation: spectral-nebula-b 52s ease-in-out infinite alternate;
        }

        @keyframes spectral-drift-far {
          0% {
            transform: translate3d(-2%, -1%, 0) scale(1.12);
          }
          100% {
            transform: translate3d(2%, 1.5%, 0) scale(1.12);
          }
        }

        @keyframes spectral-drift-mid {
          0% {
            transform: translate3d(1.2%, -1.6%, 0) scale(1.03);
          }
          100% {
            transform: translate3d(-1.6%, 1.1%, 0) scale(1.03);
          }
        }

        @keyframes spectral-nebula-a {
          0% {
            transform: translate3d(-1.8%, 0, 0) scale(1.02);
          }
          100% {
            transform: translate3d(1.8%, 1.5%, 0) scale(1.08);
          }
        }

        @keyframes spectral-nebula-b {
          0% {
            transform: translate3d(1.2%, -1.2%, 0) scale(1.05);
          }
          100% {
            transform: translate3d(-1.4%, 1.1%, 0) scale(1.1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .spectral-stars-far,
          .spectral-stars-mid,
          .spectral-nebula-a,
          .spectral-nebula-b {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}
