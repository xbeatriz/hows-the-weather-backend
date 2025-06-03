import cron from "node-cron";
import Sensor from "../models/Sensor.js";

// Executa a cada minuto
cron.schedule("0 * * * *", async () => {
  console.log("🔁 Rodando cron para atualizar sensores ativos...");

  try {
    const sensors = await Sensor.find({ status: "active" });

    for (const sensor of sensors) {
      const value = Math.floor(Math.random() * 100);
      const now = new Date();

      const newReading = {
        timestamp: now,
        values: {
          [sensor.type]: value,
        },
      };

      sensor.last_reading = newReading;
      sensor.readings.push(newReading);
      await sensor.save();

      console.log(`✅ Sensor ${sensor._id} atualizado.`);
    }
  } catch (err) {
    console.error("❌ Erro ao atualizar sensores:", err.message);
  }
});
