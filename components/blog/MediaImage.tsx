"use client";

import * as React from "react";
import type { MediaImage as MediaImageType } from "../../data/blog/types";

type MediaImageProps = {
  media: MediaImageType;
};

export default function MediaImage({ media }: MediaImageProps) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950">
      <div className="relative">
        {!loaded ? <div className="absolute inset-0 animate-pulse bg-slate-200/70 dark:bg-slate-800/80" /> : null}
        <img
          src={media.src}
          alt={media.alt}
          loading="lazy"
          width={media.width ?? 1400}
          height={media.height ?? 840}
          className="h-auto w-full"
          onLoad={() => setLoaded(true)}
        />
      </div>
      {media.caption ? (
        <figcaption className="border-t border-slate-200/70 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
