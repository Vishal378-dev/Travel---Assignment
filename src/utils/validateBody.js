import { sendErrorResponse } from "../utils/response.js";
import { HTTP_STATUS_CODES } from "../constants/constants.js";

export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS_CODES.BAD_REQUEST,
      "Validation Error",
      error.details.map((d) => d.message)
    );
  }

  req.body = value;
  next();
};