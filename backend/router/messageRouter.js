import express from "express";
import { getMessages, sendMessage } from "../controller/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/message/send:
 *   post:
 *     summary: Send a contact message
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - message
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               message:
 *                 type: string
 *                 example: I want to book an appointment
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Validation error
 */
router.post("/send", sendMessage);

/**
 * @swagger
 * /api/v1/message/all:
 *   get:
 *     summary: Get all messages (Admin only)
 *     tags: [Message]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of messages
 *       401:
 *         description: Unauthorized
 */
router.get("/all", isAdminAuthenticated, getMessages);

export default router;
