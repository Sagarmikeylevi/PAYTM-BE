import { Request, Response } from "express";
import { keycloakAdmin, keycloakConfig } from "../keycloak.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const createUser = async (req: Request, res: Response) => {
  const { username, email, firstname, lastname, password } = req.body;

  try {
    const newUser = await keycloakAdmin.users.create({
      username: username,
      email: email,
      firstName: firstname,
      lastName: lastname,
      enabled: true,
      credentials: [
        {
          type: "password",
          value: password,
          temporary: false,
        },
      ],
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Failed to create user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const session = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const response = await axios.post(
      `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realmName}/protocol/openid-connect/token`,
      {
        grant_type: "password",
        client_id: keycloakConfig.clientId,
        client_secret: keycloakConfig.clientSecret,
        username: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to login:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    const response = await axios.post(
      `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realmName}/protocol/openid-connect/token`,
      {
        grant_type: "refresh_token",
        client_id: keycloakConfig.clientId,
        client_secret: keycloakConfig.clientSecret,
        refresh_token: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Failed to refresh token:", error);
    res.status(500).json({ error: "Failed to refresh token" });
  }
};
