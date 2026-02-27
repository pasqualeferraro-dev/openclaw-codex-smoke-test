import type { MediaVideo } from "../../data/blog/types";

type MediaVideoProps = {
  media: MediaVideo;
};

export default function MediaVideoBlock({ media }: MediaVideoProps) {
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950">
      <div className="aspect-video w-full bg-slate-100 dark:bg-slate-900">
        <video
          controls
          preload="metadata"
          poster={media.poster}
          width={media.width ?? 1280}
          height={media.height ?? 720}
          className="h-full w-full"
        >
          <source src={media.src} />
          Your browser does not support video playback.
        </video>
      </div>
      {media.caption ? (
        <figcaption className="border-t border-slate-200/70 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
