import express from "express";
import {
  bookAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isDoctorAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();
/**
 * @swagger
 * /api/v1/appointment/book:
 *   post:
 *     summary: Book an appointment (Patient only)
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - dob
 *               - gender
 *               - appointment_date
 *               - department
 *               - doctor_firstName
 *               - doctor_lastName
 *               - address
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Rahul
 *               lastName:
 *                 type: string
 *                 example: Sharma
 *               email:
 *                 type: string
 *                 example: rahul@gmail.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               dob:
 *                 type: string
 *                 example: 1999-05-12
 *               gender:
 *                 type: string
 *                 example: Male
 *               appointment_date:
 *                 type: string
 *                 example: 2026-02-01
 *               department:
 *                 type: string
 *                 example: Cardiology
 *               doctor_firstName:
 *                 type: string
 *                 example: Amit
 *               doctor_lastName:
 *                 type: string
 *                 example: Verma
 *               hasVisited:
 *                 type: boolean
 *                 example: false
 *               address:
 *                 type: string
 *                 example: Delhi, India
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Doctor not found
 */
router.post("/book", isPatientAuthenticated, bookAppointment);
/**
 * @swagger
 * /api/v1/appointment/all:
 *   get:
 *     summary: Get all appointments (Admin only)
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *       401:
 *         description: Unauthorized
 */
router.get("/all", getAppointments);
/**
 * @swagger
 * /api/v1/appointment/update/{id}:
 *   put:
 *     summary: Update appointment by ID (Admin only)
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               hasVisited: true
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *       404:
 *         description: Appointment not found
 */
router.put("/update/:id", isAdminAuthenticated, updateAppointment);
/**
 * @swagger
 * /api/v1/appointment/delete/{id}:
 *   delete:
 *     summary: Delete appointment by ID (Admin only)
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *       404:
 *         description: Appointment not found
 */
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

export default router;
