import { Request, Response } from "express";
import pool from "../database/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import z from "zod";
import dotenv from "dotenv";
dotenv.config();

const userProfileSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.string().min(1).max(50).email(),
  password: z.string().min(6).max(255),
});

const updateUserProfileSchema = z.object({
  username: z.string().min(1).max(50).optional(),
  password: z.string().min(6).max(255).optional(),
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
    return res.status(201).json({ User: user.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // 1. Check if user exits
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User Not Found" });
    }

    // 2. Compare Password
    const passwordMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    // 3. Generate JWT Token
    const jwtSecret = `${process.env.JWT_SECRET}`;
    const tokenPayload = {
      userId: user.rows[0].id,
      username: user.rows[0].username,
      email: user.rows[0].email,
    };
    const token = jwt.sign(tokenPayload, jwtSecret, {
      expiresIn: "1h",
    });

    // 4. return response
    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    // 1. Zod Validation
    const { success } = updateUserProfileSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({ error: "Invalid User Data" });
    }

    // 2. Get the user Id and search for the user
    const userId = req.user.userId;

    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User Not Found" });
    }

    let { username = user.rows[0].username, password = user.rows[0].password } =
      req.body;

    // 3. Hash the password
    if (password !== user.rows[0].password) {
      password = await bcrypt.hash(password, 10);
    }
    // 4. Update
    const updatedUser = await pool.query(
      "UPDATE users SET username=$1, password=$2, update_date = CURRENT_TIMESTAMP  WHERE id = $3 RETURNING *",
      [username, password, userId]
    );

    // 4. return response
    return res.status(200).json({ UpdatedUser: updatedUser.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // 1. Fetch all users
    const users = await pool.query("SELECT * FROM users");

    // 2. return response
    return res.status(200).json({ Users: users.rows });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
