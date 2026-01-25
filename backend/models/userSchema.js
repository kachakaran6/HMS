import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwtTokens.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First name must be at least 3 characters long"],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "Last name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      minLength: [10, "Phone number must be at least 10 digits long"],
      maxLength: [15, "Phone number cannot exceed 15 digits"],
      validate: [validator.isMobilePhone, "Please enter a valid phone number"],
    },
    patientId: {
      type: String,
      minLength: [15, "Patient ID must be at least 15 characters long!"],
      // required:true
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["patient", "admin", "doctor", "staff"],
      default: "patient",
    },
    doctorDepartment: {
      type: String,
    },
    docAvatar: {
      public_id: String,
      url: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("user", userSchema);
