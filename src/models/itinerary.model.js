import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  time: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
});

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    activities: [activitySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Itinerary", itinerarySchema);