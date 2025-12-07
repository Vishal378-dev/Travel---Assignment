import express from "express";
import { verifyToken } from "../../middlewares/jwt.middleware.js";
import { itineraryCreateValidation, itineraryUpdateValidation } from "../../schema/itinerary.schema.js";
import { createItinerary, deleteItinerary, generateShareLink, getAllItineraries, getItineraryById, getSharedItineraries, updateItinerary } from "../../controllers/itinerary/itinerary.controller.js";
import { validateBody } from "../../utils/validateBody.js";

const itineraryRouter = express.Router();

//public sharable route
itineraryRouter.get("/share",getSharedItineraries);

itineraryRouter.post("/", verifyToken, validateBody(itineraryCreateValidation), createItinerary);

itineraryRouter.get("/", verifyToken, getAllItineraries);
itineraryRouter.get("/:id", verifyToken, getItineraryById);
itineraryRouter.put("/:id", verifyToken, validateBody(itineraryUpdateValidation), updateItinerary);
itineraryRouter.delete("/:id", verifyToken, deleteItinerary);


itineraryRouter.get("/share/generate",verifyToken,generateShareLink);


export default itineraryRouter;