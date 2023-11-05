import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  suffix: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  rank: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  isPasswordLocked: {
    type: Boolean,
    required: true,
  },
  emailVerification: {
    type: String,
    required: true,
  },
  group: {
    type: [String],
    required: false,
  },
  supervisedGroup: {
    type: [String],
    required: false,
  },
});

export default mongoose.models.User ?? mongoose.model("User", UserSchema);
