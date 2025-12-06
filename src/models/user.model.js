import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "first name is a required field"],
    trim: true,
    minlength: [3, "firstName must be at least 3 characters long"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is a required field"],
    trim: true,
    minlength: [3, "LastName must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
});

export default mongoose.model("User", userSchema);
