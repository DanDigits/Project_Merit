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
  if (reportData.toLowerCase().includes("@")) {
    report = await ReportSchema.find({ email: reportData })
      .sort({ date: -1 })
      .limit(1)
      .catch(function (err) {
        return err;
      });
  } else {
    report = await ReportSchema.findById(reportData).catch(function (err) {
      return err;
    });
  }
  return report;
}

// The second eponymous parameter, is either respectively the index for loading additional reports, or the current date
export async function getUserReports(email, parameter) {
  await mongoDB();
  const categories = ["Duties", "Conduct", "Training", "Teamwork"];
  let reports, quarter, temp, date, index;

  if (typeof parseInt(parameter) === "number" && !isNaN(parseInt(parameter))) {
    index = parseInt(parameter);
    // Find 20 of the users most recent reports, after the given index
    reports = await ReportSchema.find({ email })
      .sort({ date: -1 })
      //.skip(index * 20)
      //.limit(20)
      .catch(function (err) {
        return err;
      });
  } else if (parameter?.getMonth() != undefined) {
    date = parameter;
    reports = [];
    // Find total reports for the fiscal year Oct-Sept
    if (date.getMonth() >= 10) {
      temp = await ReportSchema.find({
        email,
        date: {
          $gte: `${date.getFullYear()}-10-01`,
          $lte: `${date.getFullYear() + 1}-09-30`,
        },
      }).catch(function (err) {
        return err;
      });
      temp = JSON.stringify(temp);
      let count = temp.match(/email/g).length;
      reports.push(count);
    } else if (date.getMonth() <= 9) {
      temp = await ReportSchema.find({
        email,
        date: {
          $gte: `${date.getFullYear() - 1}-10-01`,
          $lte: `${date.getFullYear()}-09-30`,
        },
      }).catch(function (err) {
        return err;
      });
      temp = JSON.stringify(temp);
      let count = temp?.match(/email/g)?.length;
      if (count === undefined) {
        reports.push(0);
      } else {
        reports.push(count);
      }
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

    temp = await ReportSchema.find({
      email,
      quarter,
    }).catch(function (err) {
      return err;
    });
    temp = JSON.stringify(temp);
    let count = temp?.match(/email/g)?.length;
    if (count === undefined) {
      reports.push(0);
    } else {
      reports.push(count);
    }

    // Find total reports for each category, for the quarter
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      temp = await ReportSchema.find({
        email,
        quarter,
        category,
      }).catch(function (err) {
        return err;
      });
      temp = JSON.stringify(temp);
      let count = temp?.match(/email/g)?.length;
      if (count === undefined) {
        reports.push(0);
      } else {
        reports.push(count);
      }
    }
  } else {
    reports = "ERROR";
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
