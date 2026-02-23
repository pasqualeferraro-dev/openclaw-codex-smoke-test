# Portfolio Website — Decisions

## 2026-02-23 — Homepage v1 scope

- Use Next.js App Router + TypeScript.
- Styling via Tailwind.
- Subtle motion via Framer Motion.
- Keep v1 content mostly static with placeholder projects.
- Theme toggle stored in `localStorage` (data-theme + `dark` class for Tailwind compatibility).
- Use `mailto:hello@example.com` as a neutral placeholder; to be replaced with a real contact later.

## 2026-02-23 — Performance & simplicity

- No CMS/analytics/build-time complexity.
- Avoid heavy assets; use gradients and system fonts.

## 2026-02-23 — Motion & navigation

- Section reveals use `useInView` and respect `prefers-reduced-motion`.
- Add `scroll-padding-top` to offset the sticky header when using anchor links.
