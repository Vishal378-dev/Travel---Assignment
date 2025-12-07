import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HTTP_STATUS_CODES } from "../../constants/constants.js";
import User from "../../models/user.model.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/response.js";
import { loginValidation } from "../../schema/user.schema.js";

export const loginUser = async (req, res) => {
  try {
    req.logger.info({
      query: req.query,
      params: req.params,
      body: req.body,
    });

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return sendErrorResponse(
        res,
        HTTP_STATUS_CODES.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendErrorResponse(
        res,
        HTTP_STATUS_CODES.UNAUTHORIZED,
        "Invalid email or password"
      );
    }
    const payload = {
      id: user._id,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return sendSuccessResponse(
      res,
      HTTP_STATUS_CODES.OK,
      "Login successful",
      {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        },
        token,
      }
    );

  } catch (err) {
    req.logger.error({
      message: "Unable to login user",
      errorMessage: err.message,
      errorStack: err.stack,
      errorName: err.name,
    });

    return sendErrorResponse(
      res,
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      `Something went wrong - ${err.message || err}`
    );
  }
};
