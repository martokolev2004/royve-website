export interface Product {
  id: string;
  name: string;
  price: number;
  category: "Classic" | "Rimless" | "Sport";
  description: { bg: string; en: string };
  details: string[];
  slug: string;
}

export const products: Product[] = [
  {
    id: "noir",
    slug: "noir",
    name: "NOIR",
    price: 129,
    category: "Classic",
    description: {
      bg: "Абсолютен минимализъм. Черна рамка, черни стъкла — за тези, които не се нуждаят от обяснения.",
      en: "Absolute minimalism. Black frame, black lenses — for those who need no explanation.",
    },
    details: ["Черна ацетатна рамка", "Черни поляризирани стъкла", "UV400 защита", "Включва луксозна кутия"],
  },
  {
    id: "amber",
    slug: "amber",
    name: "AMBER",
    price: 139,
    category: "Classic",
    description: {
      bg: "Топлина в студената естетика. Черна рамка с кехлибарени стъкла — контраст, който говори сам за себе си.",
      en: "Warmth within cold aesthetics. Black frame with amber lenses — contrast that speaks for itself.",
    },
    details: ["Черна ацетатна рамка", "Кехлибарени стъкла", "UV400 защита", "Включва луксозна кутия"],
  },
  {
    id: "azure",
    slug: "azure",
    name: "AZURE",
    price: 159,
    category: "Rimless",
    description: {
      bg: "Без граници. Безободна конструкция с златна арматура и сини стъкла — лекота с характер.",
      en: "No boundaries. Rimless construction with gold hardware and blue lenses — lightness with character.",
    },
    details: ["Безободна конструкция", "Златна метална арматура", "Сини стъкла", "UV400 защита"],
  },
  {
    id: "obsidian",
    slug: "obsidian",
    name: "OBSIDIAN",
    price: 119,
    category: "Classic",
    description: {
      bg: "Лава, застинала в стил. Черна рамка с тъмни стъкла — присъствие без думи.",
      en: "Lava frozen in style. Black frame with dark lenses — presence without words.",
    },
    details: ["Черна ацетатна рамка", "Тъмни стъкла", "Леко тегло", "UV400 защита"],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
