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
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/all", getUsers);
router.get("/allDoc", isAdminAuthenticated, getDoctors);

router.get("/admin/me", isAdminAuthenticated, getUsers);
router.get("/patient/me", isPatientAuthenticated, getUsers);
router.post("/login", login);

router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);

router.post("/adminLogout", logoutAdmin);
router.post("/userLogout", logoutUser);

export default router;
