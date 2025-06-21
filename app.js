import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import routes from "./routes/index.js";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// ROTAS
app.use("/api", routes);

// Rota Inicial
app.get("/", (req, res) => {
  res.send("Hello Sensors API!");
});

// Error handling middleware
app.use(errorHandler);

// Swagger setup
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
