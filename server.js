import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

// ⚠️ Evita que o cron execute durante os testes
if (process.env.NODE_ENV !== "test") {
  import("./cron/sensorCron.js");
}

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
      console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
  }
};

startServer();
