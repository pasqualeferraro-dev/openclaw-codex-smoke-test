"use client";

import * as React from "react";
import Link from "next/link";
import {
  domainDescriptions,
  skillCategories,
  skillDomains,
  skills as defaultSkills,
  type Skill,
  type SkillDomain,
} from "../../data/skills";

type SkillsExperienceProps = {
  skills?: Skill[];
};

function categoryToId(category: string) {
  return `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

function ProficiencyMeter({ value }: { value: Skill["proficiency"] }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Proficiency ${value} out of 5`}>
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-300">
        Proficiency
      </span>
      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => {
          const active = index < value;
          return (
            <span
              key={index}
              className={[
                "h-2.5 w-6 rounded-full border",
                active
                  ? "border-emerald-600 bg-emerald-500"
                  : "border-slate-300 bg-slate-200 dark:border-white/20 dark:bg-white/10",
              ].join(" ")}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function SkillsExperience({ skills = defaultSkills }: SkillsExperienceProps) {
  const [activeDomain, setActiveDomain] = React.useState<(typeof skillDomains)[number]>("All");
  const [query, setQuery] = React.useState("");
  const [openSkillId, setOpenSkillId] = React.useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredSkills = React.useMemo(() => {
    return skills.filter((skill) => {
      const matchesDomain = activeDomain === "All" || skill.domain === activeDomain;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        skill.title.toLowerCase().includes(normalizedQuery) ||
        skill.category.toLowerCase().includes(normalizedQuery) ||
        skill.practicalSummary.toLowerCase().includes(normalizedQuery) ||
        skill.proofBullets.some((point) => point.toLowerCase().includes(normalizedQuery));

      return matchesDomain && matchesQuery;
    });
  }, [activeDomain, normalizedQuery, skills]);

  const groupedSkills = React.useMemo(() => {
    return skillCategories
      .map((category) => ({
        category,
        id: categoryToId(category),
        skills: filteredSkills.filter((skill) => skill.category === category),
      }))
      .filter((group) => group.skills.length > 0);
  }, [filteredSkills]);

  const skillCountLabel =
    filteredSkills.length === 1
      ? "Showing 1 skill"
      : `Showing ${filteredSkills.length} of ${skills.length} skills`;

  return (
    <main>
      <section
        id="skills-overview"
        aria-labelledby="skills-hero-title"
        className="relative overflow-hidden border-b border-slate-200/60 py-20 dark:border-white/10"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-8%] top-[-90px] h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-[-110px] right-[-8%] h-96 w-96 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="absolute left-1/2 top-[-120px] h-80 w-[720px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="inline-flex rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200">
            Skill Map
          </p>
          <h1
            id="skills-hero-title"
            className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl"
          >
            Technical depth that ships practical product outcomes
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-200 sm:text-lg">
            This map shows how I work across frontend, backend, platform, AI, and engineering enablement, including proof points and project links.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#skills-map"
              className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:translate-y-[-1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:bg-white dark:text-slate-950"
            >
              Explore skill map
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200/70 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              Start a conversation
            </a>
          </div>

          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Skills</dt>
              <dd className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{skills.length}</dd>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Categories</dt>
              <dd className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{skillCategories.length}</dd>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Domains</dt>
              <dd className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{skillDomains.length - 1}</dd>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Evidence</dt>
              <dd className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">Case-backed</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="sticky top-[68px] z-30 border-y border-slate-200/60 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
        <div className="mx-auto max-w-6xl px-4 py-3 md:px-6">
          <nav aria-label="Jump to skill categories" className="flex items-center gap-2 overflow-x-auto pb-1">
            {groupedSkills.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="whitespace-nowrap rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/20 dark:bg-slate-950 dark:text-slate-200"
              >
                {group.category}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <section id="skills-map" aria-labelledby="skills-map-title" className="py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2
            id="skills-map-title"
            className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
          >
            Skill map
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Filter by domain and search by capability, then open details for practical proof, certifications, and related project work.
          </p>

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_2fr]">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950">
              <label
                htmlFor="skill-search"
                className="text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                Search skills
              </label>
              <input
                id="skill-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try: retrieval, accessibility, CI/CD"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/20 dark:bg-slate-900 dark:text-slate-100"
                aria-label="Search skills"
              />

              <fieldset className="mt-4" aria-label="Filter skills by domain">
                <legend className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Domain filters
                </legend>
                <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Filter skills by domain">
                  {skillDomains.map((domain) => {
                    const isActive = domain === activeDomain;

                    return (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => setActiveDomain(domain)}
                        aria-pressed={isActive}
                        aria-label={`Filter skills: ${domain}`}
                        className={[
                          "rounded-full border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500",
                          isActive
                            ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950"
                            : "border-slate-300 bg-white text-slate-800 hover:border-slate-400 dark:border-white/20 dark:bg-slate-950 dark:text-slate-100",
                        ].join(" ")}
                      >
                        {domain}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300" aria-live="polite">
                {skillCountLabel}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-100 via-white to-cyan-50 p-4 shadow-sm dark:border-white/10 dark:from-slate-950 dark:via-slate-950 dark:to-cyan-950/30">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                Domain snapshots
              </h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {skillDomains
                  .filter((domain): domain is SkillDomain => domain !== "All")
                  .map((domain) => (
                    <li
                      key={domain}
                      className="rounded-xl border border-slate-200/70 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-900/50"
                    >
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{domain}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {domainDescriptions[domain]}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="mt-10" data-testid="skills-groups">
            {groupedSkills.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-700 dark:border-white/20 dark:bg-white/5 dark:text-slate-200">
                No skills matched this filter. Try another domain or a broader search term.
              </div>
            ) : (
              groupedSkills.map((group) => (
                <section
                  key={group.id}
                  id={group.id}
                  aria-labelledby={`${group.id}-title`}
                  className="scroll-mt-36 border-t border-slate-200/60 py-10 first:border-t-0 first:pt-0 dark:border-white/10"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3
                      id={`${group.id}-title`}
                      className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
                    >
                      {group.category}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {group.skills.length} skill{group.skills.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {group.skills.map((skill) => {
                      const isOpen = openSkillId === skill.id;
                      const detailsId = `skill-details-${skill.id}`;

                      return (
                        <article
                          key={skill.id}
                          data-testid="skill-card"
                          className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                {skill.domain}
                              </p>
                              <h4 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {skill.title}
                              </h4>
                            </div>
                            <ProficiencyMeter value={skill.proficiency} />
                          </div>

                          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                            {skill.practicalSummary}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenSkillId((current) => (current === skill.id ? null : skill.id))
                              }
                              aria-expanded={isOpen}
                              aria-controls={detailsId}
                              aria-label={`${isOpen ? "Hide" : "Show"} details for ${skill.title}`}
                              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/20 dark:bg-slate-900 dark:text-slate-100"
                            >
                              {isOpen ? "Hide details" : "Show details"}
                            </button>

                            {skill.learnMoreHref ? (
                              <a
                                href={skill.learnMoreHref}
                                className="rounded-md text-sm font-semibold text-ink-700 transition hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:text-ink-300 dark:hover:text-ink-200"
                              >
                                Learn more
                              </a>
                            ) : null}
                          </div>

                          {isOpen ? (
                            <div
                              id={detailsId}
                              role="region"
                              aria-label={`${skill.title} details`}
                              className="mt-5 space-y-4 border-t border-slate-200/70 pt-4 dark:border-white/10"
                            >
                              <div>
                                <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  Practical proof
                                </h5>
                                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
                                  {skill.proofBullets.map((bullet) => (
                                    <li key={bullet}>{bullet}</li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  Certifications
                                </h5>
                                <ul className="mt-2 space-y-1">
                                  {skill.certifications.map((cert) => (
                                    <li key={cert.href}>
                                      <a
                                        href={cert.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-md text-sm font-medium text-ink-700 transition hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:text-ink-300 dark:hover:text-ink-200"
                                        aria-label={`Open certification ${cert.label} in a new tab`}
                                      >
                                        {cert.label}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  Related projects
                                </h5>
                                <ul className="mt-2 flex flex-wrap gap-2">
                                  {skill.relatedProjects.map((project) => (
                                    <li key={project.id}>
                                      <Link
                                        href={`/projects?project=${encodeURIComponent(project.id)}`}
                                        className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/20 dark:bg-slate-900 dark:text-slate-100"
                                      >
                                        {project.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </section>

      <section id="how-i-work" aria-labelledby="how-i-work-title" className="border-t border-slate-200/60 py-16 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2
            id="how-i-work-title"
            className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
          >
            How I work
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            I prioritize outcome-driven scope, observable delivery, and team clarity from discovery through production support.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <article id="frontend-patterns" className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Frontend patterns</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                Build accessible UI systems with explicit loading, error, and state transitions before visual polish.
              </p>
            </article>
            <article id="backend-playbook" className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Backend playbook</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                Define contracts first, automate validation, and keep migration paths reversible to reduce release risk.
              </p>
            </article>
            <article id="devops-routines" className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">DevOps routines</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                Ship with observable rollouts, clear rollback actions, and incident runbooks integrated into day-to-day ops.
              </p>
            </article>
            <article id="ai-automation-lab" className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI automation lab</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                Introduce AI features with eval gates, confidence fallback behavior, and transparent evidence links for trust.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="contact" aria-labelledby="skills-contact-title" className="border-t border-slate-200/60 py-16 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="rounded-3xl border border-slate-200/70 bg-gradient-to-r from-slate-950 to-slate-800 p-8 text-white shadow-lg dark:border-white/10">
            <h2 id="skills-contact-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Need this mix on your team?
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
              I collaborate with product and engineering teams to scope, build, and ship resilient customer-facing systems.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:hello@example.com"
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Contact me
              </a>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-xl border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Review projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
