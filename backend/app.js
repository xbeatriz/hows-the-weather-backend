import dotenv from "dotenv";
import express from "express";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";

// Import routes from the index.js file in the routes folder
import routes from "./routes/index.js";

import errorHandler from "./middleware/errorMiddleware.js";

import "./cron/sensorCron.js";

// Load environment variables
dotenv.config();

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

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
