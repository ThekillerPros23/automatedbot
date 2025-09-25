import express from "express"
import { send_whatsapp_message } from "../controller/send_message.js"
import { receive_message } from "../controller/recive_message.js"

export const routes = express.Router()
routes.get("/webhook",send_whatsapp_message)
routes.post("/receive_message",receive_message)