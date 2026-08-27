"use client";
import Link from "next/link";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

export default function TermsPage() {
  return (
    <div className="bg-dark-1 min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-16">
        <AnimatedSection>
          <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-4">— ROYVÉ —</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest mb-4">Общи условия</h1>
          <p className="text-white/30 text-xs font-sans mb-12">Последна актуализация: август 2026 г.</p>
        </AnimatedSection>

        <div className="space-y-10 text-white/60 font-sans text-sm leading-relaxed">

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">1. Информация за търговеца</h2>
            <p>Електронният магазин <strong className="text-white">royve.eu</strong> се управлява от Мартин Веселинов Колев, гр. София, ж.к. Шипченски проход 59а. За контакт: <a href="mailto:royve.eyewear@gmail.com" className="text-gold hover:underline">royve.eyewear@gmail.com</a></p>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">2. Предмет</h2>
            <p>Настоящите Общи условия уреждат отношенията между ROYVÉ Eyewear (търговец) и потребителите, закупуващи продукти чрез сайта royve.eu.</p>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">3. Поръчки</h2>
            <p className="mb-2">Поръчката се счита за приета след потвърждение по имейл от наша страна. Запазваме правото да откажем поръчка при липса на наличност или технически грешки в цената.</p>
            <p>Всички цени са в евро (EUR) и включват ДДС.</p>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">4. Плащане</h2>
            <p>Приемаме плащания с дебитна/кредитна карта и банков превод. Плащанията се обработват сигурно чрез <strong className="text-white">Stripe</strong>. ROYVÉ Eyewear не съхранява данни за платежни карти.</p>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">5. Доставка</h2>
            <p className="mb-2">Доставката се извършва чрез куриерска фирма или до BoxNow автомат в рамките на <strong className="text-white">2–5 работни дни</strong> след потвърждение на плащането.</p>
            <p>При банков превод срокът тече от датата на получаване на сумата по сметка.</p>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">6. Право на отказ</h2>
            <p className="mb-2">Съгласно Закона за защита на потребителите, имате право да се откажете от покупката без посочване на причина в срок от <strong className="text-white">14 дни</strong> от получаване на стоката.</p>
            <p className="mb-2">За да упражните правото на отказ, изпратете ни имейл на <a href="mailto:royve.eyewear@gmail.com" className="text-gold hover:underline">royve.eyewear@gmail.com</a> с номера на поръчката. Стоката трябва да бъде върната в оригинална опаковка и в ненарушен търговски вид.</p>
            <p>Разходите по връщането са за сметка на потребителя. Възстановяването на сумата се извършва до 14 дни след получаване на върнатата стока.</p>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">7. Гаранция и рекламации</h2>
            <p className="mb-2">Всички продукти имат законова гаранция от <strong className="text-white">2 години</strong> съгласно Закона за защита на потребителите.</p>
            <p>Рекламации се подават на <a href="mailto:royve.eyewear@gmail.com" className="text-gold hover:underline">royve.eyewear@gmail.com</a>. Рекламацията се разглежда в срок до 30 дни.</p>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">8. Алтернативно решаване на спорове</h2>
            <p>При неуредени спорове потребителят може да се обърне към Комисията за защита на потребителите (www.kzp.bg) или към платформата за онлайн решаване на спорове на ЕС: <span className="text-gold">ec.europa.eu/consumers/odr</span></p>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">9. Приложимо право</h2>
            <p>Настоящите Общи условия се уреждат от законодателството на Република България.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex gap-6">
          <Link href="/privacy" className="text-white/30 text-xs hover:text-gold transition-colors font-sans tracking-widest uppercase">Политика за поверителност</Link>
          <Link href="/cookies" className="text-white/30 text-xs hover:text-gold transition-colors font-sans tracking-widest uppercase">Бисквитки</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
