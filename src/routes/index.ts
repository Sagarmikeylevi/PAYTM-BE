import { Router } from "express";
const router = Router();
import userRouter from "./users.js";

router.get("/", (req, res) => res.send("PayTM Backend"));

router.use("/user", userRouter);

export default router;
