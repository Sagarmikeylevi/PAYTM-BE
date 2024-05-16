import { Request, Response } from "express";
import pool from "../database/db";

export const getBalance = async (req: Request, res: Response) => {
  try {
    // get user id
    const userId = req.user.userId;

    // fetch account details
    const account = await pool.query("SELECT * FROM bank WHERE userId = $1", [
      userId,
    ]);

    // retrun account balance
    return res.status(200).json({ AccountBalance: account.rows[0].balance });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
