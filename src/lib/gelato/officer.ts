import nlp from "compromise";
import Fuse from "fuse.js";
import { flavors, formatMoney, orderText, shop, whatsappHref } from "./catalog";

export type OfficerReply = {
  text: string;
  href?: string;
  label?: string;
};

const fuse = new Fuse(flavors, {
  keys: ["name", "category", "blurb"],
  threshold: 0.38,
  includeScore: true,
});

function flavorLine(list = flavors) {
  return list
    .map((flavor) => `${flavor.name} — ${formatMoney(flavor.price)}`)
    .join("\n");
}

async function wikiExtract(topic: string): Promise<string | null> {
  const title = topic.replace(/[^\p{L}\p{N}\s-]/gu, "").trim();
  if (title.length < 2) return null;
  try {
    const endpoint = new URL("https://en.wikipedia.org/w/api.php");
    endpoint.searchParams.set("action", "query");
    endpoint.searchParams.set("prop", "extracts");
    endpoint.searchParams.set("exintro", "1");
    endpoint.searchParams.set("explaintext", "1");
    endpoint.searchParams.set("format", "json");
    endpoint.searchParams.set("origin", "*");
    endpoint.searchParams.set("titles", title);
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      query?: { pages?: Record<string, { extract?: string }> };
    };
    const pages = data.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0];
    const extract = page?.extract?.trim();
    if (!extract) return null;
    const cut = extract.slice(0, 280).replace(/\s+\S*$/, "");
    return `${cut}…`;
  } catch {
    return null;
  }
}

function scoopCount(text: string) {
  const doc = nlp(text);
  const found = doc.numbers().json() as { number?: { num?: number } }[];
  const num = found[0]?.number?.num;
  if (typeof num !== "number" || !Number.isFinite(num)) return 1;
  return Math.max(1, Math.min(24, Math.round(num)));
}

export async function askOfficer(userText: string): Promise<OfficerReply> {
  const clean = userText.toLowerCase().trim();
  const doc = nlp(userText);

  if (!clean) {
    return {
      text: "Ask for the hours, the case, an ingredient, or tell me what to scoop.",
    };
  }

  if (doc.has("(open|hours|schedule|close)") || /\b(hours|opening|closing|what time)\b/.test(clean)) {
    return {
      text: `We are open ${shop.hours}. ${shop.days}. The counter is at ${shop.address}.`,
    };
  }

  const wantsOrder =
    doc.has("(order|buy|whatsapp|purchase|checkout)") ||
    /\b(order|whatsapp|takeaway|tub)\b/.test(clean);

  if (wantsOrder) {
    const match = fuse.search(clean)[0];
    if (match?.item) {
      const qty = scoopCount(userText);
      const href = whatsappHref(orderText(qty, match.item.name));
      const total = qty * match.item.price;
      return {
        text: `${qty} × ${match.item.name}. ${formatMoney(total)} before anything extra. I'll hand this to the counter on WhatsApp.`,
        href,
        label: "Complete on WhatsApp",
      };
    }
    return {
      text: "Tell me the flavor and how many scoops — or send a note and the counter will take it from there.",
      href: whatsappHref("Hello! I would like to place an ice cream order from Maison Luce."),
      label: "Chat with the counter",
    };
  }

  if (/^(what is|what's|tell me about|origin of|history of)\b/.test(clean)) {
    const topic = clean.replace(/^(what is|what's|tell me about|origin of|history of)\b/, "").trim();
    const summary = await wikiExtract(topic);
    if (summary) {
      return { text: summary };
    }
  }

  if (/\b(menu|flavou?rs?|available|gelato|sorbet|sundae|case)\b/.test(clean)) {
    return {
      text: `In the case today:\n${flavorLine()}\n\nSay “order 2 Sicilian Pistachio” and I'll write the WhatsApp note.`,
    };
  }

  const fuzzy = fuse.search(clean)[0];
  if (fuzzy?.item && (fuzzy.score ?? 1) < 0.46 && clean.length > 2) {
    const matched = fuzzy.item;
    const allergens = matched.allergens.length ? matched.allergens.join(", ") : "None";
    return {
      text: `${matched.name} is in the case. ${formatMoney(matched.price)} a scoop. Allergens: ${allergens}. ${matched.blurb}`,
      href: whatsappHref(orderText(1, matched.name)),
      label: `Order ${matched.name}`,
    };
  }

  return {
    text: "I'm the counter at Maison Luce. I can share hours, the flavors in the case, a short note on an ingredient, or start a WhatsApp order.",
  };
}
