"use client";

import * as React from "react";
import type { PostBlock, PostStatus, StudioPostDraft } from "../../data/blog/types";
import { slugify } from "../../data/blog/utils";
import PostBody from "./PostBody";

const STORAGE_KEY = "blog-studio-posts";
const MAX_IMAGE_MB = 5;
const MAX_AUDIO_MB = 15;
const MAX_VIDEO_MB = 40;

type UploadKind = "image" | "audio" | "video";

type EditorState = {
  slug: string;
  title: string;
  excerpt: string;
  authorName: string;
  authorAvatar: string;
  publishedAt: string;
  categories: string;
  tags: string;
  status: PostStatus;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  coverMediaType: "image" | "gradient";
  coverMediaSrc: string;
  coverMediaAlt: string;
  contentText: string;
};

const starterBlocks: PostBlock[] = [
  {
    type: "heading",
    level: 2,
    text: "Start here",
  },
  {
    type: "paragraph",
    text: "Write the first paragraph of your article here.",
  },
];

function defaultState(): EditorState {
  return {
    slug: "",
    title: "",
    excerpt: "",
    authorName: "Pasquale Ferraro",
    authorAvatar: "/blog/authors/pasquale.svg",
    publishedAt: new Date().toISOString().slice(0, 16),
    categories: "Engineering",
    tags: "",
    status: "draft",
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
    coverMediaType: "gradient",
    coverMediaSrc: "",
    coverMediaAlt: "",
    contentText: JSON.stringify(starterBlocks, null, 2),
  };
}

function parseStoredDrafts(): StudioPostDraft[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StudioPostDraft[];
  } catch {
    return [];
  }
}

function persistDrafts(drafts: StudioPostDraft[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

function splitCsv(input: string) {
  return input
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function parseBlocks(contentText: string): PostBlock[] {
  const parsed = JSON.parse(contentText);
  if (!Array.isArray(parsed)) {
    throw new Error("Content must be a JSON array of blocks.");
  }

  return parsed as PostBlock[];
}

function createDraftPayload(state: EditorState): StudioPostDraft {
  const normalizedSlug = slugify(state.slug || state.title);

  const content = parseBlocks(state.contentText);

  return {
    id: normalizedSlug,
    slug: normalizedSlug,
    title: state.title.trim(),
    excerpt: state.excerpt.trim(),
    content,
    coverMedia:
      state.coverMediaType === "image" && state.coverMediaSrc
        ? {
            type: "image",
            src: state.coverMediaSrc,
            alt: state.coverMediaAlt || state.title,
          }
        : { type: "gradient" },
    author: {
      name: state.authorName.trim() || "Editorial Team",
      avatar: state.authorAvatar.trim() || "/blog/authors/pasquale.svg",
    },
    publishedAt: new Date(state.publishedAt).toISOString(),
    updatedAt: new Date().toISOString(),
    categories: splitCsv(state.categories),
    tags: splitCsv(state.tags),
    status: state.status,
    seo: {
      metaTitle: state.metaTitle.trim() || state.title.trim(),
      metaDescription: state.metaDescription.trim() || state.excerpt.trim(),
      ogImage: state.ogImage.trim() || state.coverMediaSrc || undefined,
    },
    popularity: 0,
  };
}

function fromDraft(draft: StudioPostDraft): EditorState {
  return {
    slug: draft.slug,
    title: draft.title,
    excerpt: draft.excerpt,
    authorName: draft.author.name,
    authorAvatar: draft.author.avatar,
    publishedAt: new Date(draft.publishedAt ?? new Date().toISOString()).toISOString().slice(0, 16),
    categories: draft.categories.join(", "),
    tags: draft.tags.join(", "),
    status: draft.status ?? "draft",
    metaTitle: draft.seo.metaTitle,
    metaDescription: draft.seo.metaDescription,
    ogImage: draft.seo.ogImage ?? "",
    coverMediaType: draft.coverMedia.type,
    coverMediaSrc: draft.coverMedia.src ?? "",
    coverMediaAlt: draft.coverMedia.alt ?? "",
    contentText: JSON.stringify(draft.content, null, 2),
  };
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}

function validateFile(file: File, kind: UploadKind): string | null {
  const sizeMb = file.size / (1024 * 1024);

  if (kind === "image") {
    if (!file.type.startsWith("image/")) return "Image upload accepts image/* only.";
    if (sizeMb > MAX_IMAGE_MB) return `Image must be <= ${MAX_IMAGE_MB}MB.`;
    return null;
  }

  if (kind === "audio") {
    if (!file.type.startsWith("audio/")) return "Audio upload accepts audio/* only.";
    if (sizeMb > MAX_AUDIO_MB) return `Audio must be <= ${MAX_AUDIO_MB}MB.`;
    return null;
  }

  if (!file.type.startsWith("video/")) return "Video upload accepts video/* only.";
  if (sizeMb > MAX_VIDEO_MB) return `Video must be <= ${MAX_VIDEO_MB}MB.`;
  return null;
}

export default function StudioEditor() {
  const [state, setState] = React.useState<EditorState>(defaultState);
  const [storedDrafts, setStoredDrafts] = React.useState<StudioPostDraft[]>([]);
  const [selectedDraftSlug, setSelectedDraftSlug] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [uploadKind, setUploadKind] = React.useState<UploadKind>("image");
  const [uploadAlt, setUploadAlt] = React.useState("");
  const [uploadCaption, setUploadCaption] = React.useState("");

  React.useEffect(() => {
    setStoredDrafts(parseStoredDrafts());
  }, []);

  const parsedContent = React.useMemo(() => {
    try {
      return { blocks: parseBlocks(state.contentText), error: "" };
    } catch (error) {
      return {
        blocks: [] as PostBlock[],
        error: error instanceof Error ? error.message : "Invalid content JSON",
      };
    }
  }, [state.contentText]);

  function setField<K extends keyof EditorState>(field: K, value: EditorState[K]) {
    setState((prev) => ({ ...prev, [field]: value }));
  }

  function onAutoSlug() {
    setField("slug", slugify(state.title));
  }

  function onLoadDraft() {
    const found = storedDrafts.find((draft) => draft.slug === selectedDraftSlug);
    if (!found) return;

    setState(fromDraft(found));
    setMessage(`Loaded draft: ${found.slug}`);
  }

  function onNewDraft() {
    setState(defaultState());
    setSelectedDraftSlug("");
    setMessage("New draft started.");
  }

  function onSaveDraft() {
    try {
      const payload = createDraftPayload(state);
      if (!payload.slug) {
        setMessage("Slug is required.");
        return;
      }
      if (!payload.title) {
        setMessage("Title is required.");
        return;
      }

      const nextDrafts = [...storedDrafts];
      const index = nextDrafts.findIndex((draft) => draft.slug === payload.slug);
      if (index >= 0) {
        nextDrafts[index] = payload;
      } else {
        nextDrafts.push(payload);
      }

      persistDrafts(nextDrafts);
      setStoredDrafts(nextDrafts);
      setSelectedDraftSlug(payload.slug);
      setMessage(`Draft saved (${payload.status}): ${payload.slug}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save draft.");
    }
  }

  async function onUploadCover(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, "image");
    if (validation) {
      setMessage(validation);
      event.target.value = "";
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    setField("coverMediaType", "image");
    setField("coverMediaSrc", dataUrl);
    if (!state.coverMediaAlt) {
      setField("coverMediaAlt", state.title || file.name);
    }
    setMessage(`Cover uploaded: ${file.name}`);
    event.target.value = "";
  }

  async function onUploadMedia(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, uploadKind);
    if (validation) {
      setMessage(validation);
      event.target.value = "";
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    const currentBlocks = parsedContent.blocks;

    const nextBlock: PostBlock =
      uploadKind === "image"
        ? {
            type: "image",
            media: {
              kind: "image",
              src: dataUrl,
              alt: uploadAlt || file.name,
              caption: uploadCaption || undefined,
            },
          }
        : uploadKind === "audio"
          ? {
              type: "audio",
              media: {
                kind: "audio",
                src: dataUrl,
                caption: uploadCaption || undefined,
                mimeType: file.type,
              },
            }
          : {
              type: "video",
              media: {
                kind: "video",
                src: dataUrl,
                caption: uploadCaption || undefined,
              },
            };

    const nextBlocks = [...currentBlocks, nextBlock];
    setField("contentText", JSON.stringify(nextBlocks, null, 2));
    setUploadAlt("");
    setUploadCaption("");
    setMessage(`${uploadKind} block appended to content.`);
    event.target.value = "";
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:px-6 xl:grid-cols-[1fr_1fr]">
      <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Blog Studio
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onNewDraft}
              className="rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-200"
            >
              New draft
            </button>
            <button
              type="button"
              onClick={onSaveDraft}
              className="rounded-lg bg-slate-950 px-3 py-1.5 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:bg-white dark:text-slate-950"
            >
              Save draft
            </button>
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Local editor with browser storage. Since this repo has no auth system yet, publishing permissions are not role-gated.
        </p>

        {message ? (
          <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-white/10 dark:text-slate-200">
            {message}
          </p>
        ) : null}

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Load existing draft
            </span>
            <div className="flex gap-2">
              <select
                value={selectedDraftSlug}
                onChange={(event) => setSelectedDraftSlug(event.target.value)}
                className="h-10 flex-1 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">Select saved draft</option>
                {storedDrafts.map((draft) => (
                  <option key={draft.slug} value={draft.slug}>
                    {draft.slug}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={onLoadDraft}
                className="rounded-xl border border-slate-200/80 bg-white px-3 text-sm font-medium text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-200"
              >
                Load
              </button>
            </div>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Title</span>
            <input
              value={state.title}
              onChange={(event) => setField("title", event.target.value)}
              className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Slug</span>
            <div className="flex gap-2">
              <input
                value={state.slug}
                onChange={(event) => setField("slug", event.target.value)}
                className="h-10 flex-1 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={onAutoSlug}
                className="rounded-xl border border-slate-200/80 bg-white px-3 text-sm font-medium text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-200"
              >
                Auto
              </button>
            </div>
          </label>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Excerpt</span>
            <textarea
              value={state.excerpt}
              onChange={(event) => setField("excerpt", event.target.value)}
              rows={2}
              className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Categories (csv)</span>
            <input
              value={state.categories}
              onChange={(event) => setField("categories", event.target.value)}
              className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Tags (csv)</span>
            <input
              value={state.tags}
              onChange={(event) => setField("tags", event.target.value)}
              className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Published at</span>
            <input
              type="datetime-local"
              value={state.publishedAt}
              onChange={(event) => setField("publishedAt", event.target.value)}
              className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</span>
            <select
              value={state.status}
              onChange={(event) => setField("status", event.target.value as PostStatus)}
              className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">SEO title</span>
            <input
              value={state.metaTitle}
              onChange={(event) => setField("metaTitle", event.target.value)}
              className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">OG image URL</span>
            <input
              value={state.ogImage}
              onChange={(event) => setField("ogImage", event.target.value)}
              className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">SEO description</span>
            <textarea
              value={state.metaDescription}
              onChange={(event) => setField("metaDescription", event.target.value)}
              rows={2}
              className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <div className="md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Cover media</p>
            <div className="mt-1 grid grid-cols-1 gap-2 md:grid-cols-3">
              <select
                value={state.coverMediaType}
                onChange={(event) => setField("coverMediaType", event.target.value as "image" | "gradient")}
                className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="gradient">Gradient placeholder</option>
                <option value="image">Image</option>
              </select>
              <input
                value={state.coverMediaSrc}
                onChange={(event) => setField("coverMediaSrc", event.target.value)}
                placeholder="Cover image URL or data URL"
                className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
              />
              <input
                value={state.coverMediaAlt}
                onChange={(event) => setField("coverMediaAlt", event.target.value)}
                placeholder="Cover alt text"
                className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-white/15 dark:bg-slate-900 dark:text-slate-200">
              Upload cover (image only)
              <input type="file" accept="image/*" className="hidden" onChange={onUploadCover} />
            </label>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Media upload</p>
            <div className="mt-1 grid grid-cols-1 gap-2 md:grid-cols-4">
              <select
                value={uploadKind}
                onChange={(event) => setUploadKind(event.target.value as UploadKind)}
                className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="image">Image</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>
              <input
                value={uploadAlt}
                onChange={(event) => setUploadAlt(event.target.value)}
                placeholder="Alt text (for image)"
                className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
              />
              <input
                value={uploadCaption}
                onChange={(event) => setUploadCaption(event.target.value)}
                placeholder="Caption"
                className="h-10 rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
              />
              <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 bg-white px-3 text-sm font-medium text-slate-700 dark:border-white/15 dark:bg-slate-900 dark:text-slate-200">
                Upload + append
                <input
                  type="file"
                  accept={uploadKind === "image" ? "image/*" : uploadKind === "audio" ? "audio/*" : "video/*"}
                  className="hidden"
                  onChange={onUploadMedia}
                />
              </label>
            </div>
          </div>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Content blocks (JSON)
            </span>
            <textarea
              value={state.contentText}
              onChange={(event) => setField("contentText", event.target.value)}
              rows={18}
              className="w-full rounded-xl border border-slate-200/80 bg-slate-950 px-3 py-3 font-mono text-xs text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500"
            />
            {parsedContent.error ? (
              <p className="text-sm text-rose-600 dark:text-rose-300">{parsedContent.error}</p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports blocks: heading, paragraph, quote, list, callout, code, image, audio, video, embed.
              </p>
            )}
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Preview</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
          {state.title || "Untitled article"}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700 dark:text-slate-200">
          {state.excerpt || "Add an excerpt to preview your article summary."}
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-white/10">
          {state.coverMediaType === "image" && state.coverMediaSrc ? (
            <img src={state.coverMediaSrc} alt={state.coverMediaAlt || "Preview cover"} className="h-auto w-full" />
          ) : (
            <div className="aspect-[16/7] w-full bg-gradient-to-br from-ink-500/85 via-fuchsia-500/75 to-sky-500/75" />
          )}
        </div>

        <div className="mt-8 border-t border-slate-200/70 pt-6 dark:border-white/10">
          <PostBody blocks={parsedContent.blocks} />
        </div>
      </section>
    </div>
  );
}
