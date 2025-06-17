import dotenv from "dotenv";
import express from "express";
// Load environment variables
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

// Import routes from the index.js file in the routes folder
import routes from "./routes/index.js";

import errorHandler from "./middleware/errorMiddleware.js";

import "./cron/sensorCron.js";

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

connectDB();

// ROTAS
app.use("/api", routes);

// Rota Inicial
app.get("/", (req, res) => {
  res.send("Hello Sensors API!");
});

// Error handling middleware (deve sempre vir em ultimo, isto é a ultima coisa a ser chamada)
// a colocar deve ser mais detalhado
// quando simples deve estar aqui
// a tar fora deve ter o traatamento de varias respostas tipo templates para a resposta (400, 402.......)
app.use(errorHandler);

// Swagger setup
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});
