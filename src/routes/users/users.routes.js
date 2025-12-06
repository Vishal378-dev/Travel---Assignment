import express from "express";
import { getAllUsers, registerUser } from "../../controllers/user/user.controller.js";
import { loginUser } from "../../controllers/auth/auth.controller.js";
import { verifyToken } from "../../middlewares/jwt.middleware.js";

const userRouter = express.Router();


userRouter.get("/",verifyToken,getAllUsers);

userRouter.post("/",registerUser);
userRouter.post("/login",loginUser);


export default userRouter;



