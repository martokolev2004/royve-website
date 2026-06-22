export type Lang = "bg" | "en";

export const translations = {
  nav: {
    shop: { bg: "МАГАЗИН", en: "SHOP" },
    cart: { bg: "КОЛИЧКА", en: "CART" },
    home: { bg: "НАЧАЛО", en: "HOME" },
  },
  hero: {
    slogan: { bg: "НЕ Е ЗА ВСЕКИ.", en: "NOT FOR EVERYONE." },
    cta: { bg: "РАЗГЛЕДАЙ", en: "EXPLORE" },
    scroll: { bg: "СКРОЛИРАЙ", en: "SCROLL" },
  },
  shop: {
    title: { bg: "КОЛЕКЦИЯ", en: "COLLECTION" },
    filter: { bg: "ФИЛТЪР", en: "FILTER" },
    all: { bg: "ВСИЧКИ", en: "ALL" },
    addBtn: { bg: "ДОБАВИ", en: "ADD" },
    currency: { bg: "€", en: "€" },
  },
  product: {
    addToCart: { bg: "ДОБАВИ В КОЛИЧКАТА", en: "ADD TO CART" },
    related: { bg: "СВЪРЗАНИ ПРОДУКТИ", en: "RELATED PRODUCTS" },
    back: { bg: "НАЗАД КЪМ МАГАЗИНА", en: "BACK TO SHOP" },
    details: { bg: "ДЕТАЙЛИ", en: "DETAILS" },
  },
  cart: {
    title: { bg: "КОЛИЧКА", en: "CART" },
    empty: { bg: "Количката е празна", en: "Cart is empty" },
    subtotal: { bg: "СУМА", en: "SUBTOTAL" },
    bundleDiscount: { bg: "ОТСТЪПКА 2 ЗА 80€", en: "2-FOR-€80 DISCOUNT" },
    total: { bg: "ОБЩО", en: "TOTAL" },
    checkout: { bg: "ПОРЪЧАЙ", en: "CHECKOUT" },
    continue: { bg: "ПРОДЪЛЖИ ПАЗАРУВАНЕТО", en: "CONTINUE SHOPPING" },
    remove: { bg: "ПРЕМАХНИ", en: "REMOVE" },
    quantity: { bg: "Количество", en: "Quantity" },
  },
  checkout: {
    title: { bg: "ПОРЪЧКА", en: "CHECKOUT" },
    fullName: { bg: "Име и фамилия", en: "Full name" },
    email: { bg: "Имейл", en: "Email" },
    phone: { bg: "Телефон", en: "Phone" },
    address: { bg: "Адрес за доставка", en: "Delivery address" },
    city: { bg: "Град", en: "City" },
    postalCode: { bg: "Пощенски код", en: "Postal code" },
    payment: { bg: "ПЛАЩАНЕ", en: "PAYMENT" },
    paymentSoon: { bg: "Очаква се", en: "Coming Soon" },
    confirm: { bg: "ПОТВЪРДИ ПОРЪЧКАТА", en: "CONFIRM ORDER" },
    orderSummary: { bg: "ОБОБЩЕНИЕ НА ПОРЪЧКАТА", en: "ORDER SUMMARY" },
  },
  success: {
    title: { bg: "ПОРЪЧКАТА Е ПРИЕТА", en: "ORDER CONFIRMED" },
    message: {
      bg: "Благодарим ти! Ще получиш потвърждение на имейла си.",
      en: "Thank you! You will receive a confirmation email shortly.",
    },
    continue: { bg: "ПРОДЪЛЖИ ПАЗАРУВАНЕТО", en: "CONTINUE SHOPPING" },
    orderNum: { bg: "Номер на поръчка", en: "Order number" },
  },
  brand: {
    story: {
      bg: "ROYVÉ не е просто марка. Това е изявление. Създадени за тези, които гледат отвъд очевидното — нашите очила са за малцината, които разбират.",
      en: "ROYVÉ is not just a brand. It is a statement. Crafted for those who see beyond the obvious — our eyewear is for the few who understand.",
    },
    editorial: { bg: "ЛЯТНА КОЛЕКЦИЯ", en: "SUMMER ESSENTIALS" },
    editorialSub: {
      bg: "Мрак. Стил. Присъствие.",
      en: "Dark. Stylish. Present.",
    },
  },
  promo: {
    eyebrow: { bg: "ОГРАНИЧЕНА ОФЕРТА", en: "LIMITED OFFER" },
    title: { bg: "2 ЧИФТА ЗА 80 €", en: "2 PAIRS FOR €80" },
    message: {
      bg: "Вземи AZURE и NOIR заедно и спести. Само за ограничено време.",
      en: "Get AZURE and NOIR together and save. For a limited time only.",
    },
    cta: { bg: "РАЗГЛЕДАЙ ОФЕРТАТА", en: "SHOP THE OFFER" },
    dismiss: { bg: "ПРОДЪЛЖИ БЕЗ ОФЕРТАТА", en: "CONTINUE WITHOUT OFFER" },
  },
  footer: {
    contact: { bg: "КОНТАКТ", en: "CONTACT" },
    follow: { bg: "ПОСЛЕДВАЙ НИ", en: "FOLLOW US" },
    rights: { bg: "Всички права запазени", en: "All rights reserved" },
  },
} as const;

export function t(
  key: keyof typeof translations,
  subkey: string,
  lang: Lang
): string {
  const section = translations[key] as Record<string, { bg: string; en: string }>;
  return section[subkey]?.[lang] ?? section[subkey]?.en ?? "";
}
