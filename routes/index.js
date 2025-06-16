/*  
    Este ficheiro é usado para exportar todas as rotas de uma só vez.
*/

import { Router } from "express";
import userRoutes from "./userRoutes.js";
import sensorRoutes from "./sensorRoutes.js"
import communityRoutes from "./communityRoutes.js"

const router = Router();

router.use("/user", userRoutes);
router.use("/sensors", sensorRoutes);
router.use("/communities", communityRoutes);

export default router;
