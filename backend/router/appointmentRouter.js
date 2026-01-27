import express from "express";
import {
  bookAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/book", isPatientAuthenticated, bookAppointment);
router.get("/all", isAdminAuthenticated, getAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointment);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

export default router;
