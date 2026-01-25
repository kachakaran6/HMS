import { User } from "../models/userSchema.js";
import { catchAsyncErros } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

export const isAdminAuthenticated = catchAsyncErros(async (req, res, next) => {
  const token = req.cookies.admin_token;
  if (!token) {
    return next(new ErrorHandler("Admin not authenticated", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  if (req.user.role !== "admin") {
    return next(
      new ErrorHandler(
        "Access denied, not an admin, pehli fursat me nikal yaha se",
        403,
      ),
    );
  }
  next();
});

export const isPatientAuthenticated = catchAsyncErros(
  async (req, res, next) => {
    const token = req.cookies.user_token;
    if (!token) {
      return next(new ErrorHandler("patient not authenticated", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (
      req.user.role !== "user" &&
      req.user.role !== "patient" &&
      req.user.role !== "doctor" &&
      req.user.role !== "staff"
    ) {
      return next(
        new ErrorHandler(
          `Access denied ${req.user.role}, not a patient, pehli fursat me nikal yaha se`,
          403,
        ),
      );
    }
    next();
  },
);
