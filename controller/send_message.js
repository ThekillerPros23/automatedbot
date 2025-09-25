import axios from "axios";

export async function send_whatsapp_message(req, res) {
  const { to, message } = req.body;
  const url = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_ID}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: { body: message },
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("❌ Error sending message:", error.response?.data || error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
