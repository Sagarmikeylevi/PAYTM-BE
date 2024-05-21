import { NextFunction, Request, Response, Router } from "express";
const router = Router();
import userRouter from "./users.js";
import accountRouter from "./account.js";
import keycloakRouter from "./keycloak.js";

router.get("/", (req, res) => res.send("PayTM Backend"));

router.use("/user", userRouter);
router.use("/account", accountRouter);
router.use("/keycloak", keycloakRouter);

export default router;
