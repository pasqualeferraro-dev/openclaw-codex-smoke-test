import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";
import ThemeProvider from "../../../components/ThemeProvider";
import PostCard from "../../../components/blog/PostCard";
import PostBody from "../../../components/blog/PostBody";
import PostHeader from "../../../components/blog/PostHeader";
import PostToc from "../../../components/blog/PostToc";
import { SITE_URL } from "../../../data/blog/constants";
import { getPostBySlug, getPublishedBlogPosts } from "../../../data/blog/posts";
import {
  buildArticleJsonLd,
  getPostHeadings,
  getRelatedPosts,
  getReadTimeMinutes,
} from "../../../data/blog/utils";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getPublishedBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found | Blog",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: post.seo.ogImage ? [post.seo.ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      images: post.seo.ogImage ? [post.seo.ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getPublishedBlogPosts();
  const relatedPosts = getRelatedPosts(allPosts, post, 3);
  const toc = getPostHeadings(post);
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = buildArticleJsonLd(post, canonicalUrl);
  const readTime = getReadTimeMinutes(post);

  return (
    <ThemeProvider>
      <div className="min-h-dvh">
        <Navbar />
        <PostHeader post={post} canonicalUrl={canonicalUrl} />

        <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:px-6 xl:grid-cols-[1fr_280px]">
          <article className="mx-auto w-full max-w-3xl">
            <PostBody blocks={post.content} />

            <div className="mt-10 border-t border-slate-200/70 pt-6 dark:border-white/10">
              <p className="text-sm text-slate-600 dark:text-slate-300">{readTime} min read</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </article>

          <PostToc items={toc} />
        </main>

        <section className="border-t border-slate-200/60 py-14 dark:border-white/10">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Related articles
            </h2>

            {relatedPosts.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <PostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                More editorial content is coming soon.
              </p>
            )}
          </div>
        </section>

        <section className="border-t border-slate-200/60 py-14 dark:border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Newsletter
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Want more product engineering deep dives?
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Reach out to discuss collaboration, workshops, or architecture reviews.
              </p>
            </div>
            <a
              href="mailto:hello@example.com"
              className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:bg-white dark:text-slate-950"
            >
              Contact
            </a>
          </div>
        </section>

        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </div>
    </ThemeProvider>
  );
}
