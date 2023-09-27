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
  date: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  report: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Report ?? mongoose.model("Report", ReportSchema);
