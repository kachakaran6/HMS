import express from "express";
import { registerUser, getUsers, login } from "../controller/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/all", getUsers);
router.post("/login", login);
export default router;
