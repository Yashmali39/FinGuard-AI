import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, "Access token is required");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Invalid authorization header");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const employee = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!employee) {
      throw new ApiError(401, "Invalid token");
    }

    if (!employee.isActive) {
      throw new ApiError(
        403,
        "Your account has been deactivated."
      );
    }

    req.user = employee;

    next();
  } catch (error) {
    next(error);
  }
};

export default verifyToken;