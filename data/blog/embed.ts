export type EmbedProvider =
  | "youtube"
  | "vimeo"
  | "spotify"
  | "soundcloud"
  | "x"
  | "instagram";

export type EmbedResult =
  | {
      type: "iframe";
      provider: EmbedProvider;
      src: string;
      title: string;
      allow?: string;
      allowFullScreen?: boolean;
      aspectRatioClass: string;
      fallbackUrl: string;
    }
  | {
      type: "fallback";
      provider: EmbedProvider | "unknown";
      url: string;
      reason: string;
    };

const YOUTUBE_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "youtu.be",
  "m.youtube.com",
]);

const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);
const SPOTIFY_HOSTS = new Set(["open.spotify.com", "spotify.com", "www.spotify.com"]);
const SOUNDCLOUD_HOSTS = new Set(["soundcloud.com", "www.soundcloud.com"]);
const X_HOSTS = new Set(["x.com", "www.x.com", "twitter.com", "www.twitter.com"]);
const INSTAGRAM_HOSTS = new Set(["instagram.com", "www.instagram.com"]);

export function sanitizeExternalUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function getYouTubeEmbed(url: URL): EmbedResult | null {
  if (!YOUTUBE_HOSTS.has(url.hostname)) return null;

  let id = "";

  if (url.hostname === "youtu.be") {
    id = url.pathname.slice(1);
  } else if (url.pathname.startsWith("/embed/")) {
    id = url.pathname.split("/")[2] ?? "";
  } else {
    id = url.searchParams.get("v") ?? "";
  }

  id = id.trim();
  if (!id) return null;

  return {
    type: "iframe",
    provider: "youtube",
    src: `https://www.youtube.com/embed/${encodeURIComponent(id)}`,
    title: "YouTube video",
    allow:
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
    allowFullScreen: true,
    aspectRatioClass: "aspect-video",
    fallbackUrl: url.toString(),
  };
}

function getVimeoEmbed(url: URL): EmbedResult | null {
  if (!VIMEO_HOSTS.has(url.hostname)) return null;

  const idMatch = url.pathname.match(/\/(?:video\/)?(\d+)/);
  const id = idMatch?.[1];
  if (!id) return null;

  return {
    type: "iframe",
    provider: "vimeo",
    src: `https://player.vimeo.com/video/${encodeURIComponent(id)}`,
    title: "Vimeo video",
    allow: "autoplay; fullscreen; picture-in-picture",
    allowFullScreen: true,
    aspectRatioClass: "aspect-video",
    fallbackUrl: url.toString(),
  };
}

function getSpotifyEmbed(url: URL): EmbedResult | null {
  if (!SPOTIFY_HOSTS.has(url.hostname)) return null;

  const [resource, id] = url.pathname.split("/").filter(Boolean);
  const allowed = new Set(["track", "album", "playlist", "episode", "show"]);
  if (!resource || !id || !allowed.has(resource)) return null;

  return {
    type: "iframe",
    provider: "spotify",
    src: `https://open.spotify.com/embed/${resource}/${encodeURIComponent(id)}`,
    title: "Spotify embed",
    allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
    aspectRatioClass: "aspect-[16/5]",
    fallbackUrl: url.toString(),
  };
}

function getSoundCloudEmbed(url: URL): EmbedResult | null {
  if (!SOUNDCLOUD_HOSTS.has(url.hostname)) return null;

  return {
    type: "iframe",
    provider: "soundcloud",
    src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url.toString())}`,
    title: "SoundCloud embed",
    allow: "autoplay",
    aspectRatioClass: "aspect-[16/5]",
    fallbackUrl: url.toString(),
  };
}

function getSocialFallback(url: URL): EmbedResult | null {
  if (X_HOSTS.has(url.hostname)) {
    return {
      type: "fallback",
      provider: "x",
      url: url.toString(),
      reason: "X embeds require platform scripts, disabled for security.",
    };
  }

  if (INSTAGRAM_HOSTS.has(url.hostname)) {
    return {
      type: "fallback",
      provider: "instagram",
      url: url.toString(),
      reason: "Instagram embeds require platform scripts, disabled for security.",
    };
  }

  return null;
}

export function resolveEmbed(rawUrl: string): EmbedResult {
  const sanitized = sanitizeExternalUrl(rawUrl);
  if (!sanitized) {
    return {
      type: "fallback",
      provider: "unknown",
      url: "",
      reason: "Only valid HTTPS URLs are supported.",
    };
  }

  const parsed = new URL(sanitized);

  return (
    getYouTubeEmbed(parsed) ??
    getVimeoEmbed(parsed) ??
    getSpotifyEmbed(parsed) ??
    getSoundCloudEmbed(parsed) ??
    getSocialFallback(parsed) ?? {
      type: "fallback",
      provider: "unknown",
      url: sanitized,
      reason: "Provider not allowed. Use YouTube, Vimeo, Spotify, or SoundCloud.",
    }
  );
}
