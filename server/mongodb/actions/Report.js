/* eslint-disable prettier/prettier */
import mongoDB from "../dbConnection";
import ReportSchema from "../models/Report";

export async function createReport(reportData) {
  await mongoDB();
  const report = await ReportSchema.create(reportData).catch(function (err) {
    return err;
  });
  return report;
}

export async function getReport(reportId) {
  await mongoDB();
  const report = await ReportSchema.findById(reportId).catch(function (err) {
    return err;
  });
  return report;
}

export async function getUserReports(email) {
  await mongoDB();
  const reports = await ReportSchema.find({ email }).catch(function (err) {
    return err;
  });
  return reports;
}

export async function deleteReport(reportId) {
  await mongoDB();
  const report = await ReportSchema.findByIdAndDelete(reportId).catch(function (
    err
  ) {
    return err;
  });
  return report;
}

export async function modifyReport(reportId, reportInfo) {
  console.log(reportInfo);
  await mongoDB();
  const report = await ReportSchema.findByIdAndUpdate(
    reportId,
    reportInfo
  ).catch(function (err) {
    return err;
  });
  return report;
}
