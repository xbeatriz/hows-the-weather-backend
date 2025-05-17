import authService from "../services/authService.js";
import AppError from "../utils/errorHandler.js";

class AuthController {
  async register(req, res, next) {
    try {
      const existingUser = await authService.checkIfEmailExists(req.body.email);
      if (existingUser) {
        return next(new AppError("Email already in use", 400));
      }
      const newUser = await authService.register(req.body);

      res.status(201).json({
        status: "success",
        data: { user: newUser },
      });
    } catch (error) {
      next(error); // next error pq assim reencaminha para o middleware de errors
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);

      res.status(200).json({
        status: "success",
        token,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  // Method to get the logged-in user's data
  async getUser(req, res, next) {
    try {
      const user = req.user; // esta no request para middleware
      res.status(200).json({
        status: "success",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  // Atualizar dados do utilizador
  async updateMe(req, res, next) {
    try {
      const user = req.user;
      const updatedUser = await authService.updateUser(user._id, req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async deleteMe(req, res, next) {
    try {
      const user = req.user;
      const result = await authService.deleteUser(user._id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
