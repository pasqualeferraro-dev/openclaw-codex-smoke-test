"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import type { BlogSort } from "../../data/blog/utils";

type BlogFiltersProps = {
  categories: string[];
  tags: string[];
  initialQuery: string;
  initialCategory: string;
  initialTag: string;
  initialSort: BlogSort;
};

function buildParams(params: {
  query: string;
  category: string;
  tag: string;
  sort: BlogSort;
}) {
  const nextParams = new URLSearchParams();

  if (params.query) nextParams.set("q", params.query);
  if (params.category) nextParams.set("category", params.category);
  if (params.tag) nextParams.set("tag", params.tag);
  if (params.sort !== "recent") nextParams.set("sort", params.sort);

  return nextParams.toString();
}

export default function BlogFilters({
  categories,
  tags,
  initialQuery,
  initialCategory,
  initialTag,
  initialSort,
}: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = React.useState(initialQuery);
  const [category, setCategory] = React.useState(initialCategory);
  const [tag, setTag] = React.useState(initialTag);
  const [sort, setSort] = React.useState<BlogSort>(initialSort);

  React.useEffect(() => {
    setQuery(initialQuery);
    setCategory(initialCategory);
    setTag(initialTag);
    setSort(initialSort);
  }, [initialCategory, initialQuery, initialSort, initialTag]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      const queryString = buildParams({ query, category, tag, sort });
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(nextUrl, { scroll: false });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [category, pathname, query, router, sort, tag]);

  return (
    <section
      aria-label="Blog filters"
      className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Search
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts"
            className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-ink-400 focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Category
          </span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-ink-400 focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">All</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Tag
          </span>
          <select
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-ink-400 focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">All</option>
            {tags.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Sort
          </span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as BlogSort)}
            className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-ink-400 focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="recent">Most recent</option>
            <option value="popular">Most popular</option>
          </select>
        </label>
      </div>
    </section>
  );
}
