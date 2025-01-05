import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import client from "@repo/db/client";

import { SigninSchema, SignupSchema } from "../types";
import { compare, hash } from "../scrypt";
import { JWT_PASSWORD } from "../config";

export const signup = async (req: Request, res: Response) => {
  const parsedData = SignupSchema.safeParse(req.body);
  console.log("signup", parsedData);

  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.message });
    return;
  }
  const hashedPassword = await hash(parsedData.data.password);
  try {
    const user = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
        role: parsedData.data.type === "admin" ? "Admin" : "User",
      },
    });
    console.log("user", user);
    res.json({
      userId: user.id,
    });
  } catch (error) {
    console.error("Error creating user:", error); // Log detailed error
    res.status(400).json({ message: "User already exsists" });
    return;
  }
};
export const signin = async (req: Request, res: Response) => {
  const parsedData = SigninSchema.safeParse(req.body);
  console.log("signin", parsedData);
  if (!parsedData.success) {
    res.status(403).json({ error: parsedData.error.message });
    return;
  }

  try {
    const user = await client.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });
    console.log("user", user);
    
  
    if (!user) {
      res.status(403).json({ message: "Invalid credentials" });
      return;
    }
    const isMatch = await compare(parsedData.data.password, user.password);
    if (!isMatch) {
      res.status(403).json({ message: "Invalid credentials" });
      return;
    }
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_PASSWORD
    );    
    console.log("token", token);
    
    res.json({ token: token });
  } catch (error) {
    res.status(400).json({ message: "Internal server error" });
    return;
  }
};
