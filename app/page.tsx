"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Navbar from "../components/Navbar";
import ThemeProvider from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import { projects } from "../data/projects";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });
  const headingId = `${id}-title`;

  return (
    <motion.section
      ref={ref}
      id={id}
      aria-labelledby={headingId}
      initial={shouldReduceMotion ? "visible" : "hidden"}
      animate={shouldReduceMotion ? "visible" : isInView ? "visible" : "hidden"}
      variants={reveal}
      transition={{ duration: 0.5 }}
      className="scroll-mt-24 py-16"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id={headingId}
          className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
        >
          {title}
        </h2>
        <div className="mt-4 text-slate-700 dark:text-slate-200">{children}</div>
      </div>
    </motion.section>
  );
}

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const featuredProjects = React.useMemo(
    () => projects.filter((project) => project.featured).slice(0, 3),
    [],
  );
  const heroMotion = shouldReduceMotion
    ? {}
    : {
        initial: "hidden",
        animate: "visible",
        variants: fadeUp,
        transition: { duration: 0.45 },
      };
  const cardHover = shouldReduceMotion ? undefined : { y: -2 };

  return (
    <ThemeProvider>
      <div id="top" className="min-h-dvh">
        <Navbar />

        <main>
          {/* Hero */}
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -top-24 left-[-20%] h-80 w-80 rounded-full bg-ink-500/25 blur-3xl" />
              <div className="absolute -bottom-24 right-[-10%] h-96 w-96 rounded-full bg-sky-400/25 blur-3xl" />
              <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400/10 blur-3xl" />
            </div>

            <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
              <motion.div
                {...heroMotion}
                className="max-w-2xl"
              >
                <p className="inline-flex items-center rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200">
                  Available for interesting problems • Stockholm
                </p>

                <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                  Pasquale Ferraro
                  <span className="block bg-gradient-to-r from-ink-600 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent">
                    Product-minded engineer
                  </span>
                </h1>

                <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-200 sm:text-lg">
                  I build reliable products with a bias for clarity: thoughtful UX,
                  clean architecture, and fast feedback loops.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#projects"
                    className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:translate-y-[-1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:bg-white dark:text-slate-950"
                  >
                    View projects
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200/70 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                  >
                    Contact
                  </a>
                  <ThemeToggle />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Sections */}
          <Section id="about" title="About">
            <p>
              Short version: I like shipping.
              <br />
              Long version: I’m happiest when I can connect product intent to
              pragmatic engineering, and iterate with real users.
            </p>
          </Section>

          <Section id="projects" title="Featured Projects">
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {featuredProjects.map((project) => (
                <motion.a
                  key={project.id}
                  href={`/projects?project=${encodeURIComponent(project.id)}`}
                  whileHover={cardHover}
                  transition={{ duration: 0.15 }}
                  className="group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/10 dark:bg-slate-950"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {project.category} • {project.year}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {project.title}
                      </h3>
                    </div>
                    <span className="text-slate-400 transition group-hover:text-slate-600 dark:group-hover:text-slate-300">
                      →
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
                    {project.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.a>
              ))}
            </div>
          </Section>

          <Section id="skills" title="Skills & Tech">
            <ul className="mt-6 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
              {[
                "TypeScript / Node.js",
                "React / Next.js",
                "Testing-first mindset",
                "API design & integrations",
              ].map((s) => (
                <li
                  key={s}
                  className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
                >
                  {s}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="contact" title="Contact">
            <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-950">
              <p className="text-slate-700 dark:text-slate-200">
                Want to collaborate? Send an email or find me online.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="mailto:hello@example.com"
                  className="inline-flex items-center justify-center rounded-xl bg-ink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500"
                >
                  Email me
                </a>
                <a
                  href="https://github.com/pasqualeferraro-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200/70 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  GitHub
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200/70 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </Section>

          <footer className="border-t border-slate-200/60 py-10 dark:border-white/10">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-600 dark:text-slate-300 md:flex-row md:px-6">
              <p>© {new Date().getFullYear()} Pasquale Ferraro</p>
              <div className="flex gap-4">
                <a
                  className="rounded-md transition hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:hover:text-white"
                  href="https://github.com/pasqualeferraro-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                  className="rounded-md transition hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:hover:text-white"
                  href="#"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </ThemeProvider>
  );
}
