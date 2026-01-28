import { User } from "../models/userSchema.js";
import { catchAsyncErros } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { generateToken } from "../utils/jwtTokens.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";
import cloudinary from "cloudinary";
import crypto from "crypto";
import { sendEmailOTP } from "../utils/sendEmailOTP.js";

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
});

export const login = catchAsyncErros(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password & Confirm Password Do Not Match!", 400),
    );
  }
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

  await doctor.deleteOne();

  res.status(200).json({
    success: true,
    message: "Doctor Deleted Successfully",
  });
});
