import express from "express";
const router = express.Router();
import { RegisterUser, LoginUser } from "../controllers/user.controller.js";

router.route("/register").post(RegisterUser);
router.route("/login").post(LoginUser);

export default router;
