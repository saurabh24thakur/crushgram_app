import express from "express";
import { login, logout, signup, getMe } from "../controllers/auth.controller.js";
import isAuth from "../middlewares/isAuth.js";

const authRouter=express.Router();

authRouter.post("/signup",signup);
authRouter.post("/login",login);
authRouter.get("/logout",logout);
authRouter.get("/me", isAuth, getMe);

export default authRouter