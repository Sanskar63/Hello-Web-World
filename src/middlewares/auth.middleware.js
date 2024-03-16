import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        //there are cases when cookies are not stored instead header is stored and access token is stored in header like: Authorisation: Bearer AccessTokenKey
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        //When a JWT is created using jwt.sign(), it is signed with a secret key or a public/private key pair. jwt.verify() checks the token's signature using the same key to ensure that the token is valid. If the token is valid, it returns the payload decoded. If the token is not valid (e.g., if it has been tampered with, or the signature does not match), it will throw an error.
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})