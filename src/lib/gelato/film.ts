import { createServerFn } from "@tanstack/react-start";

export type CreameryFilm = { url: string | null; credit: string | null };

const FALLBACK_KEY = "wNw2FWSSVyJMjjzuV2s9BRkqdyKJBaK7JycHOUUuNyA78Ksftx06FVzt";

function safePexelsUrl(link: unknown) {
  if (typeof link !== "string") return null;
  try {
    const url = new URL(link);
    if (url.protocol !== "https:") return null;
    if (!url.hostname.endsWith("pexels.com")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export const fetchCreameryFilm = createServerFn({ method: "GET" }).handler(
  async (): Promise<CreameryFilm> => {
    try {
      const endpoint = new URL("https://api.pexels.com/videos/search");
      endpoint.searchParams.set("query", "artisan gelato ice cream dessert");
      endpoint.searchParams.set("per_page", "6");
      endpoint.searchParams.set("orientation", "landscape");
      const res = await fetch(endpoint, {
        headers: { Authorization: process.env.PEXELS_API_KEY || FALLBACK_KEY },
        signal: AbortSignal.timeout(2500),
      });
      if (!res.ok) return { url: null, credit: null };
      const data = (await res.json()) as {
        videos?: {
          user?: { name?: string };
          video_files?: { link?: string; width?: number; file_type?: string }[];
        }[];
      };
      const video = data.videos?.[0];
      const file = (video?.video_files ?? [])
        .filter((item) => item.file_type === "video/mp4")
        .filter((item) => (item.width ?? 0) >= 640 && (item.width ?? 0) <= 1280)
        .sort((a, b) => (a.width ?? 0) - (b.width ?? 0))[0];
      return {
        url: safePexelsUrl(file?.link),
        credit: video?.user?.name ?? null,
      };
    } catch {
      return { url: null, credit: null };
    }
  },
);
