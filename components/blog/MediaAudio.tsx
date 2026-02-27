"use client";

import * as React from "react";
import type { MediaAudio } from "../../data/blog/types";

type MediaAudioProps = {
  media: MediaAudio;
};

const speeds = [0.75, 1, 1.25, 1.5];

export default function AudioPlayer({ media }: MediaAudioProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [speed, setSpeed] = React.useState(1);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  return (
    <figure className="my-8 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Audio</span>
        <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          Speed
          <select
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            className="rounded-md border border-slate-200/80 bg-white px-2 py-1 text-xs text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          >
            {speeds.map((value) => (
              <option key={value} value={value}>
                {value}x
              </option>
            ))}
          </select>
        </label>
      </div>
      <audio
        ref={audioRef}
        controls
        preload="metadata"
        className="mt-3 w-full"
      >
        <source src={media.src} type={media.mimeType} />
        Your browser does not support audio playback.
      </audio>
      {media.caption ? (
        <figcaption className="mt-3 text-sm text-slate-600 dark:text-slate-300">{media.caption}</figcaption>
      ) : null}
    </figure>
  );
}
