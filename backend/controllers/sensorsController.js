import sensorService from "../services/sensorService.js";
import AppError from "../utils/errorHandler.js";

class sensorController {
  async createSensor(req, res, next) {
    try {
      const newSensor = await sensorService.createSensor(req.body);
      res.status(201).json({
        status: "success",
        data: { sensor: newSensor },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllSensors(req, res, next) {
    try {
      const sensors = await sensorService.getAllSensors();
      res.status(200).json({
        status: "success",
        results: sensors.length,
        data: { sensors },
      });
    } catch (error) {
      next(error);
    }
  }

  async getSensorById(req, res, next) {
    try {
      const sensor = await sensorService.getSensorById(req.params.id);
      if (!sensor) {
        return next(new AppError("Sensor not found", 404));
      }

      res.status(200).json({
        status: "success",
        data: { sensor },
      });
    } catch (error) {
      next(error);
    }
  }
  async updateSensor(req, res, next) {
    try {
      const updatedSensor = await sensorService.updateSensor(
        req.params.id,
        req.body
      );
      if (!updatedSensor) {
        return next(new AppError("Sensor not found", 404));
      }

      res.status(200).json({
        status: "success",
        data: { sensor: updatedSensor },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSensor(req, res, next) {
    try {
      const deleted = await sensorService.deleteSensor(req.params.id);
      if (!deleted) {
        return next(new AppError("Sensor not found", 404));
      }

      res.status(204).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }
}
export default new sensorController();
