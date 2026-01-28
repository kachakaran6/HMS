import crypto from "crypto";
// import Userrom "../models/User.js";
import { User } from "../models/userSchema.js";
import { sendEmailOTP } from "../utils/sendEmailOTP.js";

// SEND OTP
export const sendOTP = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  user.emailOTP = hashedOTP;
  user.emailOTPExpire = Date.now() + 5 * 60 * 1000;
  await user.save();

  await sendEmailOTP(email, otp);

  res.json({ success: true, message: "OTP sent to email" });
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  if (user.emailOTP !== hashedOTP || user.emailOTPExpire < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.emailOTP = undefined;
  user.emailOTPExpire = undefined;
  user.emailVerified = true;
  await user.save();

  res.json({ success: true, message: "OTP verified" });
};
