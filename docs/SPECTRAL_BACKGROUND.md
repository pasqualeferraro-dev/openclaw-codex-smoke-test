# Spectral Ghost Background

## Overview

The homepage now includes a client-only WebGL background in `components/spectral/SpectralGhostBackground.tsx`.

It uses:
- Three.js (runtime ESM import)
- custom GLSL shaders
- postprocessing (`RenderPass`, bloom, VHS-like shader pass)
- pointer inertia + touch/orientation fallback
- reduced motion fallback

## Where to tune intensity

In `components/spectral/SpectralGhostBackground.tsx`:
- Bloom: `bloomPass.threshold`, `bloomPass.radius`, `bloomPass.strength`
- VHS strength: `vhsPass.uniforms.uAmount`
- Pointer inertia: `dragFactor`, `damping`
- Velocity impact: `speed` and the bloom/ghost uniform lerps
- Contrast guard: bloom clamp range (`clamp(..., 0.18, 0.68)`)

In shader files:
- Ghost deformation/color: `public/shaders/ghost.vert`, `public/shaders/ghost.frag`
- VHS analog effect: `public/shaders/vhs.frag`

## Performance notes

Implemented optimizations:
- DPR capped (`1.5`, or `1.0` on low-power devices)
- lower quality on low-power devices (particle count, antialiasing, bloom)
- lazy init via `IntersectionObserver` (starts when `#top` is visible)
- full cleanup on unmount (RAF, listeners, geometries/materials/passes/renderer)
- `prefers-reduced-motion` reduces effect intensity

## Disable effects

- Query param: `?effects=off` (or `?fx=off`)
- Dev toggle button (bottom-right) stores preference in `localStorage` (`spectral-effects`)

## Integration notes

- Canvas layer is `position: fixed; inset: 0; z-index: -1; pointer-events: none`.
- HTML content remains above with normal interactions.
- Soft gradient/noise overlays keep text readability aligned with existing design language.
