import { useEffect } from "react";
import { bus } from "@/lib/gelato/bus";

type LenisLike = {
  on: (event: "scroll", cb: () => void) => void;
  raf: (time: number) => void;
  destroy: () => void;
  scrollTo: (target: HTMLElement | string, opts?: { offset?: number }) => void;
};

let lenisRef: LenisLike | null = null;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef) lenisRef.scrollTo(el, { offset: -8 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const SECTIONS = ["hero", "craft", "flavors", "menu", "visit"];

export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    bus.reduced = reduced;

    const onMove = (event: PointerEvent) => {
      bus.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      bus.pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let cancelled = false;
    let cleanup = () => {};

    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bus.progress = max > 0 ? window.scrollY / max : 0;
      const mark = window.innerHeight * 0.46;
      let next = 0;
      SECTIONS.forEach((id, index) => {
        const node = document.getElementById(id);
        if (!node) return;
        const top = node.getBoundingClientRect().top;
        if (top <= mark) next = index;
      });
      bus.section = next;
    };

    if (reduced) {
      measure();
      window.addEventListener("scroll", measure, { passive: true });
      cleanup = () => window.removeEventListener("scroll", measure);
      return () => {
        cancelled = true;
        window.removeEventListener("pointermove", onMove);
        cleanup();
      };
    }

    void (async () => {
      const [{ default: Lenis }, gsapMod, stMod] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      const gsap = gsapMod.default;
      const { ScrollTrigger } = stMod;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ lerp: 0.085, smoothWheel: true }) as unknown as LenisLike;
      lenisRef = lenis;
      lenis.on("scroll", () => {
        measure();
        ScrollTrigger.update();
      });

      const ticker = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      const master = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          bus.progress = self.progress;
        },
      });

      const triggers = SECTIONS.map((id, index) =>
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top 58%",
          end: "bottom 42%",
          onToggle: (self) => {
            if (self.isActive) bus.section = index;
          },
        }),
      );

      measure();
      cleanup = () => {
        triggers.forEach((trigger) => trigger.kill());
        master.kill();
        gsap.ticker.remove(ticker);
        lenis.destroy();
        if (lenisRef === lenis) lenisRef = null;
      };
    })();

    return () => {
      cancelled = true;
      window.removeEventListener("pointermove", onMove);
      cleanup();
    };
  }, []);

  return null;
}
