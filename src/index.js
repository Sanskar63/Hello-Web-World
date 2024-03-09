import dotenv from "dotenv"
import connectDB from "./db/index.db.js";

dotenv.config({
    path: './.env'
})

connectDB()

