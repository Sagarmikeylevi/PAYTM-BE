import { Request, Response } from "express";
import pool from "../database/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import z from "zod";

const userProfileSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.string().min(1).max(50).email(),
  password: z.string().min(6).max(255),
});

export const registation = async (req: Request, res: Response) => {
  try {
    // 1. Zod Validation
    const { success } = userProfileSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({ error: "Invalid User Data" });
    }

    const { username, email, password } = req.body;

    // 2. Check if mail already exits
    const emailExistsResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (emailExistsResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // 3. Hash the password
    const hasedPassword = await bcrypt.hash(password, 10);

    // 4. Insert user to users table
    const user = await pool.query(
      "INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *",
      [username, email, hasedPassword]
    );

    // 5. return response
    return res.status(201).json(user.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
