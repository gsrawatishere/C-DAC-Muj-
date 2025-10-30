import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const prisma = new PrismaClient();


export const generateAccessToken = (id, res) => {
  try {
    const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: "7d",
    });
    res.cookie("accessToken", accessToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
        secure: true,
    });
    return accessToken;
  } catch (error) {
    console.error("Error in generateAccessToken Route", error);
    res.status(500).json({ msg: "Failed to Generate Access Token!" });
  }
};
