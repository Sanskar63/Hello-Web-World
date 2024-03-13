import { asyncHandler } from "../utils/asyncHandler.js"; //import is done this way when export is like export {asyncHandler}
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken //we save refresh token in our db and give access token to the user. 
        await user.save({ validateBeforeSave: false })//on saving all the code will be fired and mongoose will give errror because there a some feilds that are required like password thus  we have set validation to false.

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res)=>{

    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
        //The trim() method removes whitespace from both ends of a string. The ?. is the optional chaining operator, which allows accessing properties and methods of an object that may be null or undefined without causing an error. If field is null or undefined, the expression evaluates to undefined.
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
        //$or: This is a MongoDB query operator that performs a logical OR operation on an array of two or more expressions and selects the documents that satisfy at least one of the expressions. In this case, it's used to find documents where either the username or the email matches.

        //{ username } and { email }: These are shorthand notation for { username: username } and { email: email }, respectively. Assuming username and email are variables containing the values to search for, this part of the query checks if the username or email field in the document matches the corresponding value.
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // console.log(req.files);
    
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )












    }
)

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
   //What was need when we already had user? --> the user we had didn't have accessToken because it is created by the code just above.
   //We also couldv'e updated existing "user" its totally upto us.


   //we need to design option when we want to send cookies. options are objects. 
   const options = {
        httpOnly: true,
        secure: true
        //by default anyone (frontend and backend) can modify cookies but after adding this it can only be modified by backend sever.
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
    


})

const logoutUser = asyncHandler(async(req, res)=>{
    //here we don't know to which user log out because we don't have access of user or loggedInUser. So here we make a middleware 
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
            //we will get new updated value in return response
        }
    )

    
   //we need to design option when we want to deal with cookies. options are objects. 
   const options = {
    httpOnly: true,
    secure: true
    //by default anyone (frontend and backend) can modify cookies but after adding this it can only be modified by backend sever.
}

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})
export {
    registerUser,
    loginUser,
    logoutUser
}