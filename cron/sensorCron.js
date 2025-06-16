import cron from "node-cron";
import Sensor from "../models/Sensor.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { addNotification } from "../utils/notificationsMemory.js";

// Executa a cada minuto
cron.schedule("* * * * *", async () => {
  console.log("🔁 Cron job ativo: gerar readings, verificar sensores e enviar notificações...");

  // 🔽 Função para gerar valor realista com base no tipo de sensor
  function generateSimulatedValue(type) {
    switch (type) {
      case "temperature":
        return parseFloat((Math.random() * (35 - 15) + 15).toFixed(2)); // 15–35°C
      case "humidity":
        return parseFloat((Math.random() * (70 - 30) + 30).toFixed(2)); // 30–70%
      case "gas":
        return parseFloat((Math.random() * (800 - 200) + 200).toFixed(2)); // 200–800 ppm
      default:
        return parseFloat((Math.random() * 100).toFixed(2)); // fallback
    }
  }

  try {
    const now = new Date();
    const currentMinute = now.getMinutes();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = domingo
    const currentDate = now.getDate(); // 1-31

    const sensors = await Sensor.find({ status: "active" });

    // 🆕 1. Atualizar last_reading com valor simulado
    for (const sensor of sensors) {
      const simulatedValue = generateSimulatedValue(sensor.type);

      const reading = {
        timestamp: now,
        values: {
          ...sensor.last_reading?.values,
          [sensor.type]: simulatedValue
        }
      };

      // Atualiza last_reading
      sensor.last_reading = reading;

      // Adiciona ao array de readings
      sensor.readings.push(reading);

      await sensor.save();
      console.log(`📈 Sensor ${sensor._id} (${sensor.type} - ${sensor.location}) atualizado: ${simulatedValue}`);
    }

    // 🔔 2. Verificar limites e enviar notificações
    const users = await User.find({ isVerified: true });

    for (const user of users) {
      if (!user.configs || user.configs.length === 0) continue;

      for (const config of user.configs) {
        const { forecast_range, notification_type, alert_thresholds } = config;

        // 🕒 Verificar se está na hora certa de notificar
        if (
          (forecast_range === "hour" && currentMinute !== 0) ||
          (forecast_range === "diary" && (currentHour !== 8 || currentMinute !== 0)) ||
          (forecast_range === "weekly" && (currentDay !== 1 || currentHour !== 8 || currentMinute !== 0)) ||
          (forecast_range === "monthly" && (currentDate !== 1 || currentHour !== 8 || currentMinute !== 0))
        ) {
          continue;
        }

        const location = config.location || user.location;
        const locationSensors = sensors.filter(s => s.location === location);

        for (const sensor of locationSensors) {
          const last = sensor.last_reading?.values[sensor.type];
          if (last === undefined) continue;

          const thresholds = alert_thresholds?.[sensor.type];
          if (!thresholds) continue;

          if (last < thresholds.min || last > thresholds.max) {
            const msg = `⚠️ ${sensor.type.toUpperCase()} fora dos limites (${last}) no sensor ${sensor._id} (${sensor.location})`;

            if (notification_type === "email") {
              await sendEmail(user.email, "Alerta de Sensor", `<p>${msg}</p>`);
            } else if (notification_type === "app") {
              addNotification({
                userId: user._id,
                message: msg,
                date: now,
              });
            }

            console.log(`🔔 Notificação enviada para ${user.email}: ${msg}`);
          }
        }
      }
    }

  } catch (err) {
    console.error("❌ Erro no cron de notificações:", err.message);
  }
});
