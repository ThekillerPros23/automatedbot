import express from "express"
import cors from "cors"
import { routes } from "./routes/routes.js"
const app  = express()

app.listen(3000,()=>{
    console.log("server is running in port : 3000")
})

app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(express.json())
app.use("/api",routes)