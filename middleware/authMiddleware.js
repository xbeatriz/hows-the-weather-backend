import jwt from "../utils/jwt.js";
import AppError from "../utils/errorHandler.js";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    let decoded;

    // Tentar verificar o accessToken
    if (token) {
      try {
        decoded = jwt.verifyAuthToken(token);
      } catch (err) {
        // Se o accessToken falhar, tenta o refreshToken
        const refreshToken = req.headers['x-refresh-token'] || req.body.refreshToken;
        if (!refreshToken) {
          return next(new AppError("Token expirado. Faça login novamente.", 401));
        }

        try {
          const refreshDecoded = jwt.verifyRefreshToken(refreshToken);
          // Se o refreshToken for válido, gera novo accessToken
          const newAccessToken = jwt.generateAuthToken(refreshDecoded.id);
          // Podes enviar esse novo token nos headers ou no corpo
          res.setHeader("x-access-token", newAccessToken);

          decoded = refreshDecoded;
        } catch (refreshErr) {
          return next(new AppError("Sessão expirada. Faça login novamente.", 401));
        }
      }
    } else {
      return next(new AppError("Não autenticado. Token ausente.", 401));
    }

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError("Este utilizador já não existe.", 401));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};


const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

const checkAdminToken = checkRole("admin");

export { protect, checkAdminToken };
