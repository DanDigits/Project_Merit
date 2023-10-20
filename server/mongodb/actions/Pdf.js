/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import mongoDB from "../dbConnection";
import ReportSchema from "../models/Report";
import UserSchema from "../models/User";

export async function pullReports(reportId) {
  await mongoDB();
  let i = 0;
  console.error(reportId);
  let length = reportId?.id?.length;
  let reports;

  if (length == undefined) {
    return "ERROR";
  } else {
    while (i < length) {
      const report = await ReportSchema?.findById({
        _id: reportId?.id[i],
      }).catch(function (err) {
        reports[i].push(report);
      });
      i++;
    }
  }
  return reports;
}
