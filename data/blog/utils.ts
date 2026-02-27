import type { Post, PostBlock } from "./types";

export type BlogSort = "recent" | "popular";

export type BlogFilters = {
  query?: string;
  tag?: string;
  category?: string;
  sort?: BlogSort;
};

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

const WORDS_PER_MINUTE = 220;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function blockText(block: PostBlock): string {
  switch (block.type) {
    case "heading":
    case "paragraph":
    case "quote":
    case "callout":
      return block.text;
    case "list":
      return block.items.join(" ");
    case "code":
      return block.code;
    case "image":
      return [block.media.alt, block.media.caption].filter(Boolean).join(" ");
    case "audio":
    case "video":
      return block.media.caption ?? "";
    case "embed":
      return block.caption ?? "";
    default:
      return "";
  }
}

export function getReadTimeMinutes(post: Pick<Post, "title" | "excerpt" | "content">): number {
  const bodyText = post.content.map((block) => blockText(block)).join(" ");
  const words = `${post.title} ${post.excerpt} ${bodyText}`
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function getPostHeadings(post: Pick<Post, "content">): TocItem[] {
  const usedIds = new Set<string>();

  return post.content
    .filter((block): block is Extract<PostBlock, { type: "heading" }> => block.type === "heading")
    .map((heading) => {
      const base = slugify(heading.text) || "section";
      let id = heading.id || base;
      let n = 2;
      while (usedIds.has(id)) {
        id = `${base}-${n}`;
        n += 1;
      }
      usedIds.add(id);
      return {
        id,
        text: heading.text,
        level: heading.level,
      };
    });
}

export function sortPosts(posts: Post[], sort: BlogSort = "recent"): Post[] {
  const cloned = [...posts];
  if (sort === "popular") {
    return cloned.sort((a, b) => b.popularity - a.popularity);
  }

  return cloned.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function filterPosts(posts: Post[], filters: BlogFilters): Post[] {
  const query = filters.query?.trim().toLowerCase() ?? "";
  const tag = filters.tag?.trim().toLowerCase() ?? "";
  const category = filters.category?.trim().toLowerCase() ?? "";

  const filtered = posts.filter((post) => {
    const matchesQuery =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some((item) => item.toLowerCase().includes(query)) ||
      post.categories.some((item) => item.toLowerCase().includes(query));

    const matchesTag = !tag || post.tags.some((item) => item.toLowerCase() === tag);
    const matchesCategory =
      !category || post.categories.some((item) => item.toLowerCase() === category);

    return matchesQuery && matchesTag && matchesCategory;
  });

  return sortPosts(filtered, filters.sort ?? "recent");
}

export function paginatePosts<T>(items: T[], page: number, pageSize: number) {
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(items.length / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * safePageSize;

  return {
    items: items.slice(start, start + safePageSize),
    currentPage,
    totalPages,
    totalItems: items.length,
  };
}

export function getRelatedPosts(posts: Post[], currentPost: Post, max = 3): Post[] {
  const currentTags = new Set(currentPost.tags.map((tag) => tag.toLowerCase()));

  return posts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) => currentTags.has(tag.toLowerCase())).length;
      return { post, score: sharedTags };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score === a.score) {
        return (
          new Date(b.post.publishedAt).getTime() - new Date(a.post.publishedAt).getTime()
        );
      }
      return b.score - a.score;
    })
    .slice(0, max)
    .map((entry) => entry.post);
}

export function buildArticleJsonLd(post: Post, canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo.metaDescription,
    image: post.seo.ogImage ? [post.seo.ogImage] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    mainEntityOfPage: canonicalUrl,
    articleSection: post.categories,
    keywords: post.tags.join(", "),
  };
}
