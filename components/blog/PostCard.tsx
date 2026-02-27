import Link from "next/link";
import type { Post } from "../../data/blog/types";
import { getReadTimeMinutes } from "../../data/blog/utils";
import { formatDate } from "./formatters";

type PostCardProps = {
  post: Post;
};

function Cover({ post }: { post: Post }) {
  if (post.coverMedia.type === "image" && post.coverMedia.src) {
    return (
      <img
        src={post.coverMedia.src}
        alt={post.coverMedia.alt ?? post.title}
        loading="lazy"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
      />
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-ink-500/80 via-fuchsia-500/70 to-sky-500/70" />
  );
}

export default function PostCard({ post }: PostCardProps) {
  const readTime = getReadTimeMinutes(post);

  return (
    <article
      data-testid="blog-post-card"
      className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-soft dark:border-white/10 dark:bg-slate-950"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500"
        aria-label={`Read article: ${post.title}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <div className="absolute inset-0 animate-pulse bg-slate-200/60 dark:bg-slate-800/70" />
          <Cover post={post} />
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            {post.categories.slice(0, 1).map((category) => (
              <span
                key={category}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 dark:bg-white/10 dark:text-slate-200"
              >
                {category}
              </span>
            ))}
            <span className="text-xs text-slate-500 dark:text-slate-400">{readTime} min read</span>
          </div>

          <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {post.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {post.excerpt}
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <img
              src={post.author.avatar}
              alt=""
              aria-hidden="true"
              className="h-6 w-6 rounded-full"
              loading="lazy"
            />
            <span>{post.author.name}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </div>
        </div>
      </Link>
    </article>
  );
}
