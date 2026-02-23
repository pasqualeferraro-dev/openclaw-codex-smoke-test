export type Project = {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  category: string;
  stack: string[];
  featured: boolean;
  year: number;
  metrics: string[];
  caseStudy: {
    problem: string;
    approach: string;
    impact: string;
  };
};

export const projects: Project[] = [
  {
    id: "atlas-commerce",
    title: "Atlas Commerce",
    tagline: "Checkout conversion engine for high-volume stores",
    summary:
      "Redesigned checkout funnels with experimentation hooks and granular analytics for rapid optimization.",
    category: "Commerce",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    featured: true,
    year: 2025,
    metrics: ["+19% checkout conversion", "-31% cart abandonment", "12 markets launched"],
    caseStudy: {
      problem:
        "The legacy checkout had too many steps, no mobile parity, and sparse observability. Teams shipped changes but could not measure impact quickly.",
      approach:
        "Built a composable checkout UI, introduced event contracts, and shipped an experiment layer so product could test offers and payment sequencing safely.",
      impact:
        "Conversion improved across all major regions within one quarter and support tickets related to payment flow dropped materially.",
    },
  },
  {
    id: "pulse-ops",
    title: "Pulse Ops",
    tagline: "Incident command center for platform teams",
    summary:
      "Unified alert streams, runbooks, and service ownership data into a focused interface for faster incident response.",
    category: "Platform",
    stack: ["React", "Node.js", "Redis", "WebSockets"],
    featured: true,
    year: 2024,
    metrics: ["-43% MTTR", "95% on-call adoption", "3x faster handoffs"],
    caseStudy: {
      problem:
        "Operational context lived across five tools. On-call engineers spent too much time collecting data before acting.",
      approach:
        "Created a real-time incident workspace with timeline stitching, ownership hints, and one-click runbook execution.",
      impact:
        "Teams resolved incidents faster and escalations became more predictable because context followed the alert automatically.",
    },
  },
  {
    id: "lumen-insights",
    title: "Lumen Insights",
    tagline: "Executive analytics layer over product telemetry",
    summary:
      "Delivered decision-ready dashboards with plain-language summaries and anomaly detection for weekly business reviews.",
    category: "Data",
    stack: ["Next.js", "Python", "dbt", "BigQuery"],
    featured: true,
    year: 2025,
    metrics: ["6 hours saved per weekly review", "92% dashboard trust score", "18 core KPIs standardized"],
    caseStudy: {
      problem:
        "Leaders were reading conflicting numbers from multiple dashboards and making late decisions.",
      approach:
        "Defined a single metric layer, automated transformations, and added narrative summaries that called out notable shifts.",
      impact:
        "Review meetings moved from data reconciliation to decision making, and teams aligned on a single source of truth.",
    },
  },
  {
    id: "northstar-learning",
    title: "Northstar Learning",
    tagline: "Adaptive learning paths for enterprise onboarding",
    summary:
      "Built a role-aware curriculum engine that adapts lessons based on progress signals and assessment outcomes.",
    category: "Education",
    stack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind"],
    featured: false,
    year: 2023,
    metrics: ["+27% completion rate", "-22% onboarding time", "4.8/5 learner satisfaction"],
    caseStudy: {
      problem:
        "Static onboarding paths overwhelmed new hires and caused inconsistent readiness across teams.",
      approach:
        "Implemented adaptive sequencing and feedback loops so each learner saw the right module at the right time.",
      impact:
        "Learners completed onboarding faster with better assessment outcomes, and managers had clearer readiness signals.",
    },
  },
  {
    id: "signal-labs",
    title: "Signal Labs",
    tagline: "AI-assisted research workspace for product discovery",
    summary:
      "Accelerated synthesis of interview notes with semantic clustering and evidence-linked insight cards.",
    category: "AI",
    stack: ["React", "TypeScript", "OpenAI API", "Supabase"],
    featured: false,
    year: 2025,
    metrics: ["-58% synthesis time", "2100+ insights tagged", "4 research squads onboarded"],
    caseStudy: {
      problem:
        "Research signals were fragmented and difficult to trace back to source evidence.",
      approach:
        "Shipped a workspace that grouped themes automatically and required every insight to keep source links visible.",
      impact:
        "Product teams reached evidence-backed decisions faster while preserving confidence in qualitative findings.",
    },
  },
  {
    id: "orbit-field",
    title: "Orbit Field",
    tagline: "Field service planner with route intelligence",
    summary:
      "Reduced dispatch friction with schedule optimization, SLA risk alerts, and a mobile-friendly technician timeline.",
    category: "Operations",
    stack: ["Next.js", "TypeScript", "Mapbox", "Firebase"],
    featured: false,
    year: 2024,
    metrics: ["+24% daily jobs completed", "-17% travel distance", "89% SLA compliance"],
    caseStudy: {
      problem:
        "Dispatchers manually coordinated schedules and lacked visibility into SLA risk until too late.",
      approach:
        "Created a priority-aware planner with route suggestions and proactive breach notifications.",
      impact:
        "Teams improved throughput while reducing technician fatigue and missed service windows.",
    },
  },
];

export const projectCategories = [
  "All",
  ...Array.from(new Set(projects.map((project) => project.category))),
];
