import { User } from "../models/userSchema.js";
import { catchAsyncErros } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

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

  await User.create({
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
  return res.status(200).json({
    success: true,
    message: "User Created successfully",
  });
});

export const getUsers = catchAsyncErros(async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json({
    success: true,
    users,
  });
});
