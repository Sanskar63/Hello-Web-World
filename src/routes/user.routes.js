import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js"; //import is done this way when export is like export {registerUser}
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
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

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change_password").post(verifyJWT, changeCurrentPassword)
router.route("/current_user").post(verifyJWT, getCurrentUser)
router.route("update_Account").patch(verifyJWT, updateAccountDetails) //here we used patch because we don't want all accounts to be updated and .post would do that.
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover_image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile) //when we pull out info from params we have to give path the way it is given;
router.route("/history").get(verifyJWT, getWatchHistory)

export default router;

