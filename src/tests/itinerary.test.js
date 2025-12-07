import request from "supertest";
import app from "../../app.js";
import Itinerary from "../models/itinerary.model.js";
import User from "../models/user.model.js";
import { connectDB, disconnectDB } from "./db.setup.js";
import jwt from "jsonwebtoken";

const TEST_USER_ID = "507f1f77bcf86cd799439011";
const createTestToken = () => {
  return jwt.sign(
    { id: TEST_USER_ID, email: "test@example.com" },
    process.env.JWT_SECRET || "test-secret",
    { expiresIn: "1h" }
  );
};

const TEST_JWT = createTestToken();

console.log(`--------------------Token----------------`,TEST_JWT);

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret";
  await connectDB();
  await User.create({
    _id: TEST_USER_ID,
    firstName:"jksds",
    lastName:"sdfsdjflk",
    email: "test@example.com",
    password: "hashedpass"
  });
},30000);

afterAll(async () => {
  await disconnectDB();
},30000);

afterEach(async () => {
  await Itinerary.deleteMany({});
});

describe("Itinerary API", () => {
  
  it("should create a new itinerary", async () => {
    const payload = {
      title: "Trip to Paris",
      destination: "Paris",
      startDate: "2025-12-20",
      endDate: "2025-12-25",
      activities: [
        { time: "10:00", description: "Eiffel Tower visit", location: "Paris" }
      ]
    };

    const res = await request(app)
      .post("/api/itineraries")
      .send(payload)
      .set("Authorization", `Bearer ${TEST_JWT}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(payload.title);
    expect(res.body.data.destination).toBe(payload.destination);
  });

  it("should fetch all itineraries", async () => {
    await Itinerary.create([
      { title: "Trip1", destination: "Paris", startDate: "2025-12-20", endDate: "2025-12-25", userId: TEST_USER_ID },
      { title: "Trip2", destination: "Rome", startDate: "2025-11-10", endDate: "2025-11-15", userId: TEST_USER_ID }
    ]);

    const res = await request(app)
      .get("/api/itineraries")
      .set("Authorization", `Bearer ${TEST_JWT}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.itineraries.length).toBe(2);
  });

  it("should get itinerary by id", async () => {
    const itinerary = await Itinerary.create({ title: "Trip1", destination: "Paris", startDate: "2025-12-20", endDate: "2025-12-25", userId: TEST_USER_ID });

    const res = await request(app)
      .get(`/api/itineraries/${itinerary._id}`)
      .set("Authorization", `Bearer ${TEST_JWT}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("Trip1");
  });

  it("should delete an itinerary", async () => {
    const itinerary = await Itinerary.create({ title: "Trip1", destination: "Paris", startDate: "2025-12-20", endDate: "2025-12-25", userId: TEST_USER_ID });

    const res = await request(app)
      .delete(`/api/itineraries/${itinerary._id}`)
      .set("Authorization", `Bearer ${TEST_JWT}`);

    expect(res.statusCode).toBe(200);

    const found = await Itinerary.findById(itinerary._id);
    expect(found).toBeNull();
  });

});