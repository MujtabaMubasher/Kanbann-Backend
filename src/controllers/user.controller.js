import { asyncHandler } from "../utills/asyncHandler.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiRespponse.js";
import { User } from "../models/user.model.js";
import Jwt  from "jsonwebtoken";

 const generateAccessAndRefreshToken = async (userId) => {
   try {
     const user = await User.findById(userId);
     const accessToken = await user.generateAccessToken();
     const refreshToken = await user.generateRefreshToken();

     user.refreshToken = refreshToken;
     await user.save({ validateBeforeSave: false });

     return { accessToken, refreshToken };
   } catch (error) {
     throw new ApiError(
       500,
       "Something went wrong while generating referesh and access token"
     );
   }
 };

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email,  password } = req.body;

  if (
    [fullName, email, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const userExist = await User.findOne({
    $or: [{ email }],
  });

  if (userExist) {
    throw new ApiError(409, "Provided Username & Email already Exist");
  }

  
  // console.log("avartar", req.files);
  // console.log(avaterLocalPath);
  // const coverImageLocalPath = req.files?.coverImage[0]?.path


  // console.log(coverImageLocalPath);

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!userCreated) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, userCreated, "User registered Successfully"));
});


 const loginUser = asyncHandler(async (req, res) => {
    console.log("Request Body:", req.body);
   // req body -> data
   // username or email
   // find the user
   // password check
   // access and referesh token
   // send cookie
   const { email, password } = req.body;

    //  console.log(email);
    //  console.log(userName);

   if (!email) {
     throw new ApiError(400, "Username and Email is required");
   }
   // Here is an alternative of above code based on logic discussed in video:
   // if (!(username || email)) {
   //     throw new ApiError(400, "username or email is required")

   // }
   const user = await User.findOne({
     $or: [{ email }],
   });

   if (!user) {
     throw new ApiError(404, "User does not exist");
   }

   const isPasswordValid = await user.isPasswordCorrect(password);

   if (!isPasswordValid) {
     throw new ApiError(401, "Invalid user credentials");
   }
   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
     user._id
   );

   const loggedInUser = await User.findById(user._id).select(
     "-password -refreshToken"
   );

   const options = {
     httpOnly: true,
     secure: true,
   };

   return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .json( new ApiResponse(
       200,
       {
         user: loggedInUser,
       },
       "User logged In Successfully"
     ));
 })

 const logoutUser = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(
     req.user._id,
     {
       /**
        $set:{
          refreshToken: undefined
        }
        */
       $unset: {
         refreshToken: 1, 
       },
     },
     {
       new: true,
     }
   );

   const options = {
     httpOnly: true,
     secure: true,
   };

   return res
     .status(200)
     .clearCookie("accessToken", options)
     .json(new ApiResponse(200, {}, "User logged Out"));
 });

 const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingRefreshToken =
     req.cookie.refreshToken || req.body.refreshToken;
   if (!incomingToken) {
     throw new ApiError(401, "unauthurized request");
   }

   try {
     const decodedToken = Jwt.verify(
       incomingRefreshToken,
       process.env.REFRESH_TOKEN_SECRET
     );

     if (!decodedToken) {
       throw new ApiError(401, "Unable to varify refrsh token");
     }

     const user = User.findById(decodedToken._id);

     if (!user) {
       throw new ApiError(401, "Invalid Refresh Token");
     }

     if (incomingRefreshToken !== user?.refreshToken) {
       throw new ApiError(401, "Refresh token is expired or used");
     }

     const { accessToken, newRefreshToken } =
       await generateAccessAndRefreshToken();

     const options = {
       httpOnly: true,
       secure: true,
     };

     res
       .status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", newRefreshToken, options)
       .json(
         new ApiResponse(
           200,
           {
             accessToken,
             refreshToken: newRefreshToken,
           },
           "Access Token Refreshed"
         )
       );
   } catch (error) {
     throw new ApiError(401, error?.message || "Invalid refresh token");
   }
 });

 const changePassword = asyncHandler(async (req,res)=>{
  const {oldPassword, newPassword} = req.body

  if (!oldPassword || !newPassword) {
    throw new ApiError(401,"All fields are required")
  }

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
      throw new ApiError(400, " Invalid Password")
    }

    user.password = newPassword
     
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, "Password Changed Successfully"))

 })

 const getCurrentUser = asyncHandler(async (req, res) => {
  return res
  .status(200)
  .json(new ApiResponse(200, req.user, "User Fetched Successfully"))
 })

 const updateAccountDetails = asyncHandler(async (req, res)=>{
  const {fullName, email} = req.body
   if (!fullName || !email) {
     throw new ApiError(400, "All fields are required")
   }
    const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
          fullName,
          email: email
      }
    },
    {
      new: true
    }
   ).select("-password")

   return res
   .status(200)
   .json(new ApiResponse(200, user, "Account Details Updated Successfully"))
 })

 

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
}