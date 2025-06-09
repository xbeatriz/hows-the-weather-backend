import User from "../models/User.js";
import jwt from "../utils/jwt.js";
import AppError from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwtLib from "jsonwebtoken";

class userController {
  // Registar
  async register(req, res, next) {
    try {
      const emailExists = await User.exists({ email: req.body.email });
      if (emailExists) {
        return next(new AppError("Email already in use", 400));
      }

      const user = await User.create(req.body);

      // gerar token de verificação
      const verificationToken = jwtLib.sign(
        { userId: user._id },
        process.env.EMAIL_VERIFICATION_SECRET,
        { expiresIn: "1d" }
      );

      const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

      const html = `
        <h2>Olá ${user.name}</h2>
        <p>Confirma o teu email clicando no link abaixo:</p>
        <a href="${verificationLink}">Verificar Email</a>
      `;

      await sendEmail(user.email, "Verifica o teu e-mail", html);

      res
        .status(201)
        .json({ message: "Account created. Please verify your email." });
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

      if (!user.isVerified) {
        return next(
          new AppError("Please verify your email before logging in", 401)
        );
      }

      const token = jwt.generateToken(user._id);
      user.password = undefined;
      res.status(200).json({ token, data: { user } });
    } catch (err) {
      next(err);
    }
  }

  // Verificar email
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;
      const decoded = jwtLib.verify(
        token,
        process.env.EMAIL_VERIFICATION_SECRET
      );

      const user = await User.findById(decoded.userId).select("+password");
      if (!user) return next(new AppError("User not found", 404));

      if (user.isVerified) {
        return res.status(400).json({ message: "Email already verified." });
      }

      user.isVerified = true;
      await user.save();

      // login automático após verificação
      const jwtToken = jwt.generateToken(user._id);
      user.password = undefined;

      res.status(200).json({
        message: "Email verified successfully. You are now logged in.",
        token: jwtToken,
        data: { user },
      });
    } catch (err) {
      next(new AppError("Invalid or expired verification link", 400));
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
      const updates = req.body;
      const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
      });
      res.status(200).json({ message: "User updated", data: { user } });
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
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
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

export default new userController();
