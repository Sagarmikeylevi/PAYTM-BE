import { Router } from "express";
const router = Router();
import userRouter from "./users.js";
import accountRouter from "./account.js";

router.get("/", (req, res) => res.send("PayTM Backend"));

router.use("/user", userRouter);
router.use("/account", accountRouter);

export default router;
