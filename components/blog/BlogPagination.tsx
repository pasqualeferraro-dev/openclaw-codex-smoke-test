import Link from "next/link";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  queryParams?: Record<string, string | undefined>;
};

function createHref(
  basePath: string,
  queryParams: Record<string, string | undefined>,
  page: number,
) {
  const params = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (!value) return;
    params.set(key, value);
  });

  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export default function BlogPagination({
  currentPage,
  totalPages,
  basePath = "/blog",
  queryParams = {},
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Blog pagination" className="mt-10 flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const isCurrent = page === currentPage;

        return (
          <Link
            key={page}
            href={createHref(basePath, queryParams, page)}
            aria-current={isCurrent ? "page" : undefined}
            className={[
              "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500",
              isCurrent
                ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950"
                : "border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900",
            ].join(" ")}
          >
            {page}
          </Link>
        );
      })}
    </nav>
  );
}
