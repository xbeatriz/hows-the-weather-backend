import express from "express";
import userController from "../controllers/userController.js";
import { protect, checkAdminToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth
router.post("/register", userController.register);
router.post("/login", userController.login);

// User 
router.get("/me", protect, userController.getMe);
router.patch("/me", protect, userController.updateMe);
router.delete("/me", protect, userController.deleteMe);
router.get('/verify-email/:token', userController.verifyEmail);

router.get("/me/configs", protect, userController.getConfigs);
router.patch("/me/configs", protect, userController.updateConfigs);

// Admin
router.get("/", protect, checkAdminToken, userController.getAllUsers);
router.get("/:id", protect, checkAdminToken, userController.getUserById);
router.patch("/:id", protect, checkAdminToken, userController.updateUserById);
router.delete("/:id", protect, checkAdminToken, userController.deleteUserById);

export default router;
