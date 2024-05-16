import { Router } from "express";
import { login, registation } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/register", registation);
userRouter.post("/login", login);

export default userRouter;
