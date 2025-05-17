import express from "express";
import authController from "../controllers/authController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/me", protect, authController.getUser);

router.patch("/me", protect, authController.updateMe);

router.delete("/me", protect, authController.deleteMe);

export default router;
