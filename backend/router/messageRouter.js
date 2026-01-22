import express from "express";
import { getMessages, sendMessage } from "../controller/messageController.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/all", getMessages);

export default router;
