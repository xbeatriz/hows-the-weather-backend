import express from "express";
import authController from "../controllers/authController.js";
import { protect, checkAdminToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth
router.post("/register", authController.register);
router.post("/login", authController.login);

// User 
router.get("/me", protect, authController.getMe);
router.patch("/me", protect, authController.updateMe);
router.delete("/me", protect, authController.deleteMe);

router.get("/me/configs", protect, authController.getConfigs);
router.patch("/me/configs", protect, authController.updateConfigs);

// Admin
router.get("/", protect, checkAdminToken, authController.getAllUsers);
router.get("/:id", protect, checkAdminToken, authController.getUserById);
router.patch("/:id", protect, checkAdminToken, authController.updateUserById);
router.delete("/:id", protect, checkAdminToken, authController.deleteUserById);

export default router;
