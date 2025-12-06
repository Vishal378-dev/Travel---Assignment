import jwt from "jsonwebtoken";
import { HTTP_STATUS_CODES } from "../constants/constants.js";
import { sendErrorResponse } from "../utils/response.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendErrorResponse(
        res,
        HTTP_STATUS_CODES.UNAUTHORIZED,
        "No token provided"
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (err) {
    return sendErrorResponse(
      res,
      HTTP_STATUS_CODES.UNAUTHORIZED,
      "Invalid or expired token"
    );
  }
};
