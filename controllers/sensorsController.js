import Sensor from "../models/Sensor.js";
import AppError from "../utils/errorHandler.js";

class SensorController {
  async createSensor(req, res, next) {
    try {
      const {
        type,
        location,
        status,
        update_frequency,
        last_reading,
        readings,
      } = req.body;

      if (!type) return next(new AppError("O campo Type é obrigatório.", 400));
      if (!location)
        return next(new AppError("O campo Location é obrigatório.", 400));
      if (!status)
        return next(new AppError("O campo Status é obrigatório.", 400));
      if (!update_frequency)
        return next(
          new AppError("O campo Update Frequency é obrigatório.", 400)
        );

      const newSensor = await Sensor.create({
        type,
        location,
        status,
        update_frequency,
        last_reading: null,
        readings: [],
      });
      res.status(201).json({
        status: "success",
        message: "Sensor criado com sucesso",
        data: { sensor: newSensor },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllSensors(req, res, next) {
    try {
      const sensors = await Sensor.find();
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
      const sensor = await Sensor.findById(req.params.id);
      if (!sensor) return next(new AppError("Sensor não encontrado", 404));
      res.status(200).json({
        status: "sucesso",
        data: { sensor },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSensor(req, res, next) {
    try {
      const updatedSensor = await Sensor.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedSensor)
        return next(new AppError("Sensor não encontrado", 404));

      res.status(200).json({
        status: "sucesso",
        data: { sensor: updatedSensor },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSensor(req, res, next) {
    try {
      const sensor = await Sensor.findByIdAndDelete(req.params.id);
      if (!sensor) return next(new AppError("Sensor não encontrado", 404));

      res.status(200).json({
        status: "sucesso",
        message: "Sensor eliminado com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SensorController();
