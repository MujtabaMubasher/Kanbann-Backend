import { Router } from "express";
import { 
  registerUser, 
  loginUser, 
  logoutUser,
  refreshAccessToken,
  getCurrentUser
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser)
userRouter.route('/login').post(loginUser)

//secured Route
userRouter.route('/logout').get(verifyJWT, logoutUser)
userRouter.route('/getuser').get(verifyJWT, getCurrentUser )
userRouter.route('/refresh-token').post(refreshAccessToken)

export default userRouter