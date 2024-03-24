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


//router import
import userRouter from "./routes/user.routes.js" //import is done this way when export is default and here we can give it any name like here the file was exported by name of router but it is imported as userRouter.
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
// import playlistRouter from "./routes/playlist.routes.js"


//routes declaration
//app.get is used when we writer routes and controllers at same place but in production level we keep routes and controllers seperate thus we'll have to use app.use
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter); 
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
// app.use("/api/v1/playlist", playlistRouter)
export { app }