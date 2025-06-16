import mongoose from "mongoose";
const readingSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
  },
  values: {
    temperature: Number,
    humidity: Number,
    gas: Number,
  },
}, { _id: false });
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
    type: readingSchema,
    default: null,
  },
  readings: {
    type: [readingSchema], // lista de leituras
    default: [],
  },
});

const Sensor = mongoose.model("Sensor", sensorSchema);

export default Sensor;
