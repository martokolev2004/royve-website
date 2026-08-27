"use client";
import Link from "next/link";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="w-1 h-1 bg-gold/70 rounded-full flex-shrink-0 mt-2" />
      <span>{children}</span>
    </li>
  );
}

export default function PrivacyPage() {
  return (
    <div className="bg-dark-1 min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-16">
        <AnimatedSection>
          <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-4">— ROYVÉ —</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest mb-4">Политика за поверителност</h1>
          <p className="text-white/30 text-xs font-sans mb-12">Последна актуализация: август 2026 г.</p>
        </AnimatedSection>

        <div className="space-y-10 text-white/60 font-sans text-sm leading-relaxed">

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">1. Администратор на лични данни</h2>
            <p>Мартин Веселинов Колев, гр. София, ж.к. Шипченски проход 59а</p>
            <p className="mt-1">Имейл: <a href="mailto:royve.eyewear@gmail.com" className="text-gold hover:underline">royve.eyewear@gmail.com</a></p>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">2. Какви данни събираме</h2>
            <ul className="space-y-2 list-none">
              <Bullet>Три имена, имейл адрес, телефонен номер</Bullet>
              <Bullet>Адрес за доставка (улица, град, пощенски код)</Bullet>
              <Bullet>Информация за поръчката (продукти, количества, обща стойност)</Bullet>
              <Bullet>IP адрес (за защита от злоупотреби)</Bullet>
              <Bullet>Данни за бисквитки при дадено съгласие</Bullet>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">3. Цел и правно основание</h2>
            <div className="space-y-3">
              <p><strong className="text-white">Изпълнение на договор</strong> — обработване на поръчки, доставка, издаване на документи.</p>
              <p><strong className="text-white">Законово задължение</strong> — съхранение на счетоводна документация.</p>
              <p><strong className="text-white">Легитимен интерес</strong> — защита от измами и злоупотреби.</p>
              <p><strong className="text-white">Съгласие</strong> — маркетингови бисквитки и проследяване само след изрично съгласие.</p>
            </div>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">4. Получатели на данни</h2>
            <ul className="space-y-2 list-none">
              <Bullet>Stripe Inc. — обработване на плащания</Bullet>
              <Bullet>Neon Inc. — съхранение на база данни</Bullet>
              <Bullet>Vercel Inc. — хостинг на уеб приложението</Bullet>
              <Bullet>Resend Inc. — изпращане на имейли</Bullet>
              <Bullet>BoxNow — доставка до автомати</Bullet>
              <Bullet>Meta Platforms — маркетингово проследяване (само при дадено съгласие)</Bullet>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">5. Срок на съхранение</h2>
            <p className="mb-2">Данните от поръчки се съхраняват <strong className="text-white">5 години</strong> съгласно счетоводното законодателство.</p>
            <p>Данните за rate limiting (IP адреси) се изтриват автоматично след <strong className="text-white">1 час</strong>.</p>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">6. Вашите права (GDPR)</h2>
            <ul className="space-y-2 list-none">
              <Bullet>Право на достъп до вашите лични данни</Bullet>
              <Bullet>Право на коригиране на неточни данни</Bullet>
              <Bullet>Право на изтриване</Bullet>
              <Bullet>Право на ограничаване на обработването</Bullet>
              <Bullet>Право на преносимост на данните</Bullet>
              <Bullet>Право на възражение срещу обработването</Bullet>
              <Bullet>Право на оттегляне на съгласието по всяко време</Bullet>
            </ul>
            <p className="mt-4">За упражняване на правата си пишете на <a href="mailto:royve.eyewear@gmail.com" className="text-gold hover:underline">royve.eyewear@gmail.com</a>. Отговаряме в срок до 30 дни.</p>
            <p className="mt-3">Имате право на жалба до <strong className="text-white">Комисията за защита на личните данни</strong> (www.cpdp.bg), ул. Проф. Цветан Лазаров 2, София 1592.</p>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">7. Сигурност</h2>
            <p>Всички данни се предават по криптирана HTTPS връзка. Плащанията се обработват изцяло от Stripe — ROYVÉ Eyewear не съхранява данни за платежни карти.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex gap-6">
          <Link href="/terms" className="text-white/30 text-xs hover:text-gold transition-colors font-sans tracking-widest uppercase">Общи условия</Link>
          <Link href="/cookies" className="text-white/30 text-xs hover:text-gold transition-colors font-sans tracking-widest uppercase">Бисквитки</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
