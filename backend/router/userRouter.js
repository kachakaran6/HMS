import express from "express";
import { registerUser, getUsers } from "../controller/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/all", getUsers);

export default router;
