import Database from "better-sqlite3";
import path from "path";

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), "orders.db");
    db = new Database(dbPath);
    db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        delivery_address TEXT NOT NULL,
        city TEXT NOT NULL,
        postal_code TEXT NOT NULL,
        items TEXT NOT NULL,
        total REAL NOT NULL
      )
    `);
  }
  return db;
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
}

export function saveOrder(order: OrderData): void {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO orders (id, timestamp, customer_name, customer_email, customer_phone, delivery_address, city, postal_code, items, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    order.id,
    order.timestamp,
    order.customerName,
    order.customerEmail,
    order.customerPhone,
    order.deliveryAddress,
    order.city,
    order.postalCode,
    JSON.stringify(order.items),
    order.total
  );
}
