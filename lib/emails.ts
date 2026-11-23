import { OrderData } from "./db";

type EmailPaymentType = "card" | "bank_transfer" | "cod";

export async function sendOrderEmails(order: OrderData, paymentType: EmailPaymentType, boxnowRef?: string) {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const itemsList = order.items.map((i) => `${i.name} × ${i.quantity} — ${(i.price * i.quantity).toFixed(2)} €`).join("\n");

  const deliveryInfo = order.boxnowLocationId
    ? `📦 ДОСТАВКА: BOX NOW АВТОМАТ\nАдрес: ${order.boxnowLockerAddress || order.boxnowLocationId}${boxnowRef ? `\nBOX NOW реф: ${boxnowRef}` : ""}`
    : `🚚 Куриер: ${order.courier || ""}  \nАдрес: ${order.deliveryAddress}, ${order.city} ${order.postalCode}`;

  const paymentLabel =
    paymentType === "bank_transfer" ? "💳 Банков превод (очаква се потвърждение)"
    : paymentType === "cod" ? "💵 Наложен платеж"
    : "✅ Платено с карта";

  // Admin notification
  await resend.emails.send({
    from: "ROYVÉ Orders <orders@royve.eu>",
    to: process.env.ORDER_EMAIL || "royve.eyewear@gmail.com",
    subject: `Нова поръчка #${order.id} — ${order.customerName} [${paymentLabel}]`,
    text: `НОВА ПОРЪЧКА\n\nНомер: ${order.id}\nКлиент: ${order.customerName}\nИмейл: ${order.customerEmail}\nТелефон: ${order.customerPhone}\n\n${deliveryInfo}\n\nПЛАЩАНЕ: ${paymentLabel}\n\nПРОДУКТИ:\n${itemsList}\n\nОБЩО: ${order.total} €`,
  });

  // Customer confirmation
  const customerDeliveryText = order.boxnowLocationId
    ? `📦 BOX NOW автомат: ${order.boxnowLockerAddress || order.boxnowLocationId}${boxnowRef ? `<br>Номер на пратката: ${boxnowRef}` : ""}`
    : `🚚 ${order.courier || "Куриер"} на адрес: ${order.deliveryAddress}, ${order.city} ${order.postalCode}`;

  const paymentNote =
    paymentType === "bank_transfer"
      ? `<div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.3);padding:16px;margin-top:20px;">
          <p style="margin:0 0 6px;color:#c9a84c;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;">Следващи стъпки</p>
          <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;">Провери имейла си — ще получиш банковите данни за превода. Поръчката се активира след получаване на превода (1–3 работни дни).</p>
        </div>`
      : paymentType === "cod"
      ? `<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);padding:16px;margin-top:20px;">
          <p style="margin:0 0 6px;color:rgba(255,255,255,0.3);font-size:10px;letter-spacing:0.3em;text-transform:uppercase;">Плащане</p>
          <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;">💵 Наложен платеж — плащаш при получаване.</p>
        </div>`
      : "";

  await resend.emails.send({
    from: "ROYVÉ <orders@royve.eu>",
    to: order.customerEmail,
    subject: `Потвърждение на поръчка #${order.id} — ROYVÉ`,
    html: `<!DOCTYPE html>
<html lang="bg">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="text-align:center;padding-bottom:32px;">
          <p style="margin:0;color:#c9a84c;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;">— ROYVÉ EYEWEAR —</p>
          <h1 style="margin:8px 0 0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:0.1em;">Благодарим ти!</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.4);font-size:13px;">Поръчката ти е получена.</p>
        </td></tr>
        <tr><td style="background:#111111;border:1px solid rgba(255,255,255,0.08);padding:28px;">
          <p style="margin:0 0 4px;color:rgba(255,255,255,0.3);font-size:10px;letter-spacing:0.3em;text-transform:uppercase;">Номер на поръчка</p>
          <p style="margin:0 0 20px;color:#c9a84c;font-size:18px;font-weight:700;letter-spacing:0.15em;">#${order.id}</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;margin-bottom:16px;">
            ${order.items.map((item) => `
            <tr>
              <td style="padding:6px 0;color:rgba(255,255,255,0.7);font-size:13px;">${item.name} × ${item.quantity}</td>
              <td style="padding:6px 0;color:#c9a84c;font-size:13px;text-align:right;">${(item.price * item.quantity).toFixed(2)} €</td>
            </tr>`).join("")}
            <tr><td colspan="2" style="border-top:1px solid rgba(255,255,255,0.08);padding-top:12px;"></td></tr>
            <tr>
              <td style="color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">Общо</td>
              <td style="color:#c9a84c;font-size:18px;font-weight:700;text-align:right;">${order.total} €</td>
            </tr>
          </table>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);padding:16px;margin-top:20px;">
            <p style="margin:0 0 6px;color:rgba(255,255,255,0.3);font-size:10px;letter-spacing:0.3em;text-transform:uppercase;">Доставка</p>
            <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;">${customerDeliveryText}</p>
          </div>
          ${paymentNote}
        </td></tr>
        <tr><td style="text-align:center;padding-top:28px;">
          <p style="margin:0;color:rgba(255,255,255,0.2);font-size:11px;">При въпроси пиши на <a href="mailto:royve.eyewear@gmail.com" style="color:#c9a84c;">royve.eyewear@gmail.com</a></p>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.1);font-size:10px;letter-spacing:0.2em;">ROYVÉ — NOT FOR EVERYONE.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
