import { Router } from "express";
import { registation } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/register", registation);

export default userRouter;
