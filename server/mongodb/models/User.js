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
  role: {
    type: String,
    required: true,
  },
  emailVerification: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: String,
    required: true,
    default: "Never logged in",
  },
  group: {
    type: String,
    required: false,
  },
  supervisedGroup: {
    type: String,
    required: false,
  },
  passwordLocked: {
    type: Boolean,
    required: false,
    default: false,
  },
  suspended: {
    type: Boolean,
    required: false,
    default: false,
  },
  totalReports: {
    type: Number,
    required: false,
    default: 0,
  },
  currentQuarter: {
    type: Number,
    required: false,
    default: 0,
  },
  quarterReports: {
    type: Number,
    required: false,
    default: 0,
  },
  Mission: {
    type: Number,
    required: false,
    default: 0,
  },
  Leadership: {
    type: Number,
    required: false,
    default: 0,
  },
  Resources: {
    type: Number,
    required: false,
    default: 0,
  },
  Unit: {
    type: Number,
    required: false,
    default: 0,
  },
  mostRecentReportDate: {
    type: String,
    required: false,
    default: 0,
  },
});

export default mongoose.models.User ?? mongoose.model("User", UserSchema);
