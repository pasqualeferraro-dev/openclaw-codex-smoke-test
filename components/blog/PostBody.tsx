import type { PostBlock } from "../../data/blog/types";
import { getPostHeadings } from "../../data/blog/utils";
import MediaAudio from "./MediaAudio";
import MediaEmbed from "./MediaEmbed";
import MediaImage from "./MediaImage";
import MediaVideoBlock from "./MediaVideo";

type PostBodyProps = {
  blocks: PostBlock[];
};

function calloutToneClass(tone: "info" | "warning" | "success") {
  if (tone === "warning") {
    return "border-amber-300/80 bg-amber-50 text-amber-900 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-100";
  }

  if (tone === "success") {
    return "border-emerald-300/80 bg-emerald-50 text-emerald-900 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-100";
  }

  return "border-sky-300/80 bg-sky-50 text-sky-900 dark:border-sky-500/50 dark:bg-sky-500/10 dark:text-sky-100";
}

export default function PostBody({ blocks }: PostBodyProps) {
  const headings = getPostHeadings({ content: blocks });
  let headingIndex = 0;

  return (
    <div data-testid="post-body" className="text-[17px] leading-8 text-slate-800 dark:text-slate-200">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const tocEntry = headings[headingIndex];
          headingIndex += 1;
          const Tag = block.level === 2 ? "h2" : "h3";

          return (
            <Tag
              key={`${block.type}-${index}`}
              id={tocEntry?.id}
              className={
                block.level === 2
                  ? "mt-10 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100"
                  : "mt-8 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
              }
            >
              {block.text}
            </Tag>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p
              key={`${block.type}-${index}`}
              className={[
                "mt-5 text-balance",
                index === 0
                  ? "first-letter:mr-1 first-letter:text-4xl first-letter:font-semibold first-letter:leading-none first-letter:text-slate-900 dark:first-letter:text-slate-100"
                  : "",
              ].join(" ")}
            >
              {block.text}
            </p>
          );
        }

        if (block.type === "quote") {
          return (
            <figure
              key={`${block.type}-${index}`}
              className="my-8 rounded-2xl border-l-4 border-ink-500 bg-slate-50 p-5 dark:bg-slate-900"
            >
              <blockquote className="text-lg italic leading-relaxed text-slate-800 dark:text-slate-200">
                “{block.text}”
              </blockquote>
              {block.citation ? (
                <figcaption className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {block.citation}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        if (block.type === "list") {
          const ListTag = block.style === "ordered" ? "ol" : "ul";
          return (
            <ListTag
              key={`${block.type}-${index}`}
              className={
                block.style === "ordered"
                  ? "mt-5 list-decimal space-y-2 pl-6"
                  : "mt-5 list-disc space-y-2 pl-6"
              }
            >
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ListTag>
          );
        }

        if (block.type === "callout") {
          return (
            <aside
              key={`${block.type}-${index}`}
              className={`my-8 rounded-2xl border p-4 ${calloutToneClass(block.tone)}`}
            >
              {block.title ? <p className="text-sm font-semibold uppercase tracking-wide">{block.title}</p> : null}
              <p className={block.title ? "mt-2" : ""}>{block.text}</p>
            </aside>
          );
        }

        if (block.type === "code") {
          return (
            <figure key={`${block.type}-${index}`} className="my-8 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-white/10">
              <figcaption className="border-b border-slate-200/70 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
                {block.language}
              </figcaption>
              <pre className="overflow-x-auto bg-slate-950 p-4 text-sm text-slate-100">
                <code>{block.code}</code>
              </pre>
            </figure>
          );
        }

        if (block.type === "image") {
          return <MediaImage key={`${block.type}-${index}`} media={block.media} />;
        }

        if (block.type === "audio") {
          return <MediaAudio key={`${block.type}-${index}`} media={block.media} />;
        }

        if (block.type === "video") {
          return <MediaVideoBlock key={`${block.type}-${index}`} media={block.media} />;
        }

        if (block.type === "embed") {
          return <MediaEmbed key={`${block.type}-${index}`} url={block.url} caption={block.caption} />;
        }

        return null;
      })}
    </div>
  );
}
