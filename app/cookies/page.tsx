"use client";
import Link from "next/link";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

export default function CookiesPage() {
  return (
    <div className="bg-dark-1 min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-16">
        <AnimatedSection>
          <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-4">— ROYVÉ —</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-widest mb-4">Политика за бисквитки</h1>
          <p className="text-white/30 text-xs font-sans mb-12">Последна актуализация: август 2026 г.</p>
        </AnimatedSection>

        <div className="space-y-10 text-white/60 font-sans text-sm leading-relaxed">

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">Какво са бисквитките?</h2>
            <p>Бисквитките (cookies) са малки текстови файлове, съхранявани в браузъра ви при посещение на сайта. Те помагат за правилното функциониране на сайта и (при дадено съгласие) за маркетингови цели.</p>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-4">Видове бисквитки, които използваме</h2>
            <div className="space-y-4">

              <div className="border border-white/10 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] tracking-widest uppercase font-sans bg-white/10 text-white/60 px-2 py-1">Необходими</span>
                  <span className="text-[10px] text-white/30 font-sans">Винаги активни</span>
                </div>
                <p className="text-xs">Необходими за функционирането на сайта — пазят съдържанието на количката и предпочитанията ви за бисквитки. Не могат да бъдат изключени.</p>
                <p className="text-xs mt-2 text-white/30">Ключ: <code className="text-gold/70">royve_cookie_consent</code></p>
              </div>

              <div className="border border-white/10 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] tracking-widest uppercase font-sans bg-gold/10 text-gold px-2 py-1">Маркетингови</span>
                  <span className="text-[10px] text-white/30 font-sans">Само при съгласие</span>
                </div>
                <p className="text-xs mb-3">Използват се за проследяване на рекламната ефективност и персонализиране на реклами.</p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/30 pb-2 font-sans font-normal">Инструмент</th>
                      <th className="text-left text-white/30 pb-2 font-sans font-normal">Цел</th>
                      <th className="text-left text-white/30 pb-2 font-sans font-normal">Доставчик</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b border-white/5">
                      <td className="py-2 text-white/50">Meta Pixel</td>
                      <td className="py-2">Реклами в Facebook/Instagram</td>
                      <td className="py-2 text-white/30">Meta Platforms</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white/50">Vercel Analytics</td>
                      <td className="py-2">Анонимна статистика за посещенията</td>
                      <td className="py-2 text-white/30">Vercel Inc.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">Управление на бисквитките</h2>
            <p className="mb-3">При първо посещение на сайта се показва банер, в който можете да изберете:</p>
            <ul className="space-y-2 list-none mb-4">
              <li className="flex items-start gap-3"><span className="w-1 h-1 bg-gold/70 rounded-full flex-shrink-0 mt-2" /><strong className="text-white">Само необходими</strong> — маркетинговите бисквитки не се активират</li>
              <li className="flex items-start gap-3"><span className="w-1 h-1 bg-gold/70 rounded-full flex-shrink-0 mt-2" /><strong className="text-white">Приемам всички</strong> — активират се всички бисквитки</li>
            </ul>
            <p>Можете да промените избора си по всяко време, като изчистите данните на сайта в настройките на браузъра си, след което при следващо посещение банерът ще се покаже отново.</p>
          </section>

          <section>
            <h2 className="text-white text-base font-serif tracking-widest mb-3">Контакт</h2>
            <p>За въпроси относно бисквитките: <a href="mailto:royve.eyewear@gmail.com" className="text-gold hover:underline">royve.eyewear@gmail.com</a></p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex gap-6">
          <Link href="/terms" className="text-white/30 text-xs hover:text-gold transition-colors font-sans tracking-widest uppercase">Общи условия</Link>
          <Link href="/privacy" className="text-white/30 text-xs hover:text-gold transition-colors font-sans tracking-widest uppercase">Поверителност</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
