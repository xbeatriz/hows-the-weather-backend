import Community from "../models/Community.js";
import AppError from "../utils/errorHandler.js";
import mongoose from "mongoose";

class CommunityController {

  async createCommunity(req, res, next) {
    try {
      const { location, members_count } = req.body;
      if (!location) {
        return next(new AppError("Location is required", 400));
      }
      const newCommunity = await Community.create({
        location,
        members_count: members_count || 0,
        community_posts: [],
      });

      res.status(201).json({
        message: "POST DONE, WAITING FOR APROVING.",
        data: newCommunity,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllCommunities(req, res, next) {
    try {
      const communities = await Community.find();
      res.status(200).json({
        message: "List with communities running: OK",
        results: communities.length,
        data: { communities },
      });
    } catch (error) {
      console.error('Erro em getAllCommunities:', error);
      next(error);
    }
  }

  // GET /communities/:id/posts - listar posts aprovados de uma comunidadeAdd commentMore actions
  async getCommunityPosts(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid", 400));
      }
      const community = await Community.findById(id);
      if (!community) {
        return next(new AppError("Value not found", 404));
      }

      const approvedPosts = community.community_posts.filter(
        (post) => post.status === "approved"
      );

      res.status(200).json({
        message: "List of posts is running",
        data: approvedPosts,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCommunityById(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid", 400));
      }

      const community = await Community.findById(id);
      if (!community) {
        return next(new AppError("Value not found", 404));
      }

      res.status(200).json({
        message: "Community: OK",
        data: community,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCommunity(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid", 400));
      }

      const updatedCommunity = await Community.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedCommunity) {
        return next(new AppError("Value not found", 404));
      }

      res.status(200).json({
        message: "Community updated",
        data: updatedCommunity,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommunity(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid", 400));
      }
      const deletedCommunity = await Community.findByIdAndDelete(id);
      if (!deletedCommunity) {
        return next(new AppError("Value not found", 404));
      }
      res.status(200).json({
        message: "Community deleted with success",
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /communities/:id/posts - listar posts aprovados de uma comunidade
  async createCommunityPost(req, res, next) {
    try {
      const { id } = req.params;
      const {
        post_id,
        user_id,
        sensor_id,
        description,
        media,
        timestamp,
        tags,
      } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid community ID", 400));
      }

      if (!post_id || !mongoose.Types.ObjectId.isValid(post_id)) {
        return next(new AppError("Invalid or missing post_id", 400));
      }

      if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
        return next(new AppError("Invalid or missing user_id", 400));
      }

      if (!description) {
        return next(new AppError("Description is required", 400));
      }

      if (!timestamp) {
        return next(new AppError("Timestamp is required", 400));
      }

      const community = await Community.findById(id);
      if (!community) {
        return next(new AppError("Community not found", 404));
      }

      // 🚫 Força o status para "waiting" sempre
      const finalStatus = "waiting";

      community.community_posts.push({
        post_id,
        user_id,
        sensor_id,
        description,
        media: media || [],
        timestamp,
        tags: tags || [],
        status: finalStatus,
        likes: 0,
      });

      await community.save();

      res.status(201).json({
        message: "Post submetido e aguarda aprovação por um administrador.",
        data: community.community_posts.slice(-1)[0],
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /communities/:community_id/posts/:post_id/approve
  async approveCommunityPost(req, res, next) {
    try {
      const { community_id, post_id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(community_id) || !mongoose.Types.ObjectId.isValid(post_id)) {
        return next(new AppError("Invalid ID(s)", 400));
      }

      if (req.user.role !== "admin") {
        return next(new AppError("Unauthorized. Only admins can approve posts.", 403));
      }

      const community = await Community.findById(community_id);
      if (!community) {
        return next(new AppError("Community not found", 404));
      }

      const post = community.community_posts.find(
        (p) => p.post_id.toString() === post_id
      );

      if (!post) {
        return next(new AppError("Post not found", 404));
      }

      post.status = "approved";
      await community.save();

      res.status(200).json({
        message: "Post aprovado com sucesso.",
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }


  // DELETE /communities/:id/posts/:post_id - deletar post (normal user ou admin)
  async deleteCommunityPost(req, res, next) {
    try {
      const { id, post_id } = req.params;
      if (
        !mongoose.Types.ObjectId.isValid(id) ||
        !mongoose.Types.ObjectId.isValid(post_id)
      ) {
        return next(new AppError("Invalid ID(s)", 400));
      }

      const community = await Community.findById(id);
      if (!community) {
        return next(new AppError("Value not found", 404));
      }

      const postIndex = community.community_posts.findIndex(
        (post) => post.post_id.toString() === post_id
      );

      if (postIndex === -1) {
        return next(new AppError("Post not found", 404));
      }

      // TODO: verificar se o user tem permissão para deletar o post
      // Exemplo: só admin ou dono do post

      community.community_posts.splice(postIndex, 1);
      await community.save();

      res.status(200).json({
        message: "Post deleted with success",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CommunityController();
