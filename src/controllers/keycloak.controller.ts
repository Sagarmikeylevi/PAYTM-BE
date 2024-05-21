import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  const { username, email, firstname, lastname, password } = req.body;

  try {
    const newUser = await req.keycloakAdmin.users.create({
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
