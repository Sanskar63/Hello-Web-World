import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"; //import is done this way when export is like export {registerUser}
import {upload} from "../middlewares/multer.middlewar.js"
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar", //this name must be same in frontend as well
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

export default router;

