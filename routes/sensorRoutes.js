import express from "express";
import sensorController from "../controllers/sensorsController.js";
import {protect,checkAdminToken} from "../middleware/authMiddleware.js";


const router = express.Router();

// router.use(protect);

// Criar um novo sensor
router.post("/", protect, checkAdminToken, sensorController.createSensor);
// Listar todos os sensores
router.get("/", protect, checkAdminToken, sensorController.getAllSensors);

// Obter um sensor por ID
router.get("/:id", protect, checkAdminToken, sensorController.getSensorById);

// Atualizar um sensor por ID
router.patch("/:id", protect, checkAdminToken, sensorController.updateSensor);

// Deletar um sensor por ID
router.delete("/:id", protect,checkAdminToken, sensorController.deleteSensor);

export default router;
