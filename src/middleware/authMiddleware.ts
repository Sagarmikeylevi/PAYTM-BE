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

export const authorize = async (
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
    const jwtSecret = `${process.env.JWT_SECRET}`;
    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
