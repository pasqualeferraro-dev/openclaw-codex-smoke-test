import type { Post } from "./types";

export const blogPosts: Post[] = [
  {
    id: "post-product-analytics-pipeline",
    slug: "designing-product-analytics-pipeline",
    title: "Designing a Product Analytics Pipeline that Teams Trust",
    excerpt:
      "How we moved from conflicting dashboards to a shared metric layer with faster decisions and fewer debates.",
    coverMedia: {
      type: "image",
      src: "/blog/covers/analytics-wave.svg",
      alt: "Abstract wave gradient cover for analytics article",
      width: 1600,
      height: 900,
    },
    author: {
      name: "Pasquale Ferraro",
      avatar: "/blog/authors/pasquale.svg",
      role: "Staff Product Engineer",
    },
    publishedAt: "2026-01-17T09:20:00.000Z",
    updatedAt: "2026-02-02T10:00:00.000Z",
    categories: ["Engineering", "Data"],
    tags: ["analytics", "data-platform", "product-metrics"],
    status: "published",
    popularity: 93,
    seo: {
      metaTitle: "Product Analytics Pipeline: Architecture, Contracts, and Trust",
      metaDescription:
        "A practical blueprint for shipping a reliable analytics pipeline: event contracts, quality checks, and executive-ready dashboards.",
      ogImage: "/blog/covers/analytics-wave.svg",
    },
    content: [
      {
        type: "paragraph",
        text: "For months, every review started with the same question: which dashboard is correct? We redesigned the pipeline around contracts, ownership, and clarity.",
      },
      {
        type: "heading",
        level: 2,
        text: "Start from decision points, not event volume",
      },
      {
        type: "paragraph",
        text: "The model became simpler when we mapped weekly business decisions first. Each KPI had one owner, one source model, and one accepted definition.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Decision rule",
        text: "If a metric cannot directly influence a product decision within 30 days, it does not belong in the core layer.",
      },
      {
        type: "heading",
        level: 2,
        text: "Contracted events and versioned schemas",
      },
      {
        type: "code",
        language: "ts",
        code: "type CheckoutCompleted = {\n  event: 'checkout_completed';\n  orderId: string;\n  currency: string;\n  value: number;\n  version: 3;\n};",
      },
      {
        type: "paragraph",
        text: "Versioning events made migrations explicit. Breaking changes required a migration note plus temporary dual-write, so dashboard continuity stayed intact.",
      },
      {
        type: "image",
        media: {
          kind: "image",
          src: "/blog/covers/pipeline-map.svg",
          alt: "Pipeline map showing ingestion, validation, warehouse, and marts",
          caption: "Pipeline map: events, quality checks, warehouse, marts.",
          width: 1400,
          height: 840,
        },
      },
      {
        type: "heading",
        level: 2,
        text: "Observability made data quality visible",
      },
      {
        type: "list",
        style: "unordered",
        items: [
          "Schema drift alerts routed to channel owners.",
          "Row-count anomaly checks before each dashboard refresh.",
          "Freshness SLOs tracked like production uptime.",
        ],
      },
      {
        type: "quote",
        text: "Trust is not a dashboard style; it is a delivery contract.",
        citation: "Internal analytics guild",
      },
      {
        type: "embed",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        caption: "Short walkthrough of event contracts and semantic layers.",
      },
    ],
  },
  {
    id: "post-incident-ux",
    slug: "incident-command-center-ux",
    title: "UX Patterns for Incident Command Centers",
    excerpt:
      "Design choices that reduce cognitive load in high-pressure operational contexts.",
    coverMedia: {
      type: "image",
      src: "/blog/covers/incident-grid.svg",
      alt: "Dark abstract grid with highlights",
      width: 1600,
      height: 900,
    },
    author: {
      name: "Pasquale Ferraro",
      avatar: "/blog/authors/pasquale.svg",
      role: "Staff Product Engineer",
    },
    publishedAt: "2025-12-06T08:10:00.000Z",
    categories: ["Design", "Platform"],
    tags: ["ux", "incidents", "operations"],
    status: "published",
    popularity: 88,
    seo: {
      metaTitle: "Incident Command Center UX Patterns",
      metaDescription:
        "Practical UI patterns for operational tools where every second matters: focus, context, and escalation ergonomics.",
      ogImage: "/blog/covers/incident-grid.svg",
    },
    content: [
      {
        type: "paragraph",
        text: "Incident tools fail when they overload the operator. The UI should remove ambiguity before adding features.",
      },
      {
        type: "heading",
        level: 2,
        text: "One timeline, one source of context",
      },
      {
        type: "paragraph",
        text: "We merged alert stream, ownership, and runbook activity into one chronological surface. It cut handoff friction immediately.",
      },
      {
        type: "video",
        media: {
          kind: "video",
          src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
          poster: "/blog/covers/incident-grid.svg",
          caption: "Prototype playback of timeline-first incident UI.",
          width: 1280,
          height: 720,
        },
      },
      {
        type: "heading",
        level: 2,
        text: "Progressive disclosure for escalation",
      },
      {
        type: "list",
        style: "ordered",
        items: [
          "Show next best action first.",
          "Reveal deeper diagnostics on demand.",
          "Keep ownership and SLA visible at every step.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        text: "Avoid modal-heavy incident flows. Back-and-forth navigation amplifies operator stress.",
      },
      {
        type: "embed",
        url: "https://vimeo.com/76979871",
        caption: "Reference talk on reducing cognitive overhead in ops tooling.",
      },
    ],
  },
  {
    id: "post-audio-research",
    slug: "from-interviews-to-product-decisions",
    title: "From User Interviews to Product Decisions in 48 Hours",
    excerpt:
      "A lightweight workflow to synthesize qualitative research without losing evidence traceability.",
    coverMedia: {
      type: "gradient",
    },
    author: {
      name: "Pasquale Ferraro",
      avatar: "/blog/authors/pasquale.svg",
      role: "Staff Product Engineer",
    },
    publishedAt: "2025-11-02T15:00:00.000Z",
    categories: ["Product", "Research"],
    tags: ["research", "interviews", "decision-making"],
    status: "published",
    popularity: 81,
    seo: {
      metaTitle: "Interview Synthesis Workflow for Product Teams",
      metaDescription:
        "A repeatable process for turning user interview transcripts into roadmap decisions with evidence-linked outputs.",
      ogImage: "/blog/covers/editorial-signal.svg",
    },
    content: [
      {
        type: "paragraph",
        text: "The goal is not faster notes. The goal is faster, evidence-backed decisions.",
      },
      {
        type: "heading",
        level: 2,
        text: "Tag evidence before writing insights",
      },
      {
        type: "paragraph",
        text: "Every insight card referenced at least two evidence snippets. This removed opinion-heavy summaries.",
      },
      {
        type: "audio",
        media: {
          kind: "audio",
          src: "https://file-examples.com/storage/fe9f6f0fceec9f8f027f5f5/2017/11/file_example_MP3_700KB.mp3",
          caption: "Audio excerpt from interview synthesis workshop.",
          mimeType: "audio/mpeg",
        },
      },
      {
        type: "heading",
        level: 2,
        text: "Template for weekly synthesis",
      },
      {
        type: "code",
        language: "md",
        code: "## Theme\n- Signal\n- Evidence links\n- Confidence\n\n## Decision impact\n- Roadmap item\n- Expected KPI movement",
      },
      {
        type: "embed",
        url: "https://x.com/jack/status/20",
        caption: "Social post fallback example (safe link card).",
      },
    ],
  },
  {
    id: "post-nextjs-performance",
    slug: "nextjs-performance-without-premature-optimization",
    title: "Next.js Performance Without Premature Optimization",
    excerpt:
      "A pragmatic checklist for improving LCP and reducing layout shift before touching complex infra.",
    coverMedia: {
      type: "image",
      src: "/blog/covers/editorial-signal.svg",
      alt: "Soft gradients and geometric lines",
      width: 1600,
      height: 900,
    },
    author: {
      name: "Pasquale Ferraro",
      avatar: "/blog/authors/pasquale.svg",
      role: "Staff Product Engineer",
    },
    publishedAt: "2025-10-11T11:45:00.000Z",
    categories: ["Engineering"],
    tags: ["nextjs", "performance", "web-vitals"],
    status: "published",
    popularity: 77,
    seo: {
      metaTitle: "Next.js Performance Checklist for Product Teams",
      metaDescription:
        "Practical performance improvements for Next.js apps: LCP, CLS, lazy-loading strategy, and media priorities.",
      ogImage: "/blog/covers/editorial-signal.svg",
    },
    content: [
      {
        type: "paragraph",
        text: "You can recover most performance wins with good defaults: correct image priorities, stable layout, and smaller client bundles.",
      },
      {
        type: "heading",
        level: 2,
        text: "Treat LCP media as a product requirement",
      },
      {
        type: "list",
        style: "unordered",
        items: [
          "Set dimensions for all visible media.",
          "Load only hero media at high priority.",
          "Lazy-load everything below the fold.",
        ],
      },
      {
        type: "callout",
        tone: "success",
        text: "Performance work succeeds when tied to user outcomes, not synthetic scores alone.",
      },
      {
        type: "heading",
        level: 2,
        text: "Measure before and after",
      },
      {
        type: "code",
        language: "bash",
        code: "npm run build\n# compare Lighthouse + Web Vitals\n",
      },
    ],
  },
  {
    id: "post-design-critique",
    slug: "running-better-design-critiques-with-engineers",
    title: "Running Better Design Critiques with Engineers in the Room",
    excerpt:
      "A facilitation format that keeps critique actionable, measurable, and implementation-aware.",
    coverMedia: {
      type: "image",
      src: "/blog/covers/incident-grid.svg",
      alt: "Layered panels with contrast lines",
      width: 1600,
      height: 900,
    },
    author: {
      name: "Pasquale Ferraro",
      avatar: "/blog/authors/pasquale.svg",
    },
    publishedAt: "2025-08-22T09:00:00.000Z",
    categories: ["Design", "Collaboration"],
    tags: ["design-review", "engineering", "product-craft"],
    status: "published",
    popularity: 65,
    seo: {
      metaTitle: "Design Critique Format for Product + Engineering",
      metaDescription:
        "How to structure design critiques that increase implementation quality and reduce late-stage rework.",
      ogImage: "/blog/covers/incident-grid.svg",
    },
    content: [
      {
        type: "paragraph",
        text: "Cross-functional critiques work when everyone reacts to the same goals, not personal style.",
      },
      {
        type: "heading",
        level: 2,
        text: "Use objective prompts",
      },
      {
        type: "list",
        style: "unordered",
        items: [
          "What user risk does this reduce?",
          "Which metric should move?",
          "What edge cases are still ambiguous?",
        ],
      },
      {
        type: "quote",
        text: "Good critique aligns decisions; great critique aligns execution.",
      },
      {
        type: "embed",
        url: "https://www.instagram.com/p/CxYz12345/",
        caption: "Instagram fallback example (secure, no script injection).",
      },
    ],
  },
  {
    id: "post-draft",
    slug: "draft-content-modeling-for-fast-teams",
    title: "Draft: Content Modeling for Fast Teams",
    excerpt: "Draft article not visible in published index.",
    coverMedia: {
      type: "gradient",
    },
    author: {
      name: "Pasquale Ferraro",
      avatar: "/blog/authors/pasquale.svg",
    },
    publishedAt: "2026-03-05T10:00:00.000Z",
    categories: ["Content"],
    tags: ["draft"],
    status: "draft",
    popularity: 10,
    seo: {
      metaTitle: "Draft",
      metaDescription: "Draft",
    },
    content: [
      {
        type: "paragraph",
        text: "Draft",
      },
    ],
  },
];

export function getPublishedBlogPosts() {
  return blogPosts.filter((post) => post.status === "published");
}

export function getPostBySlug(slug: string) {
  return getPublishedBlogPosts().find((post) => post.slug === slug) ?? null;
}

export function getAllBlogTags() {
  return Array.from(new Set(getPublishedBlogPosts().flatMap((post) => post.tags))).sort();
}

export function getAllBlogCategories() {
  return Array.from(new Set(getPublishedBlogPosts().flatMap((post) => post.categories))).sort();
}
