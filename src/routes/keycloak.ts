import { Request, Response, Router } from "express";
import { authenticateKeycloakAdmin } from "../middleware/authenticateKeycloakAdmin.js";
import {
  createUser,
  refreshToken,
  session,
} from "../controllers/keycloak.controller.js";
import { authKeycloakToken } from "../middleware/authKeycloakToken.js";

const keycloakRouter = Router();

keycloakRouter.post("/register", authenticateKeycloakAdmin, createUser);
keycloakRouter.post("/login", session);
keycloakRouter.post("/refresh-token", refreshToken);
keycloakRouter.get(
  "/protected",
  authKeycloakToken,
  (req: Request, res: Response) => {
    res.send({ name: req.user?.name, email: req.user?.email });
  }
);

export default keycloakRouter;
