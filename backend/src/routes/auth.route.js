import express from "express";
const router = express.Router();

import {login, logout, registerUser} from "../controllers/auth.controller.js"

router.post("/register",registerUser);
router.post("/login",login);
router.get("/logout",logout);

export default router;