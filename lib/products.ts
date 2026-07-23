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
  {
    id: "krypt",
    slug: "krypt",
    name: "KRYPT",
    price: 39.99,
    originalPrice: 49.99,
    category: "Classic",
    description: {
      bg: "Остра форма. Тъмна идентичност. Черна котешка рамка за тези, които не се нуждаят от одобрение.",
      en: "Sharp form. Dark identity. Black cat-eye frame for those who need no approval.",
    },
    details: ["Черна ацетатна рамка", "Котешка форма", "Тъмни поляризирани стъкла", "UV400 защита", "Включва луксозна кутия"],
    images: ["/products/krypt-1.jpg", "/products/krypt-2.jpg"],
  },
  {
    id: "sahra",
    slug: "sahra",
    name: "SAHRA",
    price: 49.99,
    originalPrice: 59.99,
    category: "Rimless",
    description: {
      bg: "Топлина без граници. Златна безободна рамка с кехлибарен градиент — лукс в чист вид.",
      en: "Warmth without limits. Gold rimless frame with amber gradient lenses — luxury in pure form.",
    },
    details: ["Безободна конструкция", "Златна метална арматура", "Кехлибарени градиентни стъкла", "UV400 защита", "Включва луксозна кутия"],
    images: ["/products/sahra-1.jpg", "/products/sahra-2.jpg"],
  },
  {
    id: "monarch",
    slug: "monarch",
    name: "MONARCH",
    price: 49.99,
    originalPrice: 59.99,
    category: "Classic",
    description: {
      bg: "Широко присъствие. Масивна черна ацетатна рамка — за тези, които заемат пространството, което им принадлежи.",
      en: "Wide presence. Thick black acetate frame — for those who claim the space that belongs to them.",
    },
    details: ["Широка черна ацетатна рамка", "Тъмни поляризирани стъкла", "UV400 защита", "Включва луксозна кутия"],
    images: ["/products/monarch-1.jpg", "/products/monarch-2.jpg"],
  },
  {
    id: "azure2",
    slug: "azure2",
    name: "AZURE",
    price: 44.99,
    originalPrice: 54.99,
    category: "Rimless",
    description: {
      bg: "Синева без граници. Тънка метална безободна рамка с сини стъкла — лекота с характер.",
      en: "Blue without boundaries. Thin metal rimless frame with blue lenses — lightness with character.",
    },
    details: ["Безободна конструкция", "Тънка метална арматура", "Сини стъкла", "UV400 защита", "Включва луксозна кутия"],
    images: ["/products/azure2-1.jpg", "/products/azure2-2.jpg"],
  },
  {
    id: "velor",
    slug: "velor",
    name: "VELOR",
    price: 44.99,
    originalPrice: 54.99,
    category: "Rimless",
    description: {
      bg: "Тъмна прецизност. Черна тънка метална безободна рамка — минимализъм с максимален ефект.",
      en: "Dark precision. Black thin metal rimless frame — minimalism with maximum impact.",
    },
    details: ["Безободна конструкция", "Тънка черна метална арматура", "Тъмни стъкла", "UV400 защита", "Включва луксозна кутия"],
    images: ["/products/velor-1.jpg", "/products/velor-2.jpg"],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
