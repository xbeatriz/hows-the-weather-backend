import Sensor from "../models/Sensor.js";
import AppError from "../utils/errorHandler.js";

class SensorService {
  async createSensor(sensorData) {
    return await Sensor.create(sensorData);
  }

  async getAllSensors() {
    return await Sensor.find();
  }

  async getSensorById(sensorId) {
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) throw new AppError("Sensor not found", 404);
    return sensor;
  }

  async updateSensor(sensorId, updateData) {
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) throw new AppError("Sensor not found", 404);

    return await Sensor.findByIdAndUpdate(sensorId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteSensor(sensorId) {
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) throw new AppError("Sensor not found", 404);

    await Sensor.deleteOne({ _id: sensorId });
    return { message: "Sensor deleted" };
  }
}

export default new SensorService();
