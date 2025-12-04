import express from "express";
import { authController } from "./auth.controller";

const router = express.Router();

//localhost:5000/auth/login...
router.post("/login", authController.loginUser);

export const authRoutes = router; //routes for auth
