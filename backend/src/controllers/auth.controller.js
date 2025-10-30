import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";

import { generateAccessToken } from "../lib/utils.js";



// user register
export const registerUser = async (req, res) => {
  try {
    const { name, email, walletAddress, role, password } = req.body;
    console.log(req.body);

    if (!name || !email || !walletAddress || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
        data : {
            name,
            email,
            walletAddress,
            role,
            password : hashedPassword
        }

    })
    

    return res.status(200).json({
      message: "User registered successfully, Please Login.",
      user: newUser.email,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Failed to register", error: error.message });
  }
};

//login 

export const login = async (req, res) => {

  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found. Please register!" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }
    
        generateAccessToken(existingUser.id, res);
  
    return res.status(200).json({
      message: "Login successful!",
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Failed to login",
      error: error.message,
    });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    res.cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({ msg: "Logged out successfully!" });
  } catch (error) {
    console.error("Error in logout", error);
    res.status(500).json({ msg: "Error in logout", error });
  }
};