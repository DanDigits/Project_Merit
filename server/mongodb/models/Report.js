import mongoose, { Schema } from "mongoose";

const ReportSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date_of_creation: {
    type: String,
    required: true,
  },
  quarter: {
    type: Number,
    required: true,
  },
  report: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Report ?? mongoose.model("Report", ReportSchema);
