import bcrypt from "bcrypt";
import { HTTP_STATUS_CODES } from "../../constants/constants.js";
import User from "../../models/user.model.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/response.js";

export const registerUser = async (req, res) => {
  try {
    req.logger.info({
      query: req.query,
      params: req.params,
      body: req.body,
    });

    let { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendErrorResponse(
        res,
        HTTP_STATUS_CODES.BAD_REQUEST,
        "Email already present"
      );
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
    });
    const response = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return sendSuccessResponse(
      res,
      HTTP_STATUS_CODES.CREATED,
      "User registered successfully",
      response
    );
  } catch (err) {
    req.logger.error({
      message: `Unable to register user`,
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

export const getAllUsers = async (req, res) => {
  try {
    req.logger.info({
      query: req.query,
      params: req.params,
      body: req.body,
    });

    const existingUsers = await User.find({});
    if (!existingUsers) {
      return sendErrorResponse(
        res,
        HTTP_STATUS_CODES.BAD_REQUEST,
        "No Data Found"
      );
    }
    return sendSuccessResponse(
      res,
      HTTP_STATUS_CODES.CREATED,
      "User retrieved successfully",
      existingUsers
    );
  } catch (err) {
    req.logger.error({
      message: `Unable to register user`,
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