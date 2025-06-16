import User from "../models/User.js";
import jwt from "../utils/jwt.js";
import AppError from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";

class userController {
  // Registar
  async register(req, res, next) {
    try {
      const emailExists = await User.exists({ email: req.body.email });
      if (emailExists) {
        return next(new AppError("Email already in use", 400));
      }

      const user = await User.create(req.body);

      const verificationToken = jwt.generateEmailVerificationToken(user._id);

      const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

      const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2>Olá ${user.name},</h2>
    <p>Obrigado por te registares. Por favor, confirma o teu email clicando no botão abaixo:</p>

    <p style="text-align: center; margin: 30px 0;">
      <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px;">
        Verificar Email
      </a>
    </p>

    <p>Ou copia e cola este link:</p>
  <p><code>http://localhost:5173/verify-email/</code><br /><code>${verificationToken}</code></p>

    <hr />
    <p style="font-size: 12px; color: #777;">Se não foste tu quem pediu esta verificação, ignora este email.</p>
  </div>
`;

      await sendEmail(user.email, "Verifica o teu e-mail", html);

      res
        .status(201)
        .json({ message: "Conta criada. Por favor, verifica o seu email." });
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
        return next(new AppError("Email ou senha incorretos", 401));
      }

      if (!user.isVerified) {
        return next(
          new AppError("Por favor, verifique seu email antes de entrar", 401)
        );
      }

      const token = jwt.generateAuthToken(user._id);
      const refreshToken = jwt.generateRefreshToken(user._id);

      user.password = undefined;

      res.status(200).json({
        accessToken: token,
        refreshToken,
        data:{user}
      });
    } catch (err) {
      next(err);
    }
  }

  // Verificar email
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;
      const decoded = jwt.verifyEmailVerificationToken(token);

      const user = await User.findById(decoded.userId);
      if (!user) return next(new AppError("Usuário não encontrado", 404));

      if (user.isVerified) {
        return res.status(400).json({ message: "Email já verificado." });
      }

      user.isVerified = true;
      await user.save();

      user.password = undefined;
      const authToken = jwt.generateAuthToken(user._id);

      res.status(200).json({
        message: "Email verificado com sucesso.",
        token: authToken,
        data: { user },
      });
    } catch (err) {
      next(new AppError("Link de verificação inválido ou expirado", 400));
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return next(new AppError("Refresh token não fornecido", 400));
      }

      const decoded = jwt.verifyRefreshToken(refreshToken);

      const newToken = jwt.generateAuthToken(decoded.id);

      res.status(200).json({ token: newToken });
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
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users }
    });
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
