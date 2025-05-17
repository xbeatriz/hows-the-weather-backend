import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["temperature", "humidity", "gas"],
    required: true,
  },
  location: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["active", "inative", "error"],
    required: true,
  },
  update_frequency: {
    type: String,
    enum: ["minutes", "hours", "diary"],
  },
  last_reading: {
    timestamp: {
      type: Date,
    },
    values: {
      temperature: {
        type: Number,
      },
      humidity: {
        type: Number,
      },
      gas: {
        type: Number,
      },
    },
  },
});

const Sensor = mongoose.model("Sensor", sensorSchema);

export default Sensor;
