import User from "../models/User.js";
import jwt from "../utils/jwt.js";
import AppError from "../utils/errorHandler.js";

class AuthService {
  // verificar se email existe
  async checkIfEmailExists(email) {
    return await User.exists({ email });
  }

  // registar
  async register(userData) {
    const newUser = await User.create(userData);
    return newUser;
  }

  // login
  async login(email, password) {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new AppError("Incorrect email or password", 401);
    }

    const token = jwt.generateToken(user._id);
    user.password = undefined; // isto faz a password nao aparecer na resposta!

    return { user, token };
  }

  // Atualizar dados do utilizador
  async updateUser(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    return updatedUser;
  }
  // Apagar conta do utilizador
  async deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    await User.deleteOne({ _id: userId });

    return { message: "Account deleted" };
  }
}

export default new AuthService();
