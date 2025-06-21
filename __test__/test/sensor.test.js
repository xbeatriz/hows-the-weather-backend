import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../app.js";
import User from "../../models/User.js";
import Sensor from "../../models/Sensor.js";
import jwt from "../../utils/jwt.js";

let mongoServer;
let adminToken;
let adminUser;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Sensor.deleteMany();
  await User.deleteMany();

  adminUser = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin1234!",
    role: "admin",
    isVerified: true,
  });

  adminToken = jwt.generateAuthToken(adminUser._id, "admin");
});

describe("Sensor API", () => {
  let createdSensorId;

  it("deve criar um novo sensor (POST /api/sensors)", async () => {
    const newSensor = {
      type: "temperature",
      location: "Lisboa",
      status: "active",
      update_frequency: "hours",
    };

    const res = await request(app)
      .post("/api/sensors")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newSensor);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Sensor criado com sucesso");
    expect(res.body.data.sensor).toHaveProperty("_id");

    createdSensorId = res.body.data.sensor._id;
  });

  it("deve listar todos os sensores (GET /api/sensors)", async () => {
    const res = await request(app).get("/api/sensors");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.sensors)).toBe(true);
  });

  it("deve obter um sensor por ID (GET /api/sensors/:id)", async () => {
    const sensor = await Sensor.create({
      type: "humidity",
      location: "Porto",
      status: "active",
      update_frequency: "hours",
    });

    const res = await request(app)
      .get(`/api/sensors/${sensor._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.sensor.location).toBe("Porto");
  });

  it("deve atualizar um sensor (PATCH /api/sensors/:id)", async () => {
    const sensor = await Sensor.create({
      type: "gas",
      location: "Coimbra",
      status: "inative",
      update_frequency: "diary",
    });

    const res = await request(app)
      .patch(`/api/sensors/${sensor._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "active" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.sensor.status).toBe("active");
  });

  it("deve eliminar um sensor (DELETE /api/sensors/:id)", async () => {
    const sensor = await Sensor.create({
      type: "gas",
      location: "Faro",
      status: "error",
      update_frequency: "minutes",
    });

    const res = await request(app)
      .delete(`/api/sensors/${sensor._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Sensor eliminado com sucesso");
  });

  it("deve retornar 401 se não houver token (POST /api/sensors)", async () => {
    const res = await request(app).post("/api/sensors").send({
      type: "temperature",
      location: "Lisboa",
      status: "active",
      update_frequency: "hours",
    });

    expect(res.statusCode).toBe(401);
  });

  it("deve retornar 403 se não for admin (POST /api/sensors)", async () => {
    const normalUser = await User.create({
      name: "Normal User",
      email: "user@example.com",
      password: "User1234!",
      role: "user",
      isVerified: true,
    });

    const userToken = jwt.generateAuthToken(normalUser._id, "user");

    const res = await request(app)
      .post("/api/sensors")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        type: "humidity",
        location: "Braga",
        status: "active",
        update_frequency: "diary",
      });

    expect(res.statusCode).toBe(403);
  });
});
