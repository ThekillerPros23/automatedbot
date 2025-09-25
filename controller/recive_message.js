import axios from 'axios';

export async function receive_message(req, res) {
  const { whatsappID, access_token } = process.env;

  // Verify the webhook subscription when Facebook sends a GET request
  if (req.method === 'GET') {
    const verify_token = process.env.access_token; // This should match the token you set up in Facebook Developer Console
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === verify_token) {
        console.log('Webhook Verified');
        return res.status(200).send(challenge);
      } else {
        return res.sendStatus(403);
      }
    }
  }

  // Handle incoming messages from WhatsApp when Facebook sends a POST request
  if (req.method === 'POST') {
    const body = req.body;

    // Log the incoming body for debugging purposes
    console.log(JSON.stringify(body, null, 2));

    // Check if the message is from a WhatsApp business account and contains messages
    if (body.object === 'whatsapp_business_account') {
      if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
        const message = body.entry[0].changes[0].value.messages[0];
        const from = message.from; // Sender's international phone number
        const type = message.type; // Message type (e.g., text, image)

        console.log(`Received message from ${from}:`);

        if (type === 'text') {
          const text = message.text.body;
          console.log(`Text: ${text}`);

          // You can add logic here to process the message and send a reply if needed
          // For example, to send a simple "hello" back:
          // await sendMessage(from, "Hello from your bot!");

        } else if (type === 'image') {
          const imageId = message.image.id;
          console.log(`Image ID: ${imageId}`);
          // You can fetch the image using the image ID and send a response
        }
        // ... handle other message types (audio, video, document, etc.)

        // Acknowledge the message to Facebook to avoid resending
        return res.status(200).send('EVENT_RECEIVED');
      }
    }
    // If it's not a message from WhatsApp, or if there's an error in the payload structure
    return res.status(200).send('No message received or invalid payload');
  }

  // If a method other than GET or POST is used
  return res.status(405).send('Method Not Allowed');
}

// Helper function to send messages (optional, but good for replying)
async function sendMessage(to, messageBody) {
  const url = `https://graph.facebook.com/v22.0/${process.env.whatsappID}/messages`;
  const access_token = process.env.access_token;

  const body = {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: {
      body: messageBody
    }
  };

  try {
    await axios.post(url, body, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`Message sent to ${to}: ${messageBody}`);
  } catch (error) {
    console.error(`Error sending message to ${to}:`, error.response ? error.response.data : error.message);
  }
}