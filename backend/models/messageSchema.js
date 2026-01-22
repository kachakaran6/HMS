import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema(
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
    message: {
      type: String,
      minLength: [10, "Message must be at least 10 characters long!"],
      // required:true
    },
  },
  {
    timestamps: true,
  },
);

export const Message = mongoose.model("Message", messageSchema);
