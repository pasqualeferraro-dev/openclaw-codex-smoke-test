export type SkillDomain =
  | "Frontend"
  | "Backend"
  | "DevOps"
  | "AI/Automation"
  | "Tooling";

export type SkillCategory =
  | "Product Frontend"
  | "Backend & Data"
  | "Platform Reliability"
  | "AI Systems"
  | "Engineering Excellence";

export type Skill = {
  id: string;
  title: string;
  domain: SkillDomain;
  category: SkillCategory;
  proficiency: 1 | 2 | 3 | 4 | 5;
  practicalSummary: string;
  proofBullets: string[];
  certifications: Array<{
    label: string;
    href: string;
  }>;
  relatedProjects: Array<{
    id: string;
    label: string;
  }>;
  learnMoreHref?: string;
};

export const domainDescriptions: Record<SkillDomain, string> = {
  Frontend:
    "Designing performant, accessible interfaces that stay maintainable as product complexity grows.",
  Backend:
    "Building reliable APIs and data contracts that support fast iteration without regressions.",
  DevOps:
    "Shipping safely with strong observability, repeatable deployments, and resilient runtime operations.",
  "AI/Automation":
    "Integrating LLM and automation workflows with guardrails, evaluation, and measurable product outcomes.",
  Tooling:
    "Improving developer throughput with typed tooling, reusable templates, and robust test infrastructure.",
};

export const skills: Skill[] = [
  {
    id: "nextjs-app-router",
    title: "Next.js App Router Architecture",
    domain: "Frontend",
    category: "Product Frontend",
    proficiency: 5,
    practicalSummary:
      "Builds nested routes, streaming boundaries, and server/client component boundaries for fast, SEO-friendly product surfaces.",
    proofBullets: [
      "Shipped multi-route product portals with consistent loading and error boundaries.",
      "Reduced route-level bundle weight by splitting interactive islands from server-rendered content.",
      "Standardized metadata and deep-link patterns across marketing and app experiences.",
    ],
    certifications: [
      {
        label: "Vercel: Next.js Documentation",
        href: "https://nextjs.org/docs",
      },
    ],
    relatedProjects: [
      { id: "atlas-commerce", label: "Atlas Commerce" },
      { id: "lumen-insights", label: "Lumen Insights" },
    ],
    learnMoreHref: "#frontend-patterns",
  },
  {
    id: "react-performance",
    title: "React Performance Engineering",
    domain: "Frontend",
    category: "Product Frontend",
    proficiency: 4,
    practicalSummary:
      "Uses profiling, memoization strategy, and async UX patterns to keep interactive surfaces responsive under load.",
    proofBullets: [
      "Cut dashboard interaction latency by deferring non-critical rendering work.",
      "Introduced component-level performance budgets in CI review checklists.",
      "Reduced expensive re-renders through store segmentation and memoized selectors.",
    ],
    certifications: [
      {
        label: "Meta React Docs: Performance",
        href: "https://react.dev/learn",
      },
    ],
    relatedProjects: [
      { id: "pulse-ops", label: "Pulse Ops" },
      { id: "orbit-field", label: "Orbit Field" },
    ],
  },
  {
    id: "accessibility-design-systems",
    title: "Accessible Design Systems",
    domain: "Frontend",
    category: "Product Frontend",
    proficiency: 4,
    practicalSummary:
      "Creates reusable UI primitives with semantic HTML, keyboard support, and tokenized styling for consistent delivery.",
    proofBullets: [
      "Built button, form, and dialog primitives with documented accessibility contracts.",
      "Implemented WCAG-focused focus rings and contrast checks in component QA.",
      "Created usage guidelines that reduced one-off UI regressions across teams.",
    ],
    certifications: [
      {
        label: "W3C WAI: Accessibility Fundamentals",
        href: "https://www.w3.org/WAI/fundamentals/accessibility-intro/",
      },
    ],
    relatedProjects: [{ id: "northstar-learning", label: "Northstar Learning" }],
    learnMoreHref: "#frontend-patterns",
  },
  {
    id: "node-api-design",
    title: "Node.js API Design",
    domain: "Backend",
    category: "Backend & Data",
    proficiency: 5,
    practicalSummary:
      "Designs versioned REST and event contracts with robust validation and operational guardrails.",
    proofBullets: [
      "Introduced schema validation and contract tests for partner-facing APIs.",
      "Reduced integration incidents with explicit error taxonomies and retry semantics.",
      "Split monolithic handlers into domain services for easier ownership boundaries.",
    ],
    certifications: [
      {
        label: "OpenJS Node.js Services Developer",
        href: "https://training.linuxfoundation.org/certification/node-js-services-developer-jsnsd/",
      },
    ],
    relatedProjects: [
      { id: "pulse-ops", label: "Pulse Ops" },
      { id: "signal-labs", label: "Signal Labs" },
    ],
    learnMoreHref: "#backend-playbook",
  },
  {
    id: "postgresql-data-modeling",
    title: "PostgreSQL Data Modeling",
    domain: "Backend",
    category: "Backend & Data",
    proficiency: 4,
    practicalSummary:
      "Models transactional data with predictable query performance and clear migration pathways.",
    proofBullets: [
      "Designed tenancy-aware schemas with row-level constraints.",
      "Added query plans and index reviews to pre-release checks.",
      "Improved read-heavy workloads using purpose-built materialized views.",
    ],
    certifications: [
      {
        label: "PostgreSQL Official Documentation",
        href: "https://www.postgresql.org/docs/",
      },
    ],
    relatedProjects: [
      { id: "atlas-commerce", label: "Atlas Commerce" },
      { id: "northstar-learning", label: "Northstar Learning" },
    ],
    learnMoreHref: "#backend-playbook",
  },
  {
    id: "event-integrations",
    title: "Event-Driven Integrations",
    domain: "Backend",
    category: "Backend & Data",
    proficiency: 4,
    practicalSummary:
      "Implements asynchronous workflows with idempotency controls, retries, and observability for external systems.",
    proofBullets: [
      "Implemented outbox patterns to prevent dropped integration events.",
      "Improved downstream reliability with dead-letter handling playbooks.",
      "Defined event contracts with backward-compatible versioning policies.",
    ],
    certifications: [
      {
        label: "AWS EventBridge Resources",
        href: "https://docs.aws.amazon.com/eventbridge/",
      },
    ],
    relatedProjects: [
      { id: "orbit-field", label: "Orbit Field" },
      { id: "pulse-ops", label: "Pulse Ops" },
    ],
  },
  {
    id: "cicd-release-engineering",
    title: "CI/CD Release Engineering",
    domain: "DevOps",
    category: "Platform Reliability",
    proficiency: 5,
    practicalSummary:
      "Builds release pipelines with policy checks, rollback paths, and traceable deployment metadata.",
    proofBullets: [
      "Moved teams to trunk-based deployments with protected promotion gates.",
      "Added smoke-test and contract-test stages to prevent risky rollouts.",
      "Reduced time-to-production by standardizing service deployment templates.",
    ],
    certifications: [
      {
        label: "Google Cloud Professional Cloud DevOps Engineer",
        href: "https://cloud.google.com/learn/certification/cloud-devops-engineer",
      },
    ],
    relatedProjects: [
      { id: "atlas-commerce", label: "Atlas Commerce" },
      { id: "pulse-ops", label: "Pulse Ops" },
    ],
    learnMoreHref: "#devops-routines",
  },
  {
    id: "observability-incident-response",
    title: "Observability and Incident Response",
    domain: "DevOps",
    category: "Platform Reliability",
    proficiency: 5,
    practicalSummary:
      "Designs telemetry and runbook workflows that let teams detect and resolve incidents faster.",
    proofBullets: [
      "Defined service-level indicators and error-budget reporting cadences.",
      "Built incident runbook templates and on-call escalation checklists.",
      "Instrumented critical paths with traces tied to deployment metadata.",
    ],
    certifications: [
      {
        label: "SRE Workbook",
        href: "https://sre.google/workbook/table-of-contents/",
      },
    ],
    relatedProjects: [{ id: "pulse-ops", label: "Pulse Ops" }],
    learnMoreHref: "#devops-routines",
  },
  {
    id: "llm-workflow-orchestration",
    title: "LLM Workflow Orchestration",
    domain: "AI/Automation",
    category: "AI Systems",
    proficiency: 4,
    practicalSummary:
      "Builds prompt, routing, and fallback logic that keeps AI features stable in production.",
    proofBullets: [
      "Implemented prompt-version tracking and regression checks before rollout.",
      "Shipped fallback handling for low-confidence generation results.",
      "Defined guardrails for sensitive inputs and redaction boundaries.",
    ],
    certifications: [
      {
        label: "OpenAI API Guides",
        href: "https://platform.openai.com/docs/guides",
      },
    ],
    relatedProjects: [
      { id: "signal-labs", label: "Signal Labs" },
      { id: "lumen-insights", label: "Lumen Insights" },
    ],
    learnMoreHref: "#ai-automation-lab",
  },
  {
    id: "retrieval-evaluation",
    title: "Retrieval and Evaluation Pipelines",
    domain: "AI/Automation",
    category: "AI Systems",
    proficiency: 4,
    practicalSummary:
      "Combines retrieval strategy and eval datasets to measure answer quality and limit hallucinations.",
    proofBullets: [
      "Established baseline eval suites for precision, grounding, and response safety.",
      "Improved citation quality through chunking and metadata-scoring experiments.",
      "Added automated evaluation gates before model and prompt upgrades.",
    ],
    certifications: [
      {
        label: "LangChain Retrieval Concepts",
        href: "https://python.langchain.com/docs/concepts/retrieval/",
      },
    ],
    relatedProjects: [{ id: "signal-labs", label: "Signal Labs" }],
    learnMoreHref: "#ai-automation-lab",
  },
  {
    id: "typescript-platform-tooling",
    title: "TypeScript Platform Tooling",
    domain: "Tooling",
    category: "Engineering Excellence",
    proficiency: 5,
    practicalSummary:
      "Creates typed shared packages, lint rules, and codegen utilities that reduce drift across repositories.",
    proofBullets: [
      "Introduced shared type contracts consumed by frontend and backend services.",
      "Built project scaffolding templates to accelerate new service bootstraps.",
      "Automated static checks that prevented breaking API changes.",
    ],
    certifications: [
      {
        label: "TypeScript Handbook",
        href: "https://www.typescriptlang.org/docs/",
      },
    ],
    relatedProjects: [
      { id: "lumen-insights", label: "Lumen Insights" },
      { id: "atlas-commerce", label: "Atlas Commerce" },
    ],
  },
  {
    id: "test-automation-strategy",
    title: "Test Automation Strategy",
    domain: "Tooling",
    category: "Engineering Excellence",
    proficiency: 5,
    practicalSummary:
      "Defines layered test strategy across unit, integration, and E2E with stable, maintainable fixtures.",
    proofBullets: [
      "Added component interaction tests for core user journeys.",
      "Reduced flaky tests by introducing deterministic service mocks.",
      "Mapped regression risks to targeted pre-merge suites.",
    ],
    certifications: [
      {
        label: "Testing Library Guiding Principles",
        href: "https://testing-library.com/docs/guiding-principles",
      },
    ],
    relatedProjects: [
      { id: "northstar-learning", label: "Northstar Learning" },
      { id: "pulse-ops", label: "Pulse Ops" },
    ],
  },
];

export const skillDomains: Array<"All" | SkillDomain> = [
  "All",
  ...Array.from(new Set(skills.map((skill) => skill.domain))),
];

export const skillCategories: SkillCategory[] = Array.from(
  new Set(skills.map((skill) => skill.category)),
) as SkillCategory[];
