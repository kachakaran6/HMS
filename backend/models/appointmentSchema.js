import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema(
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
    appointment_date: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    doctor: {
      firstname: {
        type: String,
      },
      lastName: {
        type: String,
      },
    },
    has_visited: {
      type: Boolean,
      default: false,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
