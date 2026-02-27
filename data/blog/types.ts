export type PostStatus = "draft" | "published" | "scheduled";

export type PostAuthor = {
  name: string;
  avatar: string;
  role?: string;
};

export type PostSeo = {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
};

export type CoverMedia = {
  type: "image" | "gradient";
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type MediaImage = {
  kind: "image";
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export type MediaAudio = {
  kind: "audio";
  src: string;
  caption?: string;
  mimeType?: string;
};

export type MediaVideo = {
  kind: "video";
  src: string;
  poster?: string;
  caption?: string;
  width?: number;
  height?: number;
};

export type PostBlock =
  | {
      type: "heading";
      level: 2 | 3;
      text: string;
      id?: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "quote";
      text: string;
      citation?: string;
    }
  | {
      type: "list";
      style: "unordered" | "ordered";
      items: string[];
    }
  | {
      type: "callout";
      tone: "info" | "warning" | "success";
      title?: string;
      text: string;
    }
  | {
      type: "code";
      language: string;
      code: string;
    }
  | {
      type: "image";
      media: MediaImage;
    }
  | {
      type: "audio";
      media: MediaAudio;
    }
  | {
      type: "video";
      media: MediaVideo;
    }
  | {
      type: "embed";
      url: string;
      caption?: string;
    };

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: PostBlock[];
  coverMedia: CoverMedia;
  author: PostAuthor;
  publishedAt: string;
  updatedAt?: string;
  categories: string[];
  tags: string[];
  status: PostStatus;
  seo: PostSeo;
  popularity: number;
};

export type StudioPostDraft = Omit<Post, "id" | "status" | "publishedAt"> & {
  id?: string;
  status?: PostStatus;
  publishedAt?: string;
};
