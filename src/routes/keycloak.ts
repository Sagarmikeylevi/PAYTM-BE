import { Router } from "express";
import { authenticateKeycloakAdmin } from "../middleware/authenticateKeycloakAdmin.js";
import { createUser } from "../controllers/keycloak.controller.js";

const keycloakRouter = Router();

keycloakRouter.post("/user", authenticateKeycloakAdmin, createUser);

export default keycloakRouter;
