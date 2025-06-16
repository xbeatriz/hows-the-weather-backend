// backend/controllers/notificationsController.js

import Sensor from "../models/Sensor.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { addNotification } from "../utils/notificationsMemory.js";

export async function processUserNotifications(user) {
  // 1. Buscar sensores da localização do user
  const sensors = await Sensor.find({ location: user.location });
  if (!sensors.length) return;

  // 2. Buscar últimas leituras dos sensores (exemplo genérico)
  const sensorReadings = sensors.map(sensor => sensor.lastReading); // Ajustar conforme modelo

  // 3. Para cada config do user, verificar alertas e enviar notificações
  for (const config of user.configs || []) {
    // Filtra sensores pela localização do config (se existir)
    const filteredSensors = config.location
      ? sensors.filter(s => s.location === config.location)
      : sensors;

    if (!filteredSensors.length) continue;

    // Verificar se alguma leitura está fora dos thresholds
    let alertTriggered = false;
    let alertMessages = [];

    filteredSensors.forEach(sensor => {
      const reading = sensor.lastReading; // supor que existe este campo com dados {temperature, humidity, gas}

      if (!reading) return;

      const t = reading.temperature;
      const h = reading.humidity;
      const g = reading.gas;

      if (config.alert_thresholds.temperature) {
        if (t < config.alert_thresholds.temperature.min || t > config.alert_thresholds.temperature.max) {
          alertTriggered = true;
          alertMessages.push(`Temperature out of range: ${t}`);
        }
      }
      if (config.alert_thresholds.humidity) {
        if (h < config.alert_thresholds.humidity.min || h > config.alert_thresholds.humidity.max) {
          alertTriggered = true;
          alertMessages.push(`Humidity out of range: ${h}`);
        }
      }
      if (config.alert_thresholds.gas) {
        if (g < config.alert_thresholds.gas.min || g > config.alert_thresholds.gas.max) {
          alertTriggered = true;
          alertMessages.push(`Gas level out of range: ${g}`);
        }
      }
    });

    if (alertTriggered) {
      const notificationContent = alertMessages.join("; ");

      if (config.notification_type === "email") {
        await sendEmail(user.email, "Alerta de sensor", `<p>${notificationContent}</p>`);
      } else if (config.notification_type === "app") {
        addNotification({
          userId: user._id,
          message: notificationContent,
          date: new Date(),
        });
      }
    }
  }
}
