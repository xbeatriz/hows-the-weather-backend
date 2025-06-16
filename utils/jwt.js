import jwt from "jsonwebtoken";
import AppError from "./errorHandler.js";

const generateAuthToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

const generateEmailVerificationToken = (userId) => {
  return jwt.sign({ userId }, process.env.EMAIL_VERIFICATION_SECRET, {
    expiresIn: "1d",
  });
};

const verifyAuthToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError("Invalid or malformed token", 401);
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }
};

const verifyEmailVerificationToken = (token) => {
  try {
    return jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
  } catch (error) {
    throw new AppError("Invalid or malformed email verification token", 401);
  }
};

export default {
  generateAuthToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  verifyAuthToken,
  verifyRefreshToken,
  verifyEmailVerificationToken,
};
