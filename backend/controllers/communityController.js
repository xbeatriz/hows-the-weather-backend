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
      // Aqui poderia verificar se user é admin, mas assumi que já tem middleware auth
      const communities = await Community.find();
      res.status(200).json({
        message: "List with communities running: OK",
        data: communities,
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

  // POST /communities/:id/posts - criar post na comunidade (normal user)
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
        status,
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

      if (!["waiting", "approved", "rejected"].includes(status)) {
        return next(new AppError("Invalid status", 400));
      }

      const community = await Community.findById(id);
      if (!community) {
        return next(new AppError("Value not found", 404));
      }

      // Adiciona o novo post ao array community_posts
      community.community_posts.push({
        post_id,
        user_id,
        sensor_id,
        description,
        media: media || [],
        timestamp,
        tags: tags || [],
        status,
        likes: 0,
      });

      await community.save();

      res.status(201).json({
        message: "POST DONE, WAITING FOR APROVING.",
        data: community.community_posts.slice(-1)[0], // último post criado
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
