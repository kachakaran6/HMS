import express from "express";
import {
  resetPassword,
  sendOTP,
  verifyOTP,
} from "../controller/otpController.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/rest-password", resetPassword);

export default router;
