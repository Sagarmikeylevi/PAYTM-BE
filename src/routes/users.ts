import { Router } from "express";
import {
  login,
  registation,
  updateUser,
} from "../controllers/userController.js";
import { authorize } from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.post("/register", registation);
userRouter.post("/login", login);
userRouter.put("/update", authorize, updateUser);

export default userRouter;
