export async function send_whatsapp_message(req, res) {
  try {
    const url = `https://graph.facebook.com/v22.0/${process.env.whatsappID}/messages`;
    const access_token = process.env.access_token;

    const body = {
      messaging_product: "whatsapp",
      to: "50763695150", // <-- número destino en formato internacional
      type: "text",
      text: {
        body: "Hola, este es un mensaje de prueba desde Node.js 🚀"
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(200).json({ success: true, response: data });
  } catch (error) {
    console.error("Error enviando mensaje:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
