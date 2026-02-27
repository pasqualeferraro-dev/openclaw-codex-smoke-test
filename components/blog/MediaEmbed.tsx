import { resolveEmbed } from "../../data/blog/embed";

type MediaEmbedProps = {
  url: string;
  caption?: string;
};

export default function MediaEmbed({ url, caption }: MediaEmbedProps) {
  const embed = resolveEmbed(url);

  if (embed.type === "fallback") {
    return (
      <figure
        data-testid="embed-fallback"
        className="my-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-white/20 dark:bg-slate-900"
      >
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Unsupported embed</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{embed.reason}</p>
        {embed.url ? (
          <a
            href={embed.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/20 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Open original content
          </a>
        ) : null}
        {caption ? (
          <figcaption className="mt-3 text-sm text-slate-600 dark:text-slate-300">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className="my-8">
      <div className={`overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 dark:border-white/10 dark:bg-slate-900 ${embed.aspectRatioClass}`}>
        <iframe
          src={embed.src}
          title={embed.title}
          loading="lazy"
          allow={embed.allow}
          allowFullScreen={embed.allowFullScreen}
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-same-origin allow-scripts allow-presentation allow-popups"
          className="h-full w-full"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm text-slate-600 dark:text-slate-300">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
