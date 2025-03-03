import jwt from "jsonwebtoken";
import { ApiError } from "../utills/ApiError.js";
import { asyncHandler } from "../utills/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    console.log("Cookies Received:", req.cookies); 
    console.log("Headers Received:", req.headers); 
  try {
    const token =
      req.cookies?.accessToken ||
      req.get("Authorization")?.replace("Bearer ", "");
      console.log(token);

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decodeToken);

    const user = await User.findById(decodeToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("I am in JWT Verify Catch Block");
    
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});