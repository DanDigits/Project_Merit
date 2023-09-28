/* eslint-disable no-unused-vars */
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

export async function getReport(reportData) {
  await mongoDB();
  let report;

  // Find specific report, or find most recent user report
  if (await ReportSchema.findById(reportData)) {
    report = await ReportSchema.findById(reportData).catch(function (err) {
      return err;
    });
  } else {
    report = await ReportSchema.findOne({ reportData })
      .sort({ date: -1 })
      .catch(function (err) {
        return err;
      });
  }
  return report;
}

export async function getUserReports(email, date) {
  await mongoDB();
  const categories = ["one", "two", "three", "four"]; // PLACEHOLDER
  let reports, quarter, year, temp;

  if (!date) {
    // Find 20 of the users most recent reports
    reports = await ReportSchema.find({ email })
      .sort({ date: -1 })
      .limit(20)
      .catch(function (err) {
        return err;
      });
  } else if (date) {
    // Find total reports for the fiscal year Oct-Sept
    if (date.month() >= 10) {
      temp = await ReportSchema.find({
        email,
        date: { $gte: `${year}-10-1`, $lte: `${year + 1}-9-30` },
      })
        .exec(function (results) {
          reports[0] = results.length;
        })
        .catch(function (err) {
          return err;
        });
    } else if (date.month() <= 9) {
      temp = await ReportSchema.find({
        email,
        date: { $gte: `${year - 1}-10-1`, $lte: `${year}-9-30` },
      })
        .exec(function (results) {
          reports[0] = results.length;
        })
        .catch(function (err) {
          return err;
        });
    }

    // Find total reports for the quarter
    if (
      date.getMonth() == 10 ||
      date.getMonth() == 11 ||
      date.getMonth() == 12
    ) {
      quarter = 1;
    } else if (
      date.getMonth() == 1 ||
      date.getMonth() == 2 ||
      date.getMonth() == 3
    ) {
      quarter = 2;
    } else if (
      date.getMonth() == 4 ||
      date.getMonth() == 5 ||
      date.getMonth() == 6
    ) {
      quarter = 3;
    } else if (
      date.getMonth() == 7 ||
      date.getMonth() == 8 ||
      date.getMonth() == 9
    ) {
      quarter = 4;
    }

    temp = await ReportSchema.find({ email, quarter })
      .exec(function (results) {
        reports[1] = results.length;
      })
      .catch(function (err) {
        return err;
      });

    // Find total reports for each category, for the quarter
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      temp = await ReportSchema.find({ email, quarter, category })
        .exec(function (results) {
          reports[2 + i] = results.length;
        })
        .catch(function (err) {
          return err;
        });
    }
  }
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
  await mongoDB();
  const report = await ReportSchema.findByIdAndUpdate(
    reportId,
    reportInfo
  ).catch(function (err) {
    return err;
  });
  return report;
}
