import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { fetchCreameryFilm } from "@/lib/gelato/film";
import { CanvasScene } from "@/components/gelato/canvas-scene";
import { SmoothScroll } from "@/components/gelato/smooth-scroll";
import { Site } from "@/components/gelato/page";
import { OfficerWidget } from "@/components/gelato/officer-widget";

const LOCAL_FILM = "/film/cream.mp4";

export const Route = createFileRoute("/")({
  loader: async () => {
    const film = await fetchCreameryFilm();
    return {
      filmUrl: film.url ?? LOCAL_FILM,
      credit: film.credit ?? "Pexels",
    };
  },
  component: Home,
});

function Home() {
  const { filmUrl, credit } = Route.useLoaderData();

  return (
    <>
      <SmoothScroll />
      <ClientOnly fallback={null}>
        <CanvasScene filmUrl={filmUrl} />
      </ClientOnly>
      <Site credit={credit} />
      <OfficerWidget />
    </>
  );
}
