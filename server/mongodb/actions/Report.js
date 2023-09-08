import mongoDB from "../dbConnection";
import ReportSchema from "../models/Report";

export async function createReport(reportData) {
  await mongoDB();
  const report = await ReportSchema.create(reportData);
  return report;
}

export async function getReport(reportId) {
  await mongoDB();
  const report = await ReportSchema.findById(reportId);
  return report;
}

export async function getUserReports(email) {
  await mongoDB();
  const reports = await ReportSchema.find({ userEmail: email });
  return reports;
}
