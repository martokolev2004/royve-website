const API_URL = process.env.BOXNOW_API_URL || "https://api-production.boxnow.bg";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token;
  }
  const res = await fetch(`${API_URL}/api/v1/auth-sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: process.env.BOXNOW_CLIENT_ID,
      client_secret: process.env.BOXNOW_CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`BoxNow auth failed: ${res.status}`);
  const data = await res.json();
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.token;
}

export interface BoxNowDeliveryParams {
  orderId: string;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  destinationLocationId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

export async function createBoxNowDelivery(params: BoxNowDeliveryParams): Promise<string> {
  const token = await getToken();

  const deliveryItems = params.items.flatMap((item, idx) =>
    Array.from({ length: item.quantity }, (_, j) => ({
      id: `${params.orderId}-${idx}-${j}`,
      name: item.name,
      value: String(item.price),
      weight: 1,
    }))
  );

  const res = await fetch(`${API_URL}/api/v1/delivery-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      orderNumber: params.orderId,
      invoiceValue: String(params.total),
      paymentMode: "prepaid",
      amountToBeCollected: "0.00",
      allowReturn: true,
      origin: {
        contactName: "ROYVÉ",
        contactEmail: "orders@royve.eu",
        contactNumber: "+35988477876",
        locationId: String(process.env.BOXNOW_WAREHOUSE_ID),
      },
      destination: {
        contactName: params.customerName,
        contactEmail: params.customerEmail,
        contactNumber: params.customerPhone,
        locationId: params.destinationLocationId,
      },
      items: deliveryItems,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`BoxNow delivery failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.referenceNumber as string;
}
