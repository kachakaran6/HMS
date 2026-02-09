import { response } from "express";
import { Message } from "../models/messageSchema.js";
import { catchAsyncErros } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { sendTelegramLog } from "../utils/telegramLogger.js";

export const sendMessage = catchAsyncErros(async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;
  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }
  await Message.create({
    firstName,
    lastName,
    email,
    phone,
    message,
  });
  // 🔥 TELEGRAM LOG HERE
  await sendTelegramLog(`
━━━━━━━━━━━━━━
📩 <b>New Message Received</b>
━━━━━━━━━━━━━━

👤 Name: ${firstName} ${lastName}
📧 Email: ${email}
📱 Phone: ${phone}
💬 Message: ${message}
🕒 Time: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━
`);
  return res.status(200).json({
    success: true,
    message: "Message sent successfully",
  });
});

export const getMessages = catchAsyncErros(async (req, res, next) => {
  const messages = await Message.find({});
  return res.status(200).json({
    success: true,
    messages,
  });
});
