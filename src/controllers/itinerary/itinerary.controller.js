import jwt from "jsonwebtoken";
import Itinerary from "../../models/itinerary.model.js";
import { HTTP_STATUS_CODES } from "../../constants/constants.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/response.js";
import { redisClient } from "../../db/redis.db.js";

export const createItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.create({ ...req.body, userId: req.user.id });
    return sendSuccessResponse(res, HTTP_STATUS_CODES.CREATED, "Itinerary created", itinerary);
  } catch (err) {
    return sendErrorResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const getAllItineraries = async (req, res) => {
  try {
    const { page = 1, limit = 10, destination, sortBy, sortOrder = "asc", startDate, endDate, title } = req.query;

    const filter = {};
    if (destination) filter.destination = destination;
    if (title) filter.title = { $regex: title, $options: "i" };
    if (startDate && endDate) filter.startDate = { $gte: new Date(startDate) };
    if (endDate) filter.endDate = { $lte: new Date(endDate) };

    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const itineraries = await Itinerary.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Itinerary.countDocuments(filter);

    return sendSuccessResponse(res, HTTP_STATUS_CODES.OK, "Itineraries fetched", {
      page: Number(page),
      limit: Number(limit),
      total,
      itineraries
    });
  } catch (err) {
    return sendErrorResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const getItineraryById = async (req, res) => {
  try {
    const {id} = req.params;
    if(!id){
        return sendErrorResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, "Missing Params - id is required");
    }
    const cacheKey = `itinerary:${id}`;
    const cachedData = await redisClient.get(cacheKey);
    if(cachedData){
        return sendSuccessResponse(
        res,
        HTTP_STATUS_CODES.OK,
        "Itinerary fetched (cache)",
        JSON.parse(cachedData)
      );
    }
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) return sendErrorResponse(res, HTTP_STATUS_CODES.NOT_FOUND, "Not Data found");
    await redisClient.set(cacheKey, JSON.stringify(itinerary), "EX", 300);
    return sendSuccessResponse(res, HTTP_STATUS_CODES.OK, "Itinerary fetched", itinerary);
  } catch (err) {
    return sendErrorResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const updateItinerary = async (req, res) => {
  try {
    const {id} = req.params;
    if(!id){
        return sendErrorResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, "Missing Params - id is required");
    }
    const itinerary = await Itinerary.findByIdAndUpdate(id, req.body, { new: true });
    if (!itinerary) return sendErrorResponse(res, HTTP_STATUS_CODES.NOT_FOUND, "Not Data found");
    return sendSuccessResponse(res, HTTP_STATUS_CODES.OK, "Updated successfully", itinerary);
  } catch (err) {
    return sendErrorResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const deleteItinerary = async (req, res) => {
  try {
    const {id} = req.params;
    if(!id){
        return sendErrorResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, "Missing Params - id is required");
    }
    const itinerary = await Itinerary.findByIdAndDelete(id);
    if (!itinerary) return sendErrorResponse(res, HTTP_STATUS_CODES.NOT_FOUND, "Not Data found");
    return sendSuccessResponse(res, HTTP_STATUS_CODES.OK, "Deleted successfully", itinerary);
  } catch (err) {
    return sendErrorResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const generateShareLink = (req, res) => {
  try{

    const token = jwt.sign(
      { userId: req.user.id },
      process.env.SHARE_SECRET,
      { expiresIn: "7d" }
    );
  
    return sendSuccessResponse(res, 200, "Share link created", {
      link: `${process.env.HOST}/api/itineraries/share?token=${token}`
    });
  }catch (err) {
    return sendErrorResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

export const getSharedItineraries = async (req, res) => {
  try{
    const token = req.query.token;
    if(!token){
      return sendErrorResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, "Missing Token");
    }
    
    const decoded = jwt.verify(token, process.env.SHARE_SECRET);
  
    const itineraries = await Itinerary.find({ userId: decoded.userId }).select("-password -userId");
  
    return sendSuccessResponse(res, HTTP_STATUS_CODES.OK, "Shared itineraries", itineraries);
  }catch (err) {
    return sendErrorResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};
