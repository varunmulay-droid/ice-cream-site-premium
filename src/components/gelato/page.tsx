import { useState, useSyncExternalStore } from "react";
import { Minus, Plus } from "lucide-react";
import {
  categories,
  flavors,
  formatMoney,
  orderText,
  shop,
  sundaes,
  whatsappHref,
} from "@/lib/gelato/catalog";
import { getFlavorIndex, setFlavorIndex, subscribeFlavor } from "@/lib/gelato/bus";
import { scrollToId } from "./smooth-scroll";

const NAV = [
  { id: "craft", label: "Craft" },
  { id: "flavors", label: "Flavors" },
  { id: "menu", label: "Case" },
  { id: "visit", label: "Visit" },
];

function useFlavorIndex() {
  return useSyncExternalStore(subscribeFlavor, getFlavorIndex, () => 0);
}

export function Site({ credit }: { credit: string }) {
  const flavorIndex = useFlavorIndex();
  const flavor = flavors[flavorIndex] ?? flavors[0]!;
  const [qty, setQty] = useState(1);
  const orderHref = whatsappHref(orderText(qty, flavor.name));

  return (
    <div className="relative z-10">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-cocoa/10 bg-cream/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <a
            href="#hero"
            className="font-display text-xl text-cocoa"
            onClick={(event) => {
              event.preventDefault();
              scrollToId("hero");
            }}
          >
            Maison Luce
          </a>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Sections">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm text-cocoa/80"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToId(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={whatsappHref("Hello! I would like to place an ice cream order from Maison Luce.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-full bg-berry px-4 text-sm font-medium text-foam"
          >
            Order
          </a>
        </div>
      </header>

      <main>
        <section id="hero" className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-6 px-5 pt-24 pb-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <p className="text-xs font-medium tracking-brand text-cocoa/70 uppercase">
              Gelateria · Est. 2014 · {shop.address}
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] font-semibold text-cocoa sm:text-7xl">
              Cold cream, <span className="italic font-medium">warm light.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-cocoa/80">
              Small-batch gelato from grass-fed milk and fruit at its peak. Scooped to order, from late morning until the street goes quiet.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#flavors"
                className="inline-flex min-h-11 items-center rounded-full bg-cocoa px-5 text-sm font-medium text-cream"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToId("flavors");
                }}
              >
                See the case
              </a>
              <a
                href={orderHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center rounded-full border border-cocoa/20 px-5 text-sm font-medium text-cocoa"
              >
                WhatsApp this scoop
              </a>
            </div>
            <p className="mt-6 text-sm text-cocoa/70">
              Now pouring · <span style={{ color: flavor.accent }}>{flavor.name}</span>
            </p>
            <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-cocoa/10 pt-5">
              <div>
                <dt className="text-xs tracking-brand text-cocoa/60 uppercase">Hours</dt>
                <dd className="mt-1 font-display text-xl text-cocoa">11–11</dd>
              </div>
              <div>
                <dt className="text-xs tracking-brand text-cocoa/60 uppercase">Scoop</dt>
                <dd className="mt-1 font-display text-xl text-cocoa tabular-nums">from $4</dd>
              </div>
              <div>
                <dt className="text-xs tracking-brand text-cocoa/60 uppercase">Days</dt>
                <dd className="mt-1 font-display text-xl text-cocoa">365</dd>
              </div>
            </dl>
          </div>
          <div className="order-1 min-h-[46vh] md:order-2 md:min-h-[72vh]" aria-hidden="true" />
        </section>

        <section id="craft" className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-8 px-5 py-24 md:grid-cols-2">
          <div className="min-h-[40vh] md:min-h-[64vh]" aria-hidden="true" />
          <div>
            <p className="text-xs font-medium tracking-brand text-cocoa/70 uppercase">The kitchen</p>
            <h2 className="mt-3 font-display text-4xl leading-none text-cocoa sm:text-6xl">
              The dairy is the point.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cocoa/80">
              We churn a low-overrun base so the scoop stays dense, then fold in pastes made in the kitchen — pistachio from Bronte, cocoa from dark wafers, vanilla scraped from the pod.
            </p>
            <figure className="mt-8 overflow-hidden rounded-card">
              <img
                src="/film/case.jpg"
                alt="Trays of chocolate, pistachio, and fior di latte gelato in a chilled case"
                className="aspect-[4/3] w-full object-cover"
                width={1400}
                height={1050}
              />
              <figcaption className="bg-strawberry/50 px-4 py-3 text-sm text-cocoa">
                The case is rebuilt every morning. What is gone by close stays gone.
              </figcaption>
            </figure>
            <ul className="mt-6 grid gap-3">
              {[
                ["100% grass-fed dairy", "The milk is the flavor, not a carrier for syrup."],
                ["Organic Madagascar vanilla", "Pods split here. The specks stay in the cream."],
                ["Hand-spun daily", "No reheated tubs. Yesterday's base becomes affogato."],
              ].map(([title, copy]) => (
                <li key={title} className="glass rounded-card px-4 py-3">
                  <p className="font-medium text-cocoa">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-cocoa/75">{copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="flavors" className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-8 px-5 py-24 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <p className="text-xs font-medium tracking-brand text-cocoa/70 uppercase">Pour of the moment</p>
            <h2 className="mt-3 font-display text-4xl leading-none text-cocoa sm:text-6xl" style={{ color: flavor.accent }}>
              {flavor.name}
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-cocoa/80">{flavor.blurb}</p>
            <p className="mt-3 text-sm text-cocoa/70">
              {categories.find((item) => item.id === flavor.category)?.tagline}
              {" · "}
              Allergens: {flavor.allergens.length ? flavor.allergens.join(", ") : "None"}
            </p>
            <div className="mt-6 flex flex-wrap gap-2" role="listbox" aria-label="Flavors">
              {flavors.map((item, index) => {
                const active = index === flavorIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    className="min-h-11 rounded-full border px-4 text-sm text-cocoa"
                    style={{
                      borderColor: active ? item.accent : "transparent",
                      background: active ? item.glow : "rgba(255,245,225,0.72)",
                    }}
                    onClick={() => setFlavorIndex(index)}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <p className="font-display text-4xl text-cocoa tabular-nums">{formatMoney(flavor.price * qty)}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="grid size-11 place-items-center rounded-full border border-cocoa/20"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  aria-label="Fewer scoops"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center tabular-nums">{qty}</span>
                <button
                  type="button"
                  className="grid size-11 place-items-center rounded-full border border-cocoa/20"
                  onClick={() => setQty((value) => Math.min(12, value + 1))}
                  aria-label="More scoops"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <a
                href={orderHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center rounded-full bg-berry px-5 text-sm font-medium text-foam"
              >
                Send to WhatsApp
              </a>
            </div>
          </div>
          <div className="order-1 min-h-[42vh] md:order-2 md:min-h-[68vh]" aria-hidden="true" />
        </section>

        <section id="menu" className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-5 py-24 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium tracking-brand text-cocoa/70 uppercase">The case</p>
            <h2 className="mt-3 font-display text-4xl leading-none text-cocoa sm:text-6xl">Scooped, not scooped from a tub in the back.</h2>
            <div className="mt-8 overflow-hidden rounded-card">
              <img
                src="/film/scoop.jpg"
                alt="A pistachio scoop set onto a cone at the counter"
                className="aspect-[16/9] w-full object-cover"
                width={1400}
                height={788}
              />
            </div>
            <div className="mt-8 space-y-8">
              {categories
                .filter((category) => category.id !== "sundae")
                .map((category) => (
                  <div key={category.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-2xl text-cocoa">{category.name}</h3>
                      <p className="text-sm text-cocoa/60">{category.tagline}</p>
                    </div>
                    <ul className="mt-3 divide-y divide-cocoa/10">
                      {flavors
                        .filter((item) => item.category === category.id)
                        .map((item) => (
                          <li key={item.id}>
                            <button
                              type="button"
                              className="flex w-full items-baseline justify-between gap-4 py-3 text-left"
                              onClick={() => {
                                setFlavorIndex(flavors.findIndex((flavorItem) => flavorItem.id === item.id));
                                scrollToId("flavors");
                              }}
                            >
                              <span className="text-cocoa">{item.name}</span>
                              <span className="tabular-nums text-cocoa/80">{formatMoney(item.price)}</span>
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              <div>
                <h3 className="font-display text-2xl text-cocoa">Composed cups</h3>
                <ul className="mt-3 divide-y divide-cocoa/10">
                  {sundaes.map((item) => (
                    <li key={item.name} className="flex items-baseline justify-between gap-4 py-3">
                      <span>
                        <span className="block text-cocoa">{item.name}</span>
                        <span className="block text-sm text-cocoa/65">{item.detail}</span>
                      </span>
                      <span className="tabular-nums text-cocoa/80">{formatMoney(item.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="min-h-[36vh] md:min-h-[60vh]" aria-hidden="true" />
        </section>

        <section id="visit" className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-8 px-5 py-24 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium tracking-brand text-cocoa/70 uppercase">The walk-up</p>
            <h2 className="mt-3 font-display text-4xl leading-none text-cocoa sm:text-6xl">Come for the cone. Write ahead if you want a tub.</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-cocoa/80">{shop.note}</p>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="glass rounded-card p-4">
                <dt className="text-xs tracking-brand text-cocoa/60 uppercase">Hours</dt>
                <dd className="mt-2 text-cocoa">{shop.hours}</dd>
                <dd className="text-sm text-cocoa/70">{shop.days}</dd>
              </div>
              <div className="glass rounded-card p-4">
                <dt className="text-xs tracking-brand text-cocoa/60 uppercase">Counter</dt>
                <dd className="mt-2 text-cocoa">{shop.address}</dd>
                <dd className="text-sm text-cocoa/70">WhatsApp +{shop.whatsapp}</dd>
              </div>
            </dl>
            <a
              href={whatsappHref("Hello! I would like to place an ice cream order from Maison Luce.")}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex min-h-12 items-center rounded-full bg-berry px-6 text-base font-medium text-foam"
            >
              Order fresh on WhatsApp
            </a>
          </div>
          <div className="min-h-[40vh] md:min-h-[64vh]" aria-hidden="true" />
        </section>
      </main>

      <footer className="relative z-10 border-t border-cocoa/10 px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-cocoa/70 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg text-cocoa">Maison Luce</p>
          <p>Film by {credit} · photography via Pexels</p>
        </div>
      </footer>
    </div>
  );
}
