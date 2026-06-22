export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  bestSeller?: boolean;
  category: "Classic" | "Rimless" | "Sport";
  description: { bg: string; en: string };
  details: string[];
  slug: string;
  images: string[];
}

export const products: Product[] = [
  {
    id: "noir",
    slug: "noir",
    name: "VANTA",
    price: 44.99,
    originalPrice: 59.99,
    category: "Classic",
    description: {
      bg: "Абсолютен минимализъм. Черна рамка, черни стъкла — за тези, които не се нуждаят от обяснения.",
      en: "Absolute minimalism. Black frame, black lenses — for those who need no explanation.",
    },
    details: ["Черна ацетатна рамка", "Черни поляризирани стъкла", "UV400 защита", "Включва луксозна кутия"],
    images: ["/products/noir-1.jpg", "/products/noir-2.jpg"],
  },
  {
    id: "amber",
    slug: "amber",
    name: "ORO",
    price: 44.99,
    category: "Classic",
    description: {
      bg: "Топлина в студената естетика. Черна рамка с кехлибарени стъкла — контраст, който говори сам за себе си.",
      en: "Warmth within cold aesthetics. Black frame with amber lenses — contrast that speaks for itself.",
    },
    details: ["Черна ацетатна рамка", "Кехлибарени стъкла", "UV400 защита", "Включва луксозна кутия"],
    images: ["/products/amber-1.jpg", "/products/amber-2.jpg"],
  },
  {
    id: "azure",
    slug: "azure",
    name: "EPOC",
    price: 49.99,
    originalPrice: 59.99,
    bestSeller: true,
    category: "Rimless",
    description: {
      bg: "Без граници. Безободна конструкция с златна арматура и сини стъкла — лекота с характер.",
      en: "No boundaries. Rimless construction with gold hardware and blue lenses — lightness with character.",
    },
    details: ["Безободна конструкция", "Златна метална арматура", "Сини стъкла", "UV400 защита"],
    images: ["/products/azure-1.jpg", "/products/azure-2.jpg"],
  },
  {
    id: "obsidian",
    slug: "obsidian",
    name: "NYX",
    price: 49.99,
    bestSeller: true,
    category: "Rimless",
    description: {
      bg: "Тъмнина без граници. Безободна конструкция с тъмни стъкла и златна арматура — мистерия в чист вид.",
      en: "Darkness without boundaries. Rimless construction with dark lenses and gold hardware — mystery in pure form.",
    },
    details: ["Безободна конструкция", "Златна метална арматура", "Тъмни стъкла", "UV400 защита"],
    images: ["/products/obsidian-1.jpg", "/products/obsidian-2.jpg"],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
