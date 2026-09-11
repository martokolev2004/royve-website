"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const IBAN = "BG24UBBS80021481468410";
const BIC = "UBBSBGSF";
const BANK = "Юробанк България АД (УББ)";
const RECIPIENT = "Роен Митов";

function BankTransferContent() {
  const params = useSearchParams();
  const orderId = params.get("order") || "—";

  return (
    <div className="bg-dark-1 min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-4">— ROYVÉ —</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-widest mb-3">
            Банков превод
          </h1>
          <div className="h-px bg-gold/30 w-16 mb-6" />
          <p className="text-white/50 font-sans text-sm leading-relaxed mb-8">
            Поръчката ти е запазена. Извърши превода по данните по-долу и я изпрати в рамките на <strong className="text-white">3 работни дни</strong>.
          </p>

          {/* Bank details */}
          <div className="bg-dark-2 border border-white/10 divide-y divide-white/5 mb-6">
            {[
              { label: "Получател", value: RECIPIENT },
              { label: "IBAN", value: IBAN, mono: true },
              { label: "BIC / SWIFT", value: BIC, mono: true },
              { label: "Банка", value: BANK },
              { label: "Основание", value: `Поръчка ${orderId}`, highlight: true },
            ].map(({ label, value, mono, highlight }) => (
              <div key={label} className="flex items-start justify-between px-5 py-4 gap-4">
                <span className="text-white/30 text-xs tracking-widest uppercase font-sans flex-shrink-0">{label}</span>
                <span className={`text-right text-sm font-sans break-all ${mono ? "font-mono text-white/80" : ""} ${highlight ? "text-gold font-semibold" : "text-white/70"}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-gold/5 border border-gold/20 px-5 py-4 mb-8">
            <p className="text-gold/80 text-xs font-sans leading-relaxed">
              ⚠️ Задължително посочи <strong className="text-gold">Поръчка {orderId}</strong> като основание на превода, за да идентифицираме плащането ти.
            </p>
          </div>

          <p className="text-white/30 text-xs font-sans leading-relaxed mb-8">
            След получаване на превода ще изпратим потвърждение на имейла ти. Ако имаш въпроси: <a href="mailto:royve.eyewear@gmail.com" className="text-gold hover:underline">royve.eyewear@gmail.com</a>
          </p>

          <Link href="/shop" className="btn-luxury inline-block text-xs">
            <span>Обратно към магазина</span>
          </Link>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default function BankTransferPage() {
  return (
    <Suspense fallback={<div className="bg-dark-1 min-h-screen" />}>
      <BankTransferContent />
    </Suspense>
  );
}
