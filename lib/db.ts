import { Pool } from "pg";

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
    });
  }
  return pool;
}

const INITIAL_STOCK: Record<string, number> = {
  noir: 10, amber: 10, epoc: 10, obsidian: 10, krypt: 0,
  sahra: 10, monarch: 10, azure: 10, velor: 10, octave: 10,
};

async function ensureSchema(): Promise<void> {
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS inventory (
      product_id TEXT PRIMARY KEY,
      quantity INT NOT NULL DEFAULT 10
    )
  `);
  for (const [id, qty] of Object.entries(INITIAL_STOCK)) {
    await db.query(
      `INSERT INTO inventory (product_id, quantity) VALUES ($1, $2) ON CONFLICT (product_id) DO NOTHING`,
      [id, qty]
    );
  }
  await db.query(`
    CREATE TABLE IF NOT EXISTS promo_codes (
      code TEXT PRIMARY KEY,
      discount INT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT true
    )
  `);
  await db.query(`
    INSERT INTO promo_codes (code, discount, active) VALUES ('MartinKolev04', 50, true)
    ON CONFLICT (code) DO NOTHING
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS rate_limits (
      key TEXT NOT NULL,
      window_start TIMESTAMPTZ NOT NULL,
      count INT NOT NULL DEFAULT 1,
      PRIMARY KEY (key, window_start)
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      timestamp TIMESTAMPTZ NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      city TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      items JSONB NOT NULL,
      total NUMERIC NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      stripe_session_id TEXT,
      boxnow_location_id TEXT,
      boxnow_reference TEXT
    )
  `);
  // Migrate: add columns that may be missing in existing tables
  await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS boxnow_location_id TEXT`);
  await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS boxnow_reference TEXT`);
  await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT`);
}

export interface OrderData {
  id: string;
  timestamp: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  postalCode: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  total: number;
  paymentStatus?: string;
  stripeSessionId?: string;
  boxnowLocationId?: string;
  boxnowReference?: string;
}

export async function saveOrder(order: OrderData): Promise<void> {
  await ensureSchema();
  const db = getPool();
  await db.query(
    `INSERT INTO orders (id, timestamp, customer_name, customer_email, customer_phone, delivery_address, city, postal_code, items, total, payment_status, stripe_session_id, boxnow_location_id, boxnow_reference)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [
      order.id,
      order.timestamp,
      order.customerName,
      order.customerEmail,
      order.customerPhone,
      order.deliveryAddress,
      order.city,
      order.postalCode,
      JSON.stringify(order.items),
      order.total,
      order.paymentStatus || "pending",
      order.stripeSessionId || null,
      order.boxnowLocationId || null,
      order.boxnowReference || null,
    ]
  );
}

export async function markOrderPaidById(orderId: string): Promise<void> {
  await ensureSchema();
  const db = getPool();
  await db.query(`UPDATE orders SET payment_status = 'paid' WHERE id = $1`, [orderId]);
}

export async function markOrderPaid(stripeSessionId: string): Promise<void> {
  await ensureSchema();
  const db = getPool();
  await db.query(
    `UPDATE orders SET payment_status = 'paid' WHERE stripe_session_id = $1`,
    [stripeSessionId]
  );
}

export async function getOrderBySessionId(stripeSessionId: string): Promise<OrderData | null> {
  await ensureSchema();
  const db = getPool();
  const res = await db.query(`SELECT * FROM orders WHERE stripe_session_id = $1`, [stripeSessionId]);
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
    id: row.id,
    timestamp: row.timestamp,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    deliveryAddress: row.delivery_address,
    city: row.city,
    postalCode: row.postal_code,
    items: row.items,
    total: Number(row.total),
    paymentStatus: row.payment_status,
    stripeSessionId: row.stripe_session_id,
    boxnowLocationId: row.boxnow_location_id,
    boxnowReference: row.boxnow_reference,
  };
}

export async function getOrderById(orderId: string): Promise<OrderData | null> {
  await ensureSchema();
  const db = getPool();
  const res = await db.query(`SELECT * FROM orders WHERE id = $1`, [orderId]);
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
    id: row.id,
    timestamp: row.timestamp,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    deliveryAddress: row.delivery_address,
    city: row.city,
    postalCode: row.postal_code,
    items: row.items,
    total: Number(row.total),
    paymentStatus: row.payment_status,
    stripeSessionId: row.stripe_session_id,
    boxnowLocationId: row.boxnow_location_id,
    boxnowReference: row.boxnow_reference,
  };
}

export async function updateBoxNowReference(orderId: string, boxnowReference: string): Promise<void> {
  await ensureSchema();
  const db = getPool();
  await db.query(`UPDATE orders SET boxnow_reference = $1 WHERE id = $2`, [boxnowReference, orderId]);
}

export async function getAllOrders(): Promise<OrderData[]> {
  await ensureSchema();
  const db = getPool();
  const res = await db.query(`SELECT * FROM orders ORDER BY timestamp DESC`);
  return res.rows.map((row) => ({
    id: row.id,
    timestamp: row.timestamp,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    deliveryAddress: row.delivery_address,
    city: row.city,
    postalCode: row.postal_code,
    items: row.items,
    total: Number(row.total),
    paymentStatus: row.payment_status,
    stripeSessionId: row.stripe_session_id,
    boxnowLocationId: row.boxnow_location_id,
    boxnowReference: row.boxnow_reference,
  }));
}

export async function getInventory(): Promise<Record<string, number>> {
  await ensureSchema();
  const db = getPool();
  const res = await db.query(`SELECT product_id, quantity FROM inventory`);
  const map: Record<string, number> = {};
  for (const row of res.rows) map[row.product_id] = Number(row.quantity);
  return map;
}

export async function setInventory(productId: string, quantity: number): Promise<void> {
  await ensureSchema();
  const db = getPool();
  await db.query(
    `INSERT INTO inventory (product_id, quantity) VALUES ($1, $2)
     ON CONFLICT (product_id) DO UPDATE SET quantity = $2`,
    [productId, quantity]
  );
}

export interface PromoCodeRow { code: string; discount: number; active: boolean }

export async function getPromoCodes(): Promise<PromoCodeRow[]> {
  await ensureSchema();
  const db = getPool();
  const res = await db.query(`SELECT code, discount, active FROM promo_codes ORDER BY code`);
  return res.rows;
}

export async function upsertPromoCode(code: string, discount: number, active: boolean): Promise<void> {
  await ensureSchema();
  const db = getPool();
  await db.query(
    `INSERT INTO promo_codes (code, discount, active) VALUES ($1, $2, $3)
     ON CONFLICT (code) DO UPDATE SET discount = $2, active = $3`,
    [code, discount, active]
  );
}

export async function deletePromoCode(code: string): Promise<void> {
  await ensureSchema();
  const db = getPool();
  await db.query(`DELETE FROM promo_codes WHERE code = $1`, [code]);
}

export async function getActivePromoCode(code: string): Promise<PromoCodeRow | null> {
  await ensureSchema();
  const db = getPool();
  const res = await db.query(`SELECT code, discount, active FROM promo_codes WHERE code = $1 AND active = true`, [code]);
  return res.rows[0] ?? null;
}

// Returns true if the request is allowed, false if rate limited
// limit: max requests per windowSeconds
export async function checkRateLimit(ip: string, route: string, limit: number, windowSeconds: number): Promise<boolean> {
  try {
    await ensureSchema();
    const db = getPool();
    const windowStart = new Date(Math.floor(Date.now() / (windowSeconds * 1000)) * windowSeconds * 1000);
    const key = `${ip}:${route}`;
    const res = await db.query(
      `INSERT INTO rate_limits (key, window_start, count)
       VALUES ($1, $2, 1)
       ON CONFLICT (key, window_start) DO UPDATE SET count = rate_limits.count + 1
       RETURNING count`,
      [key, windowStart]
    );
    // Clean up old windows occasionally
    if (Math.random() < 0.01) {
      await db.query(`DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '1 hour'`);
    }
    return res.rows[0].count <= limit;
  } catch {
    return true; // fail open — don't block if DB is down
  }
}

export async function decreaseInventory(productId: string, amount: number): Promise<void> {
  await ensureSchema();
  const db = getPool();
  await db.query(
    `UPDATE inventory SET quantity = GREATEST(0, quantity - $1) WHERE product_id = $2`,
    [amount, productId]
  );
}
