import { Router } from "express";
import {
  getBalance,
  transferMoney,
} from "../controllers/account.controller.js";
import { authorize } from "../middleware/authMiddleware.js";
const accountRouter = Router();

accountRouter.get("/balance", authorize, getBalance);
accountRouter.post("/transfer", authorize, transferMoney);

export default accountRouter;
