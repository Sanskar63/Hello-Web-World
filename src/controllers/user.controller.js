import { asyncHandler } from "../utils/asyncHandler.js"; //import is done this way when export is like export {asyncHandler}

const registerUser = asyncHandler(
    async (req, res)=>{
        res.status(200).json({
            message: "got it!"
        })
    }
)

export {registerUser}