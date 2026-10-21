import "dotenv/config";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

async function testBrevo() {
  console.log("Checking credentials:");
  console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY ? "Loaded (starts with " + process.env.BREVO_API_KEY.slice(0, 10) + "...)" : "MISSING!");
  console.log("SENDER_EMAIL:", process.env.SENDER_EMAIL || "MISSING!");

  if (!process.env.BREVO_API_KEY || !process.env.SENDER_EMAIL) {
    console.error("Missing .env variables! Check backend/.env");
    return;
  }

  const payload = {
    sender: {
      name: process.env.SENDER_NAME || "Tomato Food Delivery",
      email: process.env.SENDER_EMAIL
    },
    to: [{ email: process.env.SENDER_EMAIL, name: "Test Aaron" }],
    subject: "Tomato Brevo Test Email 🍅",
    htmlContent: "<h3>If you see this, Brevo is working!</h3>"
  };

  try {
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Response status:", res.status);
    console.log("Response body:", data);

    if (res.status === 201 || data.messageId) {
      console.log("SUCCESS! Check your inbox, Spam, and Promotions folder.");
    } else {
      console.log("FAILED. Read the response error details above.");
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testBrevo();