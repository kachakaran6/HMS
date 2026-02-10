import { catchAsyncErros } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";
import { sendTelegramLog } from "../utils/telegramLogger.js";

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
    timeSlot,
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
    !timeSlot ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  if (!req.user) {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  // 🔎 Find doctor
  const doctor = await User.findOne({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "doctor",
    doctorDepartment: department,
  });

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  // 🚫 CHECK SLOT ALREADY BOOKED
  const existingAppointment = await Appointment.findOne({
    doctorId: doctor._id,
    appointment_date,
    timeSlot,
    status: { $ne: "Cancelled" }, // ignore cancelled
  });

  if (existingAppointment) {
    return next(
      new ErrorHandler("This slot is already booked for this doctor", 400),
    );
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
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    has_visited: hasVisited ?? false, // ✅ map correctly
    address,
    timeSlot,
    patientId: req.user._id,
    doctorId: doctor._id,
  });

  await sendTelegramLog(`
━━━━━━━━━━━━━━
📅 <b>New Appointment Booked</b>
━━━━━━━━━━━━━━

👤 <b>Patient Name:</b> ${firstName} ${lastName}
📧 <b>Email:</b> ${email}
📱 <b>Phone:</b> ${phone}
🎂 <b>DOB:</b> ${dob}
⚧ <b>Gender:</b> ${gender}
📅 <b>Appointment Date:</b> ${appointment_date}
🏥 <b>Department:</b> ${department}
👨‍⚕️ <b>Doctor:</b> Dr. ${doctor_firstName} ${doctor_lastName}
🏠 <b>Address:</b> ${address}
🕒 <b>Time Slot:</b> ${timeSlot}
🕒 <b>Time:</b> ${new Date().toLocaleString()}
━━━━━━━━━━━━━━
`);

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

  await sendTelegramLog(`
━━━━━━━━━━━━━━
❌ <b>Appointment Deleted</b>
━━━━━━━━━━━━━━

👤 <b>Patient Name:</b> ${appointment.firstName} ${appointment.lastName}
📧 <b>Email:</b> ${appointment.email}
📱 <b>Phone:</b> ${appointment.phone}
🎂 <b>DOB:</b> ${appointment.dob}
⚧ <b>Gender:</b> ${appointment.gender}
📅 <b>Appointment Date:</b> ${appointment.appointment_date}
🏥 <b>Department:</b> ${appointment.department}
👨‍⚕️ <b>Doctor:</b> Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}
🏠 <b>Address:</b> ${appointment.address}
🕒 <b>Time:</b> ${new Date().toLocaleString()}
━━━━━━━━━━━━━━
`);

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
  await sendTelegramLog(`
━━━━━━━━━━━━━━
✏️ <b>Appointment Updated</b>
━━━━━━━━━━━━━━

👤 <b>Patient Name:</b> ${updatedAppointment.firstName} ${updatedAppointment.lastName}
📧 <b>Email:</b> ${updatedAppointment.email}
📱 <b>Phone:</b> ${updatedAppointment.phone}
🎂 <b>DOB:</b> ${updatedAppointment.dob}
⚧ <b>Gender:</b> ${updatedAppointment.gender}
📅 <b>Appointment Date:</b> ${updatedAppointment.appointment_date}
🏥 <b>Department:</b> ${updatedAppointment.department}
👨‍⚕️ <b>Doctor:</b> Dr. ${updatedAppointment.doctor.firstName} ${updatedAppointment.doctor.lastName}
🏠 <b>Address:</b> ${updatedAppointment.address}
🕒 <b>Time:</b> ${new Date().toLocaleString()}
━━━━━━━━━━━━━━
`);
  res.status(200).json({
    success: true,
    appointment: updatedAppointment,
  });
});

export const getDoctorAvailability = catchAsyncErros(async (req, res, next) => {
  const { doctorId, date } = req.query;

  if (!doctorId || !date) {
    return next(new ErrorHandler("Doctor ID and date are required", 400));
  }

  // 🔎 Find all non-cancelled appointments for that doctor & date
  const appointments = await Appointment.find({
    doctorId,
    appointment_date: date, // match your schema
    status: { $ne: "Cancelled" },
  });

  // Extract booked time slots (ignore undefined for old records)
  const bookedSlots = appointments.map((a) => a.timeSlot).filter(Boolean);

  res.status(200).json({
    success: true,
    bookedSlots,
  });
});
