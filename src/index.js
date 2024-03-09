// require('dotenv').config({path: './env'})   //this is not going to work because you have set in package.json file to use type = module and here it is common script js
import dotenv from "dotenv"
import {app} from './app.js'
import connectDB from "./db/index.db.js";

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
