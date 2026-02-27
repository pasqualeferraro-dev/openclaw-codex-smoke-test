import { render, screen } from "@testing-library/react";
import MediaEmbed from "../components/blog/MediaEmbed";
import PostBody from "../components/blog/PostBody";
import { getPostBySlug, getPublishedBlogPosts } from "../data/blog/posts";
import { filterPosts } from "../data/blog/utils";

describe("blog data and rendering", () => {
  it("resolves published posts by slug and excludes drafts", () => {
    expect(getPostBySlug("designing-product-analytics-pipeline")?.title).toMatch(
      /Product Analytics Pipeline/i,
    );
    expect(getPostBySlug("draft-content-modeling-for-fast-teams")).toBeNull();
    expect(getPostBySlug("missing-slug")).toBeNull();
  });

  it("filters posts by query and tag", () => {
    const posts = getPublishedBlogPosts();

    const byQuery = filterPosts(posts, { query: "incident" });
    expect(byQuery.length).toBeGreaterThan(0);
    expect(byQuery.some((post) => post.slug === "incident-command-center-ux")).toBe(true);

    const byTag = filterPosts(posts, { tag: "nextjs" });
    expect(byTag.every((post) => post.tags.includes("nextjs"))).toBe(true);
  });

  it("renders post body blocks", () => {
    const post = getPostBySlug("designing-product-analytics-pipeline");
    if (!post) throw new Error("Expected seeded post to exist");

    render(<PostBody blocks={post.content} />);

    expect(
      screen.getByRole("heading", {
        name: /Start from decision points, not event volume/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/Trust is not a dashboard style/i)).toBeInTheDocument();
  });

  it("falls back safely for unsupported or unsafe embeds", () => {
    render(<MediaEmbed url="javascript:alert(1)" caption="unsafe" />);

    expect(screen.getByTestId("embed-fallback")).toBeInTheDocument();
    expect(screen.getByText(/Only valid HTTPS URLs are supported/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Open original content/i })).not.toBeInTheDocument();
  });
});
