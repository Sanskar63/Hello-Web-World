import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"; //import is done this way when export is like export {registerUser}

const router = Router();

router.route("/register").post(registerUser)

export default router;

