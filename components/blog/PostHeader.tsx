import type { Post } from "../../data/blog/types";
import { getReadTimeMinutes } from "../../data/blog/utils";
import { formatDate } from "./formatters";
import ShareButtons from "./ShareButtons";

type PostHeaderProps = {
  post: Post;
  canonicalUrl: string;
};

export default function PostHeader({ post, canonicalUrl }: PostHeaderProps) {
  const readTime = getReadTimeMinutes(post);

  return (
    <header className="border-b border-slate-200/60 pb-10 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-14">
        <div className="overflow-hidden rounded-3xl border border-slate-200/70 dark:border-white/10">
          {post.coverMedia.type === "image" && post.coverMedia.src ? (
            <img
              src={post.coverMedia.src}
              alt={post.coverMedia.alt ?? post.title}
              className="h-auto w-full object-cover"
              width={post.coverMedia.width ?? 1600}
              height={post.coverMedia.height ?? 900}
              fetchPriority="high"
            />
          ) : (
            <div className="aspect-[16/7] w-full bg-gradient-to-br from-ink-500/85 via-fuchsia-500/75 to-sky-500/75" />
          )}
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-white/10 dark:text-slate-200"
              >
                {category}
              </span>
            ))}
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-200">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-col gap-4 border-t border-slate-200/70 pt-6 dark:border-white/10 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt=""
                aria-hidden="true"
                className="h-10 w-10 rounded-full border border-slate-200/70 dark:border-white/10"
              />
              <div className="text-sm">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{post.author.name}</p>
                <p className="text-slate-600 dark:text-slate-300">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <span aria-hidden="true"> • </span>
                  <span>{readTime} min read</span>
                  {post.updatedAt ? (
                    <>
                      <span aria-hidden="true"> • </span>
                      <span>Updated {formatDate(post.updatedAt)}</span>
                    </>
                  ) : null}
                </p>
              </div>
            </div>

            <ShareButtons title={post.title} url={canonicalUrl} />
          </div>
        </div>
      </div>
    </header>
  );
}
