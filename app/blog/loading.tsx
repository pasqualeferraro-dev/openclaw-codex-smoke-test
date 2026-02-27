export default function BlogLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <div className="h-8 w-40 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
      <div className="mt-4 h-12 max-w-3xl animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 dark:border-white/10 dark:bg-slate-950"
          >
            <div className="aspect-[16/10] animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
            <div className="mt-4 h-6 w-2/3 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80" />
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80" />
          </div>
        ))}
      </div>
    </main>
  );
}
