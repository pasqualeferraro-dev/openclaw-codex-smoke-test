import type { Project } from "../../data/projects";

type ProjectCardProps = {
  project: Project;
  layout?: "featured" | "grid";
  onOpen: (project: Project, trigger: HTMLButtonElement | null) => void;
};

export default function ProjectCard({
  project,
  layout = "grid",
  onOpen,
}: ProjectCardProps) {
  const isFeatured = layout === "featured";

  return (
    <article
      data-testid="project-card"
      className={[
        "rounded-2xl border border-slate-200/70 bg-white shadow-sm transition",
        "dark:border-white/10 dark:bg-slate-950",
        isFeatured
          ? "p-6 hover:shadow-soft"
          : "p-5 hover:translate-y-[-1px] hover:shadow-soft",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {project.category} • {project.year}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{project.tagline}</p>
        </div>
        <span
          className="rounded-full border border-slate-200/70 px-2 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:text-slate-300"
          aria-label={project.featured ? "Featured project" : "Project"}
        >
          {project.featured ? "Featured" : "Case"}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
        {project.summary}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${project.title} tech stack`}>
        {project.stack.map((item) => (
          <li
            key={item}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200"
          >
            {item}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={(event) => onOpen(project, event.currentTarget)}
        className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:translate-y-[-1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:bg-white dark:text-slate-950"
        aria-label={`Open case study for ${project.title}`}
      >
        Open case study
      </button>
    </article>
  );
}
