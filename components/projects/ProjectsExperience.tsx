"use client";

import * as React from "react";
import type { Project } from "../../data/projects";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

type ProjectsExperienceProps = {
  projects: Project[];
};

export default function ProjectsExperience({ projects }: ProjectsExperienceProps) {
  const [activeFilter, setActiveFilter] = React.useState("All");
  const [activeProject, setActiveProject] = React.useState<Project | null>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const lastTriggerRef = React.useRef<HTMLButtonElement | null>(null);

  const categories = React.useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects],
  );

  const featuredProjects = React.useMemo(
    () => projects.filter((project) => project.featured),
    [projects],
  );

  const filteredProjects = React.useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter, projects]);

  const closeProject = React.useCallback(() => {
    setActiveProject(null);
  }, []);

  const openProject = React.useCallback(
    (project: Project, trigger: HTMLButtonElement) => {
      lastTriggerRef.current = trigger;
      setActiveProject(project);
    },
    [],
  );

  React.useEffect(() => {
    if (!activeProject) {
      lastTriggerRef.current?.focus();
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeProject();
      }
    };

    const previousOverflow = document.body.style.overflow;
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeProject, closeProject]);

  return (
    <>
      <main>
        <section aria-labelledby="projects-hero-title" className="relative overflow-hidden border-b border-slate-200/60 py-20 dark:border-white/10">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-[-8%] top-[-80px] h-72 w-72 rounded-full bg-ink-500/20 blur-3xl" />
            <div className="absolute bottom-[-110px] right-[-8%] h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
          </div>

          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <p className="inline-flex rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200">
              Product Work
            </p>
            <h1
              id="projects-hero-title"
              className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl"
            >
              Projects that shipped measurable outcomes
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-200 sm:text-lg">
              A curated collection of product and engineering projects, from platform reliability to high-conversion user journeys.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#all-projects"
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:translate-y-[-1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:bg-white dark:text-slate-950"
              >
                Explore all projects
              </a>
              <a
                href="mailto:hello@example.com"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200/70 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                Start a project conversation
              </a>
            </div>
          </div>
        </section>

        <section id="featured" aria-labelledby="featured-projects-title" className="py-16">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <h2
              id="featured-projects-title"
              className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
            >
              Featured case studies
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Deep dives into initiatives with clear business impact.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  layout="featured"
                  onOpen={openProject}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="all-projects" aria-labelledby="all-projects-title" className="border-t border-slate-200/60 py-16 dark:border-white/10">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <h2
              id="all-projects-title"
              className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
            >
              All projects
            </h2>

            <div className="mt-6" role="group" aria-label="Filter projects by category">
              <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">Filter by category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const isActive = category === activeFilter;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveFilter(category)}
                      aria-pressed={isActive}
                      className={[
                        "rounded-full border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500",
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950"
                          : "border-slate-300 bg-white text-slate-800 hover:border-slate-400 dark:border-white/20 dark:bg-slate-950 dark:text-slate-100",
                      ].join(" ")}
                      aria-label={`Filter projects: ${category}`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-6 text-sm text-slate-600 dark:text-slate-300" aria-live="polite">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>

            <div
              data-testid="projects-grid"
              className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onOpen={openProject} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <ProjectModal
        project={activeProject}
        onClose={closeProject}
        closeButtonRef={closeButtonRef}
      />
    </>
  );
}
