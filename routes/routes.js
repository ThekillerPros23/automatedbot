import express from "express";
import { send_whatsapp_message } from "../controller/send_message.js";
import { receive_message } from "../controller/receive_message.js";

export const routes = express.Router();

// Ruta para enviar mensaje manualmente
routes.post("/send_message", send_whatsapp_message);

// Ruta para recibir mensajes y verificar webhook
routes.all("/webhook", receive_message);
