import { Router } from "express";
import { getBalance } from "../controllers/account.controller";
import { authorize } from "../middleware/authMiddleware";
const accountRouter = Router();

accountRouter.get("/balance", authorize, getBalance);

export default accountRouter;
