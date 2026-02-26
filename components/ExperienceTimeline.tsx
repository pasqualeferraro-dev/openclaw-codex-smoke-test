"use client";

import * as React from "react";
import { experience } from "../data/experience";

export default function ExperienceTimeline() {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  return (
    <ol className="relative mt-6 space-y-5 border-l border-slate-200/80 pl-6 dark:border-white/15">
      {experience.map((item) => {
        const isExpanded = expandedId === item.id;
        const panelId = `${item.id}-details`;

        return (
          <li key={item.id} className="group relative list-none">
            <div
              aria-hidden="true"
              className="absolute -left-[30px] top-6 h-3.5 w-3.5 rounded-full border-2 border-white bg-gradient-to-br from-ink-500 to-sky-500 shadow-sm dark:border-slate-950"
            />

            <article
              className={`rounded-2xl border p-5 shadow-sm transition ${
                isExpanded
                  ? "border-ink-300 bg-white ring-1 ring-ink-200 dark:border-ink-400/50 dark:bg-slate-950 dark:ring-ink-400/30"
                  : "border-slate-200/80 bg-white/90 hover:border-slate-300 focus-within:border-ink-300 dark:border-white/10 dark:bg-slate-950"
              }`}
            >
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {item.role}
                  </h3>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.company}
                  </p>
                </div>
                <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                  {item.timeframe}
                </p>
              </header>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-800 dark:text-slate-200">
                {item.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2" aria-label="Stack and keywords">
                {item.stack.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg px-2 py-1 text-sm font-semibold text-ink-700 underline-offset-2 transition hover:text-ink-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:text-ink-300 dark:hover:text-ink-200"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  {isExpanded ? "Hide details" : "More details"}
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-label={`More details about ${item.role} at ${item.company}`}
                  hidden={!isExpanded}
                  className="mt-2 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
                >
                  {item.details}
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
