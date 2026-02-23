# OpenClaw Codex Smoke Test — Static Landing Page

A tiny static landing page used for an end-to-end OpenClaw + Codex + GitHub smoke test.

## Run locally

### Option A (recommended): Python

```bash
python3 -m http.server
```

Then open: http://localhost:8000

### Option B (optional): `serve`

If you already have it available:

```bash
npx serve
```

## Manual test checklist

- [ ] Page renders and is centered/responsive
- [ ] Clicking **Change theme** toggles light/dark
- [ ] Refresh preserves theme (localStorage)
