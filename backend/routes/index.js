/*  
    Este ficheiro é usado para exportar todas as rotas de uma só vez.
*/

import { Router } from "express";
import authRoutes from "./authRoutes.js";
import sensorRoutes from "./sensorRoutes.js"

const router = Router();

router.use("/auth", authRoutes);
router.use("/sensors", sensorRoutes);

export default router;
