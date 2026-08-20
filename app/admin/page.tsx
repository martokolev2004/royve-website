"use client";
import { useState, useCallback } from "react";
import { products } from "@/lib/products";

interface OrderItem { name: string; price: number; quantity: number }
interface Order {
  id: string;
  timestamp: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  postalCode: string;
  items: OrderItem[];
  total: number;
  paymentStatus: string;
  boxnowLocationId?: string;
  boxnowReference?: string;
}

interface PromoCode { code: string; discount: number; active: boolean }

const PASSWORD = "Roy29Rodi";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [tab, setTab] = useState<"orders" | "inventory" | "promos">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editQty, setEditQty] = useState<Record<string, number>>({});
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoDiscount, setNewPromoDiscount] = useState(10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const headers = { "x-admin-password": PASSWORD };
    const [ordersRes, invRes, promosRes] = await Promise.all([
      fetch("/api/admin/orders", { headers }),
      fetch("/api/admin/inventory", { headers }),
      fetch("/api/admin/promo-codes", { headers }),
    ]);
    if (ordersRes.ok) setOrders(await ordersRes.json());
    if (invRes.ok) {
      const inv = await invRes.json();
      setInventory(inv);
      setEditQty(inv);
    }
    if (promosRes.ok) setPromos(await promosRes.json());
    setLoading(false);
  }, []);

  async function saveInventory(productId: string) {
    const qty = editQty[productId];
    await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": PASSWORD },
      body: JSON.stringify({ productId, quantity: qty }),
    });
    setInventory((prev) => ({ ...prev, [productId]: qty }));
  }

  async function addPromo() {
    if (!newPromoCode.trim()) return;
    await fetch("/api/admin/promo-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": PASSWORD },
      body: JSON.stringify({ code: newPromoCode.trim(), discount: newPromoDiscount, active: true }),
    });
    setNewPromoCode("");
    setNewPromoDiscount(10);
    const res = await fetch("/api/admin/promo-codes", { headers: { "x-admin-password": PASSWORD } });
    if (res.ok) setPromos(await res.json());
  }

  async function togglePromo(code: string, active: boolean, discount: number) {
    await fetch("/api/admin/promo-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": PASSWORD },
      body: JSON.stringify({ code, discount, active }),
    });
    setPromos((prev) => prev.map((p) => p.code === code ? { ...p, active } : p));
  }

  async function deletePromo(code: string) {
    await fetch("/api/admin/promo-codes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-password": PASSWORD },
      body: JSON.stringify({ code }),
    });
    setPromos((prev) => prev.filter((p) => p.code !== code));
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="bg-[#111] border border-white/10 p-8 w-80">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-6 text-center">— ROYVÉ ADMIN —</p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && pw === PASSWORD && (setAuthed(true), fetchData())}
            placeholder="Парола"
            className="w-full bg-transparent border border-white/20 text-white text-sm font-sans px-4 py-3 mb-4 outline-none focus:border-gold/50"
          />
          <button
            onClick={() => { if (pw === PASSWORD) { setAuthed(true); fetchData(); } }}
            className="w-full border border-gold text-gold text-xs tracking-widest uppercase font-sans py-3 hover:bg-gold hover:text-black transition-colors"
          >
            Влез
          </button>
        </div>
      </div>
    );
  }

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const visibleOrders = orders.filter(
    (o) => o.paymentStatus === "paid" || new Date(o.timestamp).getTime() >= sevenDaysAgo
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-1">— ROYVÉ —</p>
            <h1 className="font-serif text-3xl font-bold tracking-widest">Admin Panel</h1>
          </div>
          <button onClick={fetchData} className="text-white/30 hover:text-gold text-xs tracking-widest uppercase font-sans transition-colors">
            ↻ Обнови
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#111] border border-white/5 p-4">
            <p className="text-white/30 text-[10px] tracking-widest uppercase font-sans mb-1">Платени поръчки</p>
            <p className="font-serif text-2xl text-gold">{paidOrders.length}</p>
          </div>
          <div className="bg-[#111] border border-white/5 p-4">
            <p className="text-white/30 text-[10px] tracking-widest uppercase font-sans mb-1">Общо приходи</p>
            <p className="font-serif text-2xl text-gold">{paidOrders.reduce((s, o) => s + o.total, 0).toFixed(2)} €</p>
          </div>
          <div className="bg-[#111] border border-white/5 p-4">
            <p className="text-white/30 text-[10px] tracking-widest uppercase font-sans mb-1">Всички поръчки</p>
            <p className="font-serif text-2xl text-white/50">{orders.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-6 border-b border-white/10">
          {(["orders", "inventory", "promos"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-xs tracking-widest uppercase font-sans transition-colors border-b-2 -mb-px ${
                tab === t ? "border-gold text-gold" : "border-transparent text-white/30 hover:text-white/60"
              }`}
            >
              {t === "orders" ? "Поръчки" : t === "inventory" ? "Наличност" : "Промокодове"}
            </button>
          ))}
        </div>

        {loading && <p className="text-white/30 text-xs font-sans tracking-widest">Зарежда...</p>}

        {/* Orders */}
        {tab === "orders" && !loading && (
          <div className="space-y-2">
            {visibleOrders.length === 0 && <p className="text-white/20 text-xs font-sans">Няма поръчки.</p>}
            {visibleOrders.map((order) => (
              <div key={order.id} className="border border-white/10 hover:border-white/20 transition-colors">
                <button
                  type="button"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 font-sans tracking-widest uppercase flex-shrink-0 ${
                      order.paymentStatus === "paid" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/5 text-white/30 border border-white/10"
                    }`}>
                      {order.paymentStatus === "paid" ? "Платена" : "Чакаща"}
                    </span>
                    <span className="text-white text-xs font-sans truncate">{order.customerName}</span>
                    <span className="text-white/30 text-xs font-sans truncate hidden md:block">{order.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-gold font-serif text-sm">{order.total} €</span>
                    <span className="text-white/20 text-xs font-sans">{new Date(order.timestamp).toLocaleDateString("bg-BG")}</span>
                    <span className="text-white/30 text-xs">{expandedOrder === order.id ? "▲" : "▼"}</span>
                  </div>
                </button>

                {expandedOrder === order.id && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/30 text-[10px] tracking-widest uppercase font-sans mb-3">Клиент</p>
                      <p className="text-white text-xs font-sans mb-1">{order.customerName}</p>
                      <p className="text-white/50 text-xs font-sans mb-1">{order.customerEmail}</p>
                      <p className="text-white/50 text-xs font-sans mb-1">{order.customerPhone}</p>
                      {order.boxnowLocationId ? (
                        <p className="text-[#00c853] text-xs font-sans mt-2">📦 BOX NOW — Автомат #{order.boxnowLocationId}</p>
                      ) : (
                        <p className="text-white/50 text-xs font-sans mt-2">🚚 {order.deliveryAddress}, {order.city} {order.postalCode}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-white/30 text-[10px] tracking-widest uppercase font-sans mb-3">Продукти</p>
                      <div className="space-y-1">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-xs font-sans">
                            <span className="text-white/70">{item.name} × {item.quantity}</span>
                            <span className="text-gold">{(item.price * item.quantity).toFixed(2)} €</span>
                          </div>
                        ))}
                        <div className="border-t border-white/10 mt-2 pt-2 flex justify-between text-xs font-sans">
                          <span className="text-white/30 uppercase tracking-widest">Общо</span>
                          <span className="text-gold font-semibold">{order.total} €</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Inventory */}
        {tab === "inventory" && !loading && (
          <div className="space-y-2">
            {products.map((product) => {
              const qty = inventory[product.id] ?? 10;
              const editVal = editQty[product.id] ?? qty;
              const changed = editVal !== qty;
              return (
                <div key={product.id} className="border border-white/10 px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="font-serif text-white text-sm tracking-widest w-24 flex-shrink-0">{product.name}</span>
                    {qty === 0 && (
                      <span className="text-[10px] px-2 py-0.5 font-sans tracking-widest uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                        Sold Out
                      </span>
                    )}
                    {qty > 0 && qty <= 3 && (
                      <span className="text-[10px] px-2 py-0.5 font-sans tracking-widest uppercase bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        Малко
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditQty((p) => ({ ...p, [product.id]: Math.max(0, (p[product.id] ?? qty) - 1) }))}
                      className="w-8 h-8 border border-white/20 text-white/60 hover:text-gold hover:border-gold/40 text-lg font-serif transition-colors flex items-center justify-center"
                    >−</button>
                    <input
                      type="number"
                      min={0}
                      value={editVal}
                      onChange={(e) => setEditQty((p) => ({ ...p, [product.id]: Math.max(0, Number(e.target.value)) }))}
                      className="w-14 text-center bg-transparent border border-white/20 text-white text-sm font-sans py-1 outline-none focus:border-gold/50"
                    />
                    <button
                      onClick={() => setEditQty((p) => ({ ...p, [product.id]: (p[product.id] ?? qty) + 1 }))}
                      className="w-8 h-8 border border-white/20 text-white/60 hover:text-gold hover:border-gold/40 text-lg font-serif transition-colors flex items-center justify-center"
                    >+</button>
                    <button
                      onClick={() => saveInventory(product.id)}
                      disabled={!changed}
                      className={`px-4 py-1.5 text-[10px] tracking-widest uppercase font-sans transition-colors ${
                        changed
                          ? "border border-gold text-gold hover:bg-gold hover:text-black cursor-pointer"
                          : "border border-white/10 text-white/20 cursor-default"
                      }`}
                    >
                      Запази
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Promo Codes */}
        {tab === "promos" && !loading && (
          <div className="space-y-4">
            {/* Add new */}
            <div className="border border-white/10 px-5 py-4">
              <p className="text-white/30 text-[10px] tracking-widest uppercase font-sans mb-3">Нов промокод</p>
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="text"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value)}
                  placeholder="Код"
                  className="bg-transparent border border-white/20 text-white text-sm font-sans px-3 py-2 outline-none focus:border-gold/50 w-44"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newPromoDiscount}
                    onChange={(e) => setNewPromoDiscount(Math.max(1, Math.min(100, Number(e.target.value))))}
                    className="bg-transparent border border-white/20 text-white text-sm font-sans px-3 py-2 outline-none focus:border-gold/50 w-20 text-center"
                  />
                  <span className="text-white/40 text-xs font-sans">%</span>
                </div>
                <button
                  onClick={addPromo}
                  disabled={!newPromoCode.trim()}
                  className="px-5 py-2 border border-gold text-gold text-xs tracking-widest uppercase font-sans hover:bg-gold hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Добави
                </button>
              </div>
            </div>

            {/* List */}
            {promos.length === 0 && <p className="text-white/20 text-xs font-sans">Няма промокодове.</p>}
            {promos.map((promo) => (
              <div key={promo.code} className="border border-white/10 px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-mono text-white text-sm tracking-widest">{promo.code}</span>
                  <span className="text-gold font-serif text-sm">{promo.discount}%</span>
                  <span className={`text-[10px] px-2 py-0.5 font-sans tracking-widest uppercase border ${
                    promo.active
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-white/5 text-white/30 border-white/10"
                  }`}>
                    {promo.active ? "Активен" : "Неактивен"}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => togglePromo(promo.code, !promo.active, promo.discount)}
                    className="px-4 py-1.5 text-[10px] tracking-widest uppercase font-sans border border-white/20 text-white/40 hover:text-gold hover:border-gold/40 transition-colors"
                  >
                    {promo.active ? "Деактивирай" : "Активирай"}
                  </button>
                  <button
                    onClick={() => deletePromo(promo.code)}
                    className="px-4 py-1.5 text-[10px] tracking-widest uppercase font-sans border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-colors"
                  >
                    Изтрий
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
