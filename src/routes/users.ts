import { Router } from "express";
import {
  filterByUsername,
  getAllUsers,
  login,
  registation,
  updateUser,
} from "../controllers/userController.js";
import { authorize } from "../middleware/authMiddleware.js";

const userRouter = Router();

userRouter.post("/register", registation);
userRouter.post("/login", login);
userRouter.put("/update", authorize, updateUser);
userRouter.get("/get-all-users", authorize, getAllUsers);
userRouter.get("/get-user", authorize, filterByUsername);

export default userRouter;
