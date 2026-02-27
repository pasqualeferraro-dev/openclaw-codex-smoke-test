import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import ThemeProvider from "../../components/ThemeProvider";
import BlogFilters from "../../components/blog/BlogFilters";
import BlogPagination from "../../components/blog/BlogPagination";
import PostCard from "../../components/blog/PostCard";
import { BLOG_PAGE_SIZE, SITE_URL } from "../../data/blog/constants";
import {
  getAllBlogCategories,
  getAllBlogTags,
  getPublishedBlogPosts,
} from "../../data/blog/posts";
import { filterPosts, paginatePosts, sortPosts, type BlogSort } from "../../data/blog/utils";

export const metadata: Metadata = {
  title: "Blog | Pasquale Ferraro",
  description: "Editorial notes on product engineering, UX, and systems that scale.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog | Pasquale Ferraro",
    description: "Editorial notes on product engineering, UX, and systems that scale.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Pasquale Ferraro",
    description: "Editorial notes on product engineering, UX, and systems that scale.",
  },
};

type BlogPageProps = {
  searchParams?: Promise<{
    q?: string;
    tag?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
};

function parsePage(rawPage?: string) {
  const parsed = Number(rawPage);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query =
    typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";
  const tag = typeof resolvedSearchParams?.tag === "string" ? resolvedSearchParams.tag : "";
  const category =
    typeof resolvedSearchParams?.category === "string" ? resolvedSearchParams.category : "";
  const sort: BlogSort =
    resolvedSearchParams?.sort === "popular" ? "popular" : "recent";
  const page = parsePage(resolvedSearchParams?.page);

  const publishedPosts = getPublishedBlogPosts();
  const featuredPost = sortPosts(publishedPosts, "recent")[0] ?? null;
  const filteredPosts = filterPosts(publishedPosts, { query, tag, category, sort });
  const paginated = paginatePosts(filteredPosts, page, BLOG_PAGE_SIZE);
  const categories = getAllBlogCategories();
  const tags = getAllBlogTags();

  return (
    <ThemeProvider>
      <div className="min-h-dvh">
        <Navbar />

        <main>
          <section className="relative overflow-hidden border-b border-slate-200/60 py-20 dark:border-white/10">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -left-10 top-[-90px] h-72 w-72 rounded-full bg-ink-500/20 blur-3xl" />
              <div className="absolute -right-12 bottom-[-100px] h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
            </div>

            <div className="mx-auto max-w-6xl px-4 md:px-6">
              <p className="inline-flex rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200">
                Editorial Journal
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                Product engineering notes with a shipping mindset
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-200 sm:text-lg">
                Case studies, practical patterns, and technical decisions from real product work.
              </p>

              {featuredPost ? (
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="mt-8 block max-w-2xl rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/10 dark:bg-slate-950"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Featured article
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    {featuredPost.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{featuredPost.excerpt}</p>
                </Link>
              ) : null}
            </div>
          </section>

          <section className="py-12">
            <div className="mx-auto max-w-6xl px-4 md:px-6">
              <BlogFilters
                categories={categories}
                tags={tags}
                initialQuery={query}
                initialCategory={category}
                initialTag={tag}
                initialSort={sort}
              />

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-600 dark:text-slate-300" aria-live="polite">
                  Showing {paginated.items.length} of {filteredPosts.length} posts
                </p>
                <Link
                  href="/blog/studio"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200/70 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  Open studio
                </Link>
              </div>

              {paginated.items.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {paginated.items.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-sm text-slate-700 dark:border-white/20 dark:bg-slate-900 dark:text-slate-200">
                  No posts match these filters. Try removing one filter.
                </div>
              )}

              <BlogPagination
                currentPage={paginated.currentPage}
                totalPages={paginated.totalPages}
                queryParams={{
                  q: query || undefined,
                  tag: tag || undefined,
                  category: category || undefined,
                  sort: sort === "popular" ? "popular" : undefined,
                }}
              />
            </div>
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
}
