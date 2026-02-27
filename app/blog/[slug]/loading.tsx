export default function BlogPostLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="aspect-[16/7] animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-800/80" />
      <div className="mx-auto mt-10 max-w-3xl space-y-4">
        <div className="h-12 w-4/5 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-5 w-full animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800/80" />
      </div>
    </main>
  );
}
