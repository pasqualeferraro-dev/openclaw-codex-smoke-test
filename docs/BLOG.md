# Blog Section Guide

## Overview

The blog is implemented with Next.js App Router and static seeded data.

Routes:
- `/blog`: index with hero, filters, sorting, and pagination.
- `/blog/[slug]`: article detail with SEO metadata, JSON-LD, TOC, related posts.
- `/blog/studio`: internal local editor with upload + preview.

## Data Model

Posts live in `data/blog/posts.ts` and use the `Post` schema in `data/blog/types.ts`.

Required fields:
- `id`, `slug`, `title`, `excerpt`, `content`, `coverMedia`
- `author`, `publishedAt`, `updatedAt`
- `categories`, `tags`, `status`
- `seo` (`metaTitle`, `metaDescription`, `ogImage`)
- `popularity`

Content is block-based (`heading`, `paragraph`, `quote`, `list`, `callout`, `code`, `image`, `audio`, `video`, `embed`).

## Creating/Updating Posts

### Option 1: Seeded content (recommended for production in this repo)
1. Add or edit a post in `data/blog/posts.ts`.
2. Keep `slug` unique.
3. Use `status: "published"` to expose it on `/blog`.
4. Add local media assets under `public/blog/*` when possible.

### Option 2: Blog Studio (local authoring)
1. Open `/blog/studio`.
2. Fill metadata and content blocks JSON.
3. Upload cover/media (validated by type + size).
4. Save draft (stored in browser `localStorage`).
5. Load drafts by slug to update.

Note: there is no backend persistence yet; Studio is local-only.

## Media Conventions

- Images: always provide meaningful `alt` text and optional `caption`.
- Audio/video: use compressed sources and captions when useful.
- Embeds: only HTTPS URLs. Allowed iframe providers are YouTube, Vimeo, Spotify, SoundCloud.
- X/Instagram and unsupported providers use a safe fallback link card (no third-party scripts injected).

## Security Notes

- No raw HTML rendering in post body.
- Embed URLs are sanitized and provider-whitelisted.
- Uploads in Studio validate MIME type and max size before append.

## SEO Notes

- Canonical URLs and OpenGraph/Twitter metadata are generated per route.
- JSON-LD `Article` is injected on `/blog/[slug]`.
- `app/sitemap.ts` includes `/blog` and all published slugs.
