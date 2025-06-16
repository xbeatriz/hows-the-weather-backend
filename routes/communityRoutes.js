import express from "express";
import CommunityController from "../controllers/communityController.js";
import { protect, checkAdminToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);


// USER
router.get("/:id", CommunityController.getCommunityById);
router.get("/:id/posts", CommunityController.getCommunityPosts);
router.post("/:id/posts", CommunityController.createCommunityPost);
router.delete("/:id/posts/:post_id", CommunityController.deleteCommunityPost);

router.get("/", CommunityController.getAllCommunities);

// ADMIN
router.post("/", checkAdminToken, CommunityController.createCommunity);
router.patch("/:id", checkAdminToken, CommunityController.updateCommunity);
router.delete("/:id", checkAdminToken, CommunityController.deleteCommunity);
router.patch("/:id/posts/:post_id/approve", checkAdminToken, CommunityController.approveCommunityPost);


export default router;
