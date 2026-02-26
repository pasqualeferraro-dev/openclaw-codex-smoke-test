export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  timeframe: string;
  outcomes: string[];
  stack: string[];
  details: string;
};

export const experience: ExperienceItem[] = [
  {
    id: "northstar-health",
    role: "Staff Product Engineer",
    company: "Northstar Health",
    timeframe: "2024 - Present",
    outcomes: [
      "Led the rebuild of patient onboarding and reduced activation time from 11 minutes to under 4.",
      "Introduced contract testing for critical APIs and cut release-day incidents by 42% in two quarters.",
      "Partnered with design and growth on lifecycle experiments that improved 90-day retention by 18%.",
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Playwright"],
    details:
      "Own core patient journeys across web and internal tooling, with an emphasis on measurable product outcomes and stable delivery.",
  },
  {
    id: "atlas-commerce",
    role: "Senior Full-Stack Engineer",
    company: "Atlas Commerce Cloud",
    timeframe: "2022 - 2024",
    outcomes: [
      "Shipped a modular checkout architecture used by 30+ storefronts without per-client forks.",
      "Reduced p95 checkout latency by 37% by redesigning the cart pricing pipeline and caching strategy.",
      "Mentored three mid-level engineers into feature ownership on payments and order fulfillment.",
    ],
    stack: ["React", "Node.js", "GraphQL", "Redis", "AWS"],
    details:
      "Worked at the intersection of platform engineering and merchant UX, balancing extensibility, reliability, and speed.",
  },
  {
    id: "signal-labs",
    role: "Founding Engineer",
    company: "Signal Labs",
    timeframe: "2020 - 2022",
    outcomes: [
      "Built the first production analytics workspace from scratch and onboarded 120 paying teams.",
      "Implemented event-ingestion safeguards that prevented data loss during a 10x traffic growth period.",
      "Set up CI quality gates and test coverage standards adopted as company defaults.",
    ],
    stack: ["Next.js", "Python", "Kafka", "ClickHouse", "Docker"],
    details:
      "As an early engineer, I defined delivery practices, built customer-facing workflows, and supported enterprise migrations.",
  },
  {
    id: "civicflow",
    role: "Software Engineer",
    company: "CivicFlow",
    timeframe: "2018 - 2020",
    outcomes: [
      "Delivered a multilingual resident portal that increased digital service completion by 29%.",
      "Automated permit-status notifications, reducing support tickets related to status checks by 24%.",
      "Introduced accessibility checks into CI and resolved 70+ WCAG issues before launch.",
    ],
    stack: ["React", "TypeScript", "Express", "PostgreSQL", "Jest"],
    details:
      "Focused on public-sector service design with strict accessibility and reliability requirements.",
  },
  {
    id: "payroute",
    role: "Frontend Engineer",
    company: "Payroute",
    timeframe: "2016 - 2018",
    outcomes: [
      "Reworked risk-review flows and reduced manual operations time per case by 31%.",
      "Created a reusable component library that shortened average feature delivery time by roughly one sprint.",
      "Instrumented user journeys to surface drop-offs, informing roadmap priorities with real behavior data.",
    ],
    stack: ["React", "Redux", "Sass", "Jest", "Cypress"],
    details:
      "Built and maintained customer and analyst experiences in a regulated payments environment.",
  },
  {
    id: "independent",
    role: "Independent Product Developer",
    company: "Freelance",
    timeframe: "2014 - 2016",
    outcomes: [
      "Delivered MVPs for eight early-stage teams, from discovery workshops to production launch.",
      "Designed analytics dashboards that helped two clients secure follow-on seed funding.",
      "Established a practical product-development playbook reused across multiple engagements.",
    ],
    stack: ["JavaScript", "Rails", "PostgreSQL", "Heroku", "Figma"],
    details:
      "Collaborated directly with founders to shape scope, validate assumptions quickly, and ship with limited budgets.",
  },
];
