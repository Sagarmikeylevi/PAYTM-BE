import { Request, Response } from "express";
import pool from "../database/db.js";
import z from "zod";

const TransferSchema = z.object({
  amount: z.number().positive(),
});

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

export const transferMoney = async (req: Request, res: Response) => {
  try {
    // Zod validation
    const { success } = TransferSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: "Invalid Transfer Data" });
    }

    const { reciverId } = req.query;
    const { amount } = req.body;

    const senderId = req.user.userId;

    // Begin transaction
    await pool.query("BEGIN");

    // search for sender account details
    const senderAccount = await pool.query(
      "SELECT * FROM bank WHERE userId = $1",
      [senderId]
    );

    // Insufficient balance response
    if (senderAccount.rows[0].balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // search for reciver account details
    const reciverAccount = await pool.query(
      "SELECT * FROM bank WHERE userId = $1",
      [reciverId]
    );

    // Invalid account response
    if (reciverAccount.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    // deduct money from sender
    const updatedSenderBalance = await pool.query(
      "UPDATE bank SET balance = $1, update_date = CURRENT_TIMESTAMP WHERE id = $2 RETURNING balance",
      [senderAccount.rows[0].balance - amount, senderAccount.rows[0].id]
    );

    // add money to recivder
    const updatedReciverBalance = await pool.query(
      "UPDATE bank SET balance = $1, update_date = CURRENT_TIMESTAMP WHERE id = $2 RETURNING balance",
      [+reciverAccount.rows[0].balance + amount, reciverAccount.rows[0].id]
    );

    // Commit transaction
    await pool.query("COMMIT");

    // return success response
    res.status(200).json({
      message: "Transfer successful",
      updatedBalance: {
        sender: updatedSenderBalance.rows[0],
        reciver: updatedReciverBalance.rows[0],
      },
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
