import express from "express";
import {
  registerUser,
  getUsers,
  login,
  addNewAdmin,
  getDoctors,
  logoutAdmin,
  logoutUser,
  addNewDoctor,
  getUserDetails,
  updateDoctor,
  deleteDoctor,
  updateUser,
  deleteUser,
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
  isDoctorAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();
/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user (Patient / Doctor)
 *     tags: [User]
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
 *               - password
 *               - phone
 *               - dob
 *               - gender
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               dob:
 *                 type: string
 *               gender:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post("/register", registerUser);
/**
 * @swagger
 * /api/v1/user/all:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 */
router.get("/all", getUsers);

/**
 * @swagger
 * /api/v1/user/allDoc:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: List of doctors
 */
router.get("/allDoc", getDoctors);

/**
 * @swagger
 * /api/v1/user/admin/addnew:
 *   post:
 *     summary: Add new admin (Admin only)
 *     tags: [Admin]
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
 *               - patientId
 *               - dob
 *               - gender
 *               - password
 *     responses:
 *       200:
 *         description: New admin registered
 *       401:
 *         description: Unauthorized
 */
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);

// router.get("/patient/me", isPatientAuthenticated, getUsers);

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Login user or admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", login);

router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
/**
 * @swagger
 * /api/v1/user/doctor/addnew:
 *   post:
 *     summary: Add new doctor with avatar (Admin only)
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - docAvatar
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - password
 *               - gender
 *               - dob
 *               - patientId
 *               - doctorDepartment
 *             properties:
 *               docAvatar:
 *                 type: string
 *                 format: binary
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               gender:
 *                 type: string
 *               dob:
 *                 type: string
 *               patientId:
 *                 type: string
 *               doctorDepartment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor registered successfully
 */
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);

router.put("/doctor/update/:id", isAdminAuthenticated, updateDoctor);
router.delete("/doctor/delete/:id", isAdminAuthenticated, deleteDoctor);

router.put("/user/update/:id", isAdminAuthenticated, updateUser);
router.delete("/user/delete/:id", isAdminAuthenticated, deleteUser);

/**
 * @swagger
 * /api/v1/user/adminLogout:
 *   post:
 *     summary: Logout admin
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Admin logged out
 */
router.post("/adminLogout", logoutAdmin);

/**
 * @swagger
 * /api/v1/user/userLogout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out
 */
router.post("/userLogout", logoutUser);

router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/doctor/me", isDoctorAuthenticated, getUserDetails);
router.get("/all", getUsers);

export default router;
