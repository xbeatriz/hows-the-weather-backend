import jwt from "../utils/jwt.js";
import AppError from "../utils/errorHandler.js";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    // 1) Get token from the Authorization header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    // 2) Verify token
    let decoded;
    try {
      decoded = jwt.verifyToken(token);
    } catch (error) {
      return next(
        new AppError("Invalid or malformed token. Please log in again.", 401)
      );
    }

    // 3) Check if the user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    // 4) Grant access and attach the user to the request object
    req.user = currentUser;
    next();
  } catch (error) {
    next(error); 
  }
};

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }
    next();
  };
};

const checkAdminToken = checkRole("admin");

export { protect, checkAdminToken };
