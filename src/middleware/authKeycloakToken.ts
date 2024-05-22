import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const public_key = `-----BEGIN PUBLIC KEY-----\n${process.env.KEY_CLOAK_PUBLIC_KEY}\n-----END PUBLIC KEY-----`;

export const authKeycloakToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  token = token.split(" ")[1];

  try {
    const decodedToken: any = jwt.verify(token, public_key, {
      algorithms: ["RS256"],
    });

    const { name, email } = decodedToken;

    req.user = {
      name,
      email,
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
