import express from "express";
import {
  registerUser,
  getUsers,
  login,
  addNewAdmin,
} from "../controller/userController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/all", getUsers);
router.post("/login", login);

router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);

export default router;
