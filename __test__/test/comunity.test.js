import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";
import Community from "../../models/Community.js";
import jwt from "../../utils/jwt.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
  await Community.deleteMany();
});

describe("Community API", () => {
  let adminUser, regularUser, adminToken, userToken, communityId, postId;

  beforeEach(async () => {
    adminUser = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "Admin1234!",
      role: "admin",
      isVerified: true,
    });

    regularUser = await User.create({
      name: "User",
      email: "user@example.com",
      password: "User1234!",
      role: "user",
      isVerified: true,
    });

    // Geração dos tokens passando role para o payload
    adminToken = jwt.generateAuthToken(adminUser._id.toString(), adminUser.role);
    userToken = jwt.generateAuthToken(regularUser._id.toString(), regularUser.role);

    const community = await Community.create({
      location: "Test City",
      members_count: 1,
    });
    communityId = community._id.toString();

    const newPostId = new mongoose.Types.ObjectId();
    community.community_posts.push({
      post_id: newPostId,
      user_id: regularUser._id,
      sensor_id: null,
      description: "Post de teste",
      media: [],
      timestamp: new Date(),
      tags: ["teste"],
      status: "waiting",
      likes: [],
    });
    await community.save();
    postId = newPostId.toString();
  });

  it("deve criar uma nova comunidade", async () => {
    const res = await request(app)
      .post("/api/communities")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ location: "New Place" });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.location).toBe("New Place");
  });

  it("deve obter todas as comunidades", async () => {
    const res = await request(app)
      .get("/api/communities")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.communities)).toBe(true);
  });

  it("deve buscar uma comunidade por ID", async () => {
    const res = await request(app)
      .get(`/api/communities/${communityId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(communityId);
  });

  it("deve atualizar uma comunidade", async () => {
    const res = await request(app)
      .patch(`/api/communities/${communityId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ members_count: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.members_count).toBe(5);
  });

  it("deve criar um post", async () => {
    const res = await request(app)
      .post(`/api/communities/${communityId}/posts`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        user_id: regularUser._id,
        description: "Novo post",
        timestamp: new Date(),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toContain("aguarda aprovação");
  });

  it("deve aprovar um post como admin", async () => {
    await Community.findByIdAndUpdate(communityId, {
      $set: { "community_posts.0.status": "waiting" },
    });

    const res = await request(app)
      .patch(`/api/communities/${communityId}/posts/${postId}/approve`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain("Post aprovado");
  });

  it("deve fazer like num post", async () => {
    await Community.findByIdAndUpdate(communityId, {
      $set: { "community_posts.0.status": "approved" },
    });

    const res = await request(app)
      .patch(`/api/communities/${communityId}/posts/${postId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ user_id: regularUser._id.toString() });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Like adicionado com sucesso");
  });

  it("deve retornar posts aprovados da comunidade", async () => {
    await Community.findByIdAndUpdate(communityId, {
      $set: { "community_posts.0.status": "approved" },
    });

    const res = await request(app)
      .get(`/api/communities/${communityId}/posts`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("deve eliminar um post", async () => {
    const res = await request(app)
      .delete(`/api/communities/${communityId}/posts/${postId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Post eliminado com sucesso");
  });

  it("deve eliminar a comunidade", async () => {
    const res = await request(app)
      .delete(`/api/communities/${communityId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Comunidade eliminada com sucesso");
  });
});
