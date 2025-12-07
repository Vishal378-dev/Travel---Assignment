import express from "express";
import { getAllUsers, registerUser } from "../../controllers/user/user.controller.js";
import { loginUser } from "../../controllers/auth/auth.controller.js";
import { verifyToken } from "../../middlewares/jwt.middleware.js";
import { validateBody } from "../../utils/validateBody.js";
import { loginValidation, registerValidation } from "../../schema/user.schema.js";

const userRouter = express.Router();


userRouter.get("/",verifyToken,getAllUsers);

userRouter.post("/",validateBody(registerValidation),registerUser);
userRouter.post("/login",validateBody(loginValidation),loginUser);


export default userRouter;



