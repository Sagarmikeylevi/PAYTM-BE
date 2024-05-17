import { Router } from "express";
import { getBalance, transferMoney } from "../controllers/account.controller";
import { authorize } from "../middleware/authMiddleware";
const accountRouter = Router();

accountRouter.get("/balance", authorize, getBalance);
accountRouter.post("/transfer", authorize, transferMoney);

export default accountRouter;
