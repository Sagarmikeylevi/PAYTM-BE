import { Request, Response, NextFunction } from "express";
import { keycloakAdmin, keycloakConfig } from "../keycloak.js";
import dotenv from "dotenv";
dotenv.config();

export const authenticateKeycloakAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await keycloakAdmin.auth({
      grantType: "client_credentials",
      clientId: keycloakConfig.clientId,
      clientSecret: keycloakConfig.clientSecret,
    });

    next();
  } catch (error) {
    console.error("Failed to authenticate with Keycloak:", error);
    res.status(500).json({ error: "Failed to authenticate with Keycloak" });
  }
};
