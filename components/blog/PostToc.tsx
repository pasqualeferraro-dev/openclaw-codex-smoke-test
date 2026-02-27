import type { TocItem } from "../../data/blog/utils";

type PostTocProps = {
  items: TocItem[];
};

export default function PostToc({ items }: PostTocProps) {
  if (items.length < 3) return null;

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">On this page</p>
        <nav aria-label="Table of contents" className="mt-3">
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
                <a
                  href={`#${item.id}`}
                  className="rounded-sm text-slate-700 transition hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:text-slate-300 dark:hover:text-white"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
