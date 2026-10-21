const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const getSender = () => ({
  name: process.env.SENDER_NAME || "Tomato Food Delivery",
  email: process.env.SENDER_EMAIL
});

// Helper using Node's native built-in fetch
const sendEmail = async ({ to, subject, htmlContent }) => {
  if (!process.env.BREVO_API_KEY || !process.env.SENDER_EMAIL) {
    console.warn("Brevo API key or Sender Email missing in .env");
    return;
  }

  try {
    const payload = {
      sender: getSender(),
      to,
      subject,
      htmlContent
    };

    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Brevo Email Dispatch Error:", error.message);
  }
};

// 1. Welcome Email after Signup
export const sendWelcomeEmail = async (userEmail, userName) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #e23744; margin-bottom: 8px;">Welcome to Tomato, ${userName || "Foodie"}! 🍅</h2>
      <p style="color: #555; line-height: 1.6; font-size: 15px;">Your account is ready. Explore our signature dishes and fresh chef specials delivered straight to your door.</p>
      <div style="margin: 25px 0;">
        <a href="https://tomato-food-frontend.vercel.app" style="background-color: #e23744; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Browse Menu</a>
      </div>
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">If you have any questions, reply directly to this email.</p>
    </div>
  `;

  return sendEmail({
    to: [{ email: userEmail, name: userName || "Foodie" }],
    subject: "Welcome to Tomato! 🍅",
    htmlContent
  });
};

// 2. Order Confirmation with Receipt Slip
export const sendOrderConfirmationEmail = async (userEmail, order) => {
  const itemsHtml = (order.items || [])
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0; color: #333;">${item.name}</td>
        <td style="padding: 10px 0; text-align: center; color: #666;">x ${item.quantity}</td>
        <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #333;">$${item.price * item.quantity}.00</td>
      </tr>
    `
    )
    .join("");

  const recipientName =
    `${order.address?.firstName || ""} ${order.address?.lastName || ""}`.trim() ||
    "Customer";

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
      <div style="border-bottom: 2px solid #e23744; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #e23744; margin: 0;">Tomato.</h2>
        <span style="color: #6b7280; font-size: 13px;">Order Confirmation & Receipt</span>
      </div>

      <p style="color: #374151; font-size: 15px;">Hi <b>${order.address?.firstName || "Customer"}</b>, your order has been received and sent to kitchen prep!</p>
      <p style="color: #6b7280; font-size: 12px; margin-bottom: 20px;">Order ID: <b>#${order._id}</b></p>

      <h3 style="color: #111827; font-size: 14px; text-transform: uppercase; margin-bottom: 8px;">Order Slip</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="border-bottom: 2px solid #f3f4f6; color: #9ca3af; font-size: 12px; text-align: left;">
            <th style="padding-bottom: 6px;">Item</th>
            <th style="padding-bottom: 6px; text-align: center;">Qty</th>
            <th style="padding-bottom: 6px; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr>
            <td colspan="2" style="padding: 10px 0; color: #666;">Delivery Fee</td>
            <td style="padding: 10px 0; text-align: right; color: #666;">$2.00</td>
          </tr>
          <tr style="border-top: 2px solid #111827;">
            <td colspan="2" style="padding: 12px 0; font-size: 16px; font-weight: bold; color: #111827;">Total Paid</td>
            <td style="padding: 12px 0; text-align: right; font-size: 16px; font-weight: bold; color: #e23744;">$${order.amount}.00</td>
          </tr>
        </tbody>
      </table>

      <div style="background-color: #fafafa; border-radius: 8px; padding: 14px; margin-bottom: 20px; font-size: 13px; color: #4b5563;">
        <p style="margin: 0 0 4px 0;"><b>Delivery Address:</b></p>
        <p style="margin: 0;">${order.address?.street || ""}, ${order.address?.city || ""}, ${order.address?.zipcode || ""}</p>
        <p style="margin: 4px 0 0 0;"><b>Phone:</b> ${order.address?.phone || "N/A"}</p>
      </div>

      <p style="color: #9ca3af; font-size: 11px; text-align: center; margin: 0;">Thank you for ordering with Tomato!</p>
    </div>
  `;

  return sendEmail({
    to: [{ email: userEmail, name: recipientName }],
    subject: `Order Confirmed: #${order._id.toString().slice(-6).toUpperCase()} 🍽️`,
    htmlContent
  });
};

// 3. Order Cancellation Receipt Slip
export const sendOrderCancellationEmail = async (userEmail, order) => {
  const itemsHtml = (order.items || [])
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 8px 0; color: #555;">${item.name}</td>
        <td style="padding: 8px 0; text-align: center; color: #777;">x ${item.quantity}</td>
        <td style="padding: 8px 0; text-align: right; color: #555;">$${item.price * item.quantity}.00</td>
      </tr>
    `
    )
    .join("");

  const recipientName =
    `${order.address?.firstName || ""} ${order.address?.lastName || ""}`.trim() ||
    "Customer";

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #fecdd3; border-radius: 12px; background-color: #ffffff;">
      <div style="border-bottom: 2px solid #dc2626; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #dc2626; margin: 0;">Tomato.</h2>
        <span style="color: #6b7280; font-size: 13px;">Order Cancellation Slip</span>
      </div>

      <p style="color: #374151; font-size: 15px;">Hi <b>${order.address?.firstName || "Customer"}</b>, your order has been cancelled.</p>
      <p style="color: #6b7280; font-size: 12px; margin-bottom: 20px;">Order ID: <b>#${order._id}</b></p>

      <h3 style="color: #111827; font-size: 14px; text-transform: uppercase; margin-bottom: 8px;">Cancelled Items</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="border-bottom: 2px solid #f3f4f6; color: #9ca3af; font-size: 12px; text-align: left;">
            <th style="padding-bottom: 6px;">Item</th>
            <th style="padding-bottom: 6px; text-align: center;">Qty</th>
            <th style="padding-bottom: 6px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr style="border-top: 2px solid #dc2626;">
            <td colspan="2" style="padding: 12px 0; font-size: 15px; font-weight: bold; color: #111827;">Cancelled Total</td>
            <td style="padding: 12px 0; text-align: right; font-size: 15px; font-weight: bold; color: #dc2626;">$${order.amount}.00</td>
          </tr>
        </tbody>
      </table>

      <div style="background-color: #fef2f2; border-radius: 8px; padding: 14px; font-size: 13px; color: #991b1b;">
        Status: <b>Cancelled</b>. Any pre-authorized charges will be reversed according to your bank's policies.
      </div>
    </div>
  `;

  return sendEmail({
    to: [{ email: userEmail, name: recipientName }],
    subject: `Order Cancelled: #${order._id.toString().slice(-6).toUpperCase()} ❌`,
    htmlContent
  });
};