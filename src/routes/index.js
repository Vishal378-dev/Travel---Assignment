import express  from "express";
import userRouter from "./users/users.routes.js";
import itineraryRouter from "./itinerary/itinerary.routes.js";

const router = express.Router();

router.use("/auth",userRouter);
router.use("/itineraries",itineraryRouter);

export default router;