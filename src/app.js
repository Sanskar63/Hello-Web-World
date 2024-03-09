import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// this .use is used for middleware configuration.
app.use(cors({
    origin: process.env.CORS_ORIGIN, //in origin pass the url u want to assign access.
    credentials: true
}))

app.use(express.json({limit: "16kb"})) //it is used for the json that we are recieving from fronted like when user submit a form and its details and other things but only json(text).
app.use(express.urlencoded({extended: true, limit: "16kb"})) //it is used because we also recieve data from url (like params)
app.use(express.static("public")) //configuration for storing our static files.
app.use(cookieParser()) //to be able to perform CRUD operations on cookie of the browser of user.


export { app }