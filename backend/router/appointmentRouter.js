import express from "express";
import {
  bookAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from "../controller/appointmentController.js";
import { isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/book", isPatientAuthenticated, bookAppointment);
router.get("/all", isPatientAuthenticated, getAppointments);
router.put("update/:id", isPatientAuthenticated, updateAppointment);
router.delete("/delete/:id", isPatientAuthenticated, deleteAppointment);

export default router;
