import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <main className="mx-auto flex min-h-[60dvh] max-w-3xl flex-col items-start justify-center px-4 py-16 md:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Blog
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
        Article not found
      </h1>
      <p className="mt-3 text-slate-700 dark:text-slate-200">
        The link may be outdated or the post is no longer published.
      </p>
      <Link
        href="/blog"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:bg-white dark:text-slate-950"
      >
        Back to blog
      </Link>
    </main>
  );
}
