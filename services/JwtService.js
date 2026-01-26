

import jwt from "jsonwebtoken";
import envVariables from "../config/Constants.js";
import User from "../models/User.js";

const { accessTokenSecret, refreshTokenSecret } = envVariables;

// Generate tokens
export const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: "24h" });
  const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: "30d" });
  return { accessToken, refreshToken };
};

// Store only refresh token
export const storeTokens = async (accessToken, refreshToken, userId) => {
  return await User.update(
    { accessToken, refreshToken },
    { where: { userId } }
  );
};

// Verify access token (stateless, no DB check)
export const verifyAccessToken = async (token) => {
  try {
    const decodedToken = jwt.verify(token, accessTokenSecret);
    const user = await User.findOne({ where: { userId: decodedToken.userId } });
    if (!user) throw Object.assign(new Error("user_not_found"), { statusCode: 401 });
    return user;
  } catch (error) {
    if (error.name === "TokenExpiredError") error.message = "Access token expired";
    else if (error.message === "user_not_found") error.message = "Invalid token";
    else error.message = "Token invalid";
    throw error;
  }
};

// Verify refresh token (check DB)
export const verifyRefreshToken = async (token) => {
  try {
    const decodedToken = jwt.verify(token, refreshTokenSecret);
    const user = await User.findOne({ where: { userId: decodedToken.userId, refreshToken: token } });
    if (!user) throw Object.assign(new Error("user_not_found"), { statusCode: 401 });
    return user;
  } catch (error) {
    if (error.name === "TokenExpiredError") error.message = "Refresh token expired";
    else if (error.message === "user_not_found") error.message = "Invalid refresh token";
    else error.message = "Token invalid";
    throw error;
  }
};
