import { catchAsyncErros } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const bookAppointment = catchAsyncErros(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  if (!req.user) {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  const doctor = await User.findOne({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "doctor",
    doctorDepartment: department,
  });

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName, // must match schema
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    patientId: req.user._id, // ✅ ObjectId
    doctorId: doctor._id,
  });

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully",
    appointment,
  });
});

export const getAppointments = catchAsyncErros(async (req, res, next) => {
  const appointements = await Appointment.find({});

  res.status(200).json({
    success: true,
    appointements,
  });
});

export const deleteAppointment = catchAsyncErros(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted Successfully",
  });
});

export const updateAppointment = catchAsyncErros(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found", 404));
  }
  const updatedAppointment = await Appointment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    appointment: updatedAppointment,
  });
});
