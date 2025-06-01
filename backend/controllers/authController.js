
import User from "../models/User.js";
import jwt from "../utils/jwt.js";
import AppError from "../utils/errorHandler.js";

class AuthController {
  // Registar
  async register(req, res, next) {
    try {
      const emailExists = await User.exists({ email: req.body.email });
      if (emailExists) {
        return next(new AppError("Email already in use", 400));
      }
      const user = await User.create(req.body);
      res.status(201).json({ message: "Account created", data: { user } });
    } catch (err) {
      next(err);
    }
  }

  // Login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+password");
      if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
      }
      const token = jwt.generateToken(user._id);
      user.password = undefined;
      res.status(200).json({ token, data: { user } });
    } catch (err) {
      next(err);
    }
  }

  // Dados do utilizador autenticado
  async getMe(req, res, next) {
    try {
      res.status(200).json(req.user);
    } catch (err) {
      next(err);
    }
  }

  // Atualizar dados próprios
  async updateMe(req, res, next) {
    try {
      const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  // Apagar conta própria
  async deleteMe(req, res, next) {
    try {
      await User.findByIdAndDelete(req.user._id);
      res.status(200).json({ message: "Account deleted" });
    } catch (err) {
      next(err);
    }
  }

  // Obter todos os utilizadores (admin)
  async getAllUsers(req, res, next) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

  // Obter utilizador por ID (admin)
  async getUserById(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return next(new AppError("not found", 404));
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  // Atualizar utilizador por ID (admin)
  async updateUserById(req, res, next) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!user) return next(new AppError("not found", 404));
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  // Apagar utilizador por ID (admin)
  async deleteUserById(req, res, next) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return next(new AppError("User not found", 404));
      res.status(200).json({ message: "User deleted with success." });
    } catch (err) {
      next(err);
    }
  }

  // Obter configs do utilizador autenticado
  async getConfigs(req, res, next) {
    try {
      const { configs } = req.user;
      if (!configs || configs.length === 0) {
        return res.status(204).json({ message: "no data" });
      }
      res.status(200).json({ configs });
    } catch (err) {
      next(err);
    }
  }

  // Atualizar configs do utilizador autenticado
  async updateConfigs(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return next(new AppError("User not found", 404));
      user.configs = req.body.configs;
      await user.save();
      res.status(200).json(user.configs);
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
