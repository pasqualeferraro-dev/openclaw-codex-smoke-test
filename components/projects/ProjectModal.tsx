import * as React from "react";
import type { Project } from "../../data/projects";

type ProjectModalProps = {
  project: Project | null;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
};

export default function ProjectModal({
  project,
  closeButtonRef,
  onClose,
}: ProjectModalProps) {
  if (!project) return null;

  const titleId = `${project.id}-dialog-title`;
  const descriptionId = `${project.id}-dialog-description`;

  return (
    <div
      data-testid="project-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/55 p-2 sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-5xl items-end sm:items-center">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="max-h-[90dvh] w-full overflow-y-auto rounded-2xl border border-slate-200/70 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-950"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Case Study • {project.category}
              </p>
              <h2
                id={titleId}
                className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
              >
                {project.title}
              </h2>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200/70 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              aria-label="Close case study"
            >
              Close
            </button>
          </div>

          <p
            id={descriptionId}
            className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200"
          >
            {project.summary}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <section aria-label="Problem">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Problem
              </h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                {project.caseStudy.problem}
              </p>
            </section>

            <section aria-label="Approach">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Approach
              </h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                {project.caseStudy.approach}
              </p>
            </section>

            <section aria-label="Impact">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Impact
              </h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                {project.caseStudy.impact}
              </p>
            </section>
          </div>

          <section className="mt-6" aria-label="Key outcomes">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Key outcomes
            </h3>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {project.metrics.map((metric) => (
                <li
                  key={metric}
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-800 dark:bg-white/10 dark:text-slate-100"
                >
                  {metric}
                </li>
              ))}
            </ul>
          </section>
        </section>
      </div>
    </div>
  );
}
