import { Request, Response, NextFunction } from "express";
import KeycloakAdminClient from "@keycloak/keycloak-admin-client";
import dotenv from "dotenv";
dotenv.config();

const keycloakConfig = {
  baseUrl: process.env.KEY_CLOAK_BASE_URL,
  realmName: process.env.KEY_CLOAK_REALM,
  clientId: `${process.env.KEY_CLOAK_CLIENT_ID}`,
  clientSecret: process.env.KEY_CLOAK_CLIENT_SECRET,
};

const keycloakAdmin = new KeycloakAdminClient({
  baseUrl: keycloakConfig.baseUrl,
  realmName: keycloakConfig.realmName,
});

declare global {
  namespace Express {
    interface Request {
      keycloakAdmin?: any;
    }
  }
}

export const authenticateKeycloakAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await keycloakAdmin.auth({
      grantType: "client_credentials",
      clientId: keycloakConfig.clientId,
      clientSecret: keycloakConfig.clientSecret,
    });

    req.keycloakAdmin = keycloakAdmin;
    next();
  } catch (error) {
    console.error("Failed to authenticate with Keycloak:", error);
    res.status(500).json({ error: "Failed to authenticate with Keycloak" });
  }
};
