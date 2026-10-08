export type CategoryId = "gelato" | "sorbet" | "sundae";

export type Flavor = {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  allergens: string[];
  inStock: boolean;
  blurb: string;
  accent: string;
  glow: string;
};

export const shop = {
  name: "Maison Luce",
  hours: "Monday – Sunday: 11:00 AM – 11:00 PM",
  days: "Open 365 days a year",
  whatsapp: "1234567890",
  address: "214 Mercer Walk",
  note: "Counter orders leave on WhatsApp. We pack tubs and hold cones.",
};

export const flavors: Flavor[] = [
  {
    id: "f_pistachio",
    name: "Sicilian Pistachio",
    category: "gelato",
    price: 4.5,
    allergens: ["Nuts", "Dairy"],
    inStock: true,
    blurb: "Bronte paste folded into a dense milk base. Savory, green, and a little floral.",
    accent: "#3f6b52",
    glow: "#A8E6CF",
  },
  {
    id: "f_berry",
    name: "Electric Wild Berry",
    category: "sorbet",
    price: 4,
    allergens: [],
    inStock: true,
    blurb: "A dairy-free crush of blackberry, raspberry, and a snap of citrus.",
    accent: "#FF3366",
    glow: "#FF6B8B",
  },
  {
    id: "f_chocolate",
    name: "Dark Cocoa Fudge",
    category: "gelato",
    price: 4.5,
    allergens: ["Dairy"],
    inStock: true,
    blurb: "Bittersweet cocoa, low and slow, with a gloss of warm fudge at the edges.",
    accent: "#5C3A21",
    glow: "#E5A93C",
  },
  {
    id: "f_vanilla",
    name: "Madagascar Vanilla Bean",
    category: "gelato",
    price: 4,
    allergens: ["Dairy"],
    inStock: true,
    blurb: "Pods split in the kitchen. Specks left in the cream on purpose.",
    accent: "#8A6232",
    glow: "#D4A373",
  },
  {
    id: "f_strawberry",
    name: "Wild Strawberry",
    category: "sorbet",
    price: 4.25,
    allergens: [],
    inStock: true,
    blurb: "Peak berries, a little sugar, nothing else. The color is the ingredient.",
    accent: "#FF6B8B",
    glow: "#FFB7B2",
  },
  {
    id: "f_mango",
    name: "Mango Passionfruit",
    category: "sorbet",
    price: 4.25,
    allergens: [],
    inStock: true,
    blurb: "Ripe mango cut with passionfruit so the finish stays bright.",
    accent: "#C47B12",
    glow: "#FFB347",
  },
  {
    id: "f_matcha",
    name: "Pistachio Matcha",
    category: "gelato",
    price: 4.75,
    allergens: ["Nuts", "Dairy"],
    inStock: true,
    blurb: "Ceremonial matcha and pistachio paste. Grassy, sweet, and cold.",
    accent: "#3E6B45",
    glow: "#C7E9B0",
  },
];

export const sundaes: { name: string; detail: string; price: number }[] = [
  {
    name: "Luce Sundae",
    detail: "Two scoops, warm cocoa, salted crumble",
    price: 9.5,
  },
  {
    name: "Affogato Cup",
    detail: "Vanilla bean under a short espresso",
    price: 6.5,
  },
  {
    name: "Mercer Walk",
    detail: "Pistachio, strawberry, soft cream",
    price: 10,
  },
];

export const categories: { id: CategoryId; name: string; tagline: string }[] = [
  { id: "gelato", name: "Artisan gelato", tagline: "Dense, smooth, low-overrun milk base" },
  { id: "sorbet", name: "Vegan sorbets", tagline: "Dairy-free, pressed fruit" },
  { id: "sundae", name: "Composed cups", tagline: "Scoops, syrup, and something warm" },
];

export function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export function whatsappHref(text: string) {
  return `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function orderText(qty: number, name: string) {
  const scoops = qty === 1 ? "1 scoop" : `${qty} scoops`;
  return `Hello! I would like to order ${scoops} of ${name} from Maison Luce.`;
}
