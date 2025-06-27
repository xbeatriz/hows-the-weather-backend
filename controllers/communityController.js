import Community from "../models/Community.js";
import {AppError} from "../utils/errorHandler.js";
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
        message: "Comunidade criada com sucesso",
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
        message: "Lista de comunidades a correr: OK",
        results: communities.length,
        data: { communities },
      });
    } catch (error) {
      console.error("Erro em getAllCommunities:", error);
      next(error);
    }
  }

  // GET /communities/:id/posts - listar posts aprovados de uma comunidadeAdd commentMore actions
  async getCommunityPosts(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalido", 400));
      }
      const community = await Community.findById(id);
      if (!community) {
        return next(new AppError("Valor não encontrado", 404));
      }

      const approvedPosts = community.community_posts.filter(
        (post) => post.status === "approved"
      );

      res.status(200).json({
        message: "Lista de posts a correr",
        data: approvedPosts,
      });
    } catch (error) {
      next(error);
    }
  }
async increasePostLikes(req, res, next) {
  try {
    // CORREÇÃO AQUI ⬇
    const { community_id: communityId, post_id: postId } = req.params;
    const { user_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return next(new AppError("ID da comunidade inválido", 400));
    }
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return next(new AppError("ID do post inválido", 400));
    }
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return next(new AppError("ID do utilizador inválido", 400));
    }

    const community = await Community.findById(communityId);
    if (!community) {
      return next(new AppError("Comunidade não encontrada", 404));
    }

    // usa post_id e não _id
    const post = community.community_posts.find(
      (p) => p.post_id.toString() === postId
    );

    if (!post) {
      return next(new AppError("Publicação não encontrada", 404));
    }

    if (post.likes.includes(user_id)) {
      return next(new AppError("Já deste like nesta publicação.", 400));
    }

    post.likes.push(user_id);
    await community.save();

    res.status(200).json({ message: "Like adicionado com sucesso", post });
  } catch (err) {
    next(err);
  }
}


  async getCommunityById(req, res, next) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalido", 400));
      }

      const community = await Community.findById(id);
      if (!community) {
        return next(new AppError("Valor não encontrado", 404));
      }

      res.status(200).json({
        message: "Comunidade: OK",
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
        return next(new AppError("Invalido", 400));
      }

      const updatedCommunity = await Community.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedCommunity) {
        return next(new AppError("Valor não encontrado", 404));
      }

      res.status(200).json({
        message: "Comunidade atualizada",
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
        return next(new AppError("Invalido", 400));
      }
      const deletedCommunity = await Community.findByIdAndDelete(id);
      if (!deletedCommunity) {
        return next(new AppError("Valor não encontrado", 404));
      }
      res.status(200).json({
        message: "Comunidade eliminada com sucesso",
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
        user_id,
        sensor_id,
        description,
        media,
        timestamp,
        tags,
      } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("ID de comunidade inválido", 400));
      }

      if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
        return next(new AppError("user_id inválido ou em falta", 400));
      }

      if (!description) {
        return next(new AppError("Descrição é obrigatória", 400));
      }

      if (!timestamp) {
        return next(new AppError("Timestamp é obrigatório", 400));
      }

      const community = await Community.findById(id);
      if (!community) {
        return next(new AppError("Comunidade não encontrada", 404));
      }

      //Força o status para "waiting" sempre
      const finalStatus = "waiting";
      const newPostId = new mongoose.Types.ObjectId();

      community.community_posts.push({
        post_id: newPostId,
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
    const { id: community_id, post_id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(community_id) ||
      !mongoose.Types.ObjectId.isValid(post_id)
    ) {
      return next(new AppError("Invalid ID(s)", 400));
    }

    if (req.user.role !== "admin") {
      return next(new AppError("Não autorizado. Apenas administradores podem aprovar posts.", 403));
    }

    const community = await Community.findById(community_id);
    if (!community) {
      return next(new AppError("Comunidade não encontrada", 404));
    }

    const post = community.community_posts.find(
      (p) => p.post_id.toString() === post_id
    );

    if (!post) {
      return next(new AppError("Post não encontrado", 404));
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


  // DELETE /communities/:id/posts/:post_id - apagar post (normal user ou admin)
  async deleteCommunityPost(req, res, next) {
    try {
      const { id, post_id } = req.params;
      if (
        !mongoose.Types.ObjectId.isValid(id) ||
        !mongoose.Types.ObjectId.isValid(post_id)
      ) {
        return next(new AppError("ID(s) inválido(s)", 400));
      }

      const community = await Community.findById(id);
      if (!community) {
        return next(new AppError("Comunidade não encontrada", 404));
      }

      const postIndex = community.community_posts.findIndex(
        (post) => post.post_id.toString() === post_id
      );

      if (postIndex === -1) {
        return next(new AppError("Post não encontrado", 404));
      }

      // TODO: verificar se o user tem permissão para apagar o post
      // Exemplo: só admin ou dono do post

      community.community_posts.splice(postIndex, 1);
      await community.save();

      res.status(200).json({
        message: "Post eliminado com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CommunityController();
