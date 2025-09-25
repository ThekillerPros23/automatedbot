import axios from "axios";

export async function receive_message(req, res) {
  const { WHATSAPP_ID, ACCESS_TOKEN, VERIFY_TOKEN } = process.env;

  // 📌 Webhook verification (GET request)
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("✅ Webhook Verified");
        return res.status(200).send(challenge);
      } else {
        console.error("❌ Webhook verification failed");
        return res.sendStatus(403);
      }
    }
    return res.status(400).send("Missing hub.mode or hub.verify_token");
  }

  // 📌 Receiving messages (POST request)
  if (req.method === "POST") {
    const body = req.body;
    console.log("📥 Webhook received:", JSON.stringify(body, null, 2));

    if (body.object === "whatsapp_business_account") {
      const changes = body.entry?.[0]?.changes?.[0]?.value;
      if (changes?.messages && changes.messages.length > 0) {
        const message = changes.messages[0];
        const from = message.from;
        const type = message.type;

        console.log(`📩 Message from ${from}:`);

        if (type === "text") {
          const text = message.text.body;
          console.log("💬 Text:", text);

          // Ejemplo de respuesta automática
          await sendMessage(from, "Hola 👋, gracias por tu mensaje.");
        } else {
          console.log(`📎 Tipo de mensaje: ${type}`);
        }

        return res.status(200).send("EVENT_RECEIVED");
      }
    }

    return res.status(200).send("No message received");
  }

  return res.status(405).send("Method Not Allowed");
};

// Helper para enviar mensajes
async function sendMessage(to, messageBody) {
  const url = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_ID}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: {
      body: messageBody,
    },
  };

  try {
    await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    console.log(`✅ Message sent to ${to}: ${messageBody}`);
  } catch (error) {
    console.error("❌ Error sending message:", error.response?.data || error.message);
  }
}
