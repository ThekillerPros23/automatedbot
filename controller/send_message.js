export async function send_whatsapp_message(tokenEnv) {
  const url = "https://graph.facebook.com/v22.0/585210678015289/messages";
  const token = tokenEnv || process.env.WHATSAPP_TOKEN; // Token desde argumento o variable de entorno
  const recipients = ["50765733633", "50763695150"]; // Lista de destinatarios

  const payload = (recipient) => ({
    messaging_product: "whatsapp",
    to: recipient,
    type: "text",
    text: {
      body: `✅ Checklist Diario:
1. Revisar correos 📧
2. Actualizar pendientes 📋
3. Avanzar en proyecto 💻
4. Revisión de fin de día 🔍
5. Plan para mañana 🗓️`
    }
  });

  async function sendMessage(recipient) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload(recipient))
      });

      const data = await response.json();
      console.log(`Respuesta para ${recipient}:`, data);
    } catch (error) {
      console.error(`Error enviando mensaje a ${recipient}:`, error);
    }
  }

  function scheduleDaily(hour = 17, minute = 38) {
    const now = new Date();
    const next = new Date();
    next.setHours(hour, minute, 0, 0);

    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }

    const delay = next - now;
    console.log(`Checklist programado para: ${next}`);

    setTimeout(async () => {
      for (const recipient of recipients) {
        await sendMessage(recipient);
      }
      scheduleDaily(hour, minute);
    }, delay);
  }

  scheduleDaily();
}


