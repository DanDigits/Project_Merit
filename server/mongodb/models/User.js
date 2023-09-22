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
    required: false,
  },
  reportType: {
    type: String,
    required: true,
  },
});

export default mongoose.models.User ?? mongoose.model("User", UserSchema);
