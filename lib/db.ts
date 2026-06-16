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

async function ensureSchema(): Promise<void> {
  const db = getPool();
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
      stripe_session_id TEXT
    )
  `);
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
}

export async function saveOrder(order: OrderData): Promise<void> {
  await ensureSchema();
  const db = getPool();
  await db.query(
    `INSERT INTO orders (id, timestamp, customer_name, customer_email, customer_phone, delivery_address, city, postal_code, items, total, payment_status, stripe_session_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
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
    ]
  );
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
  };
}
