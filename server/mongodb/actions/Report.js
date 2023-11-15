/* eslint-disable no-unused-vars */
import mongoDB from "../dbConnection";
import ReportSchema from "../models/Report";
import { modifyUser, getUser } from "./User";

export async function createReport(reportData) {
  await mongoDB();
  const report = await ReportSchema.create(reportData).catch(function (err) {
    return err;
  });
  await updateUserReportStatistics(report.email);
  return report;
}

// Improve
export async function getReport(reportData) {
  await mongoDB();
  let report;

  // Find specific report, or find most recent user report
  if (reportData.toLowerCase().includes("@")) {
    report = await ReportSchema?.findOne({ user: reportData })
      .sort({ date: -1 })
      .catch(function (err) {
        return err;
      });
  } else {
    report = await ReportSchema?.findById({ _id: reportData }).catch(function (
      err
    ) {
      return err;
    });
  }
  report.date = report?.date.slice(0, 10);
  if (report == null) {
    report = "None";
  }
  return report;
}

export async function updateUserReportStatistics(email) {
  await mongoDB();
  let quarter,
    temp,
    reportDate,
    user = await getUser(email).catch(function (err) {
      return err;
    });
  const categories = ["Mission", "Leadership", "Resources", "Unit"];
  const date = new Date();

  // Find most recent reported event date
  reportDate = await ReportSchema.find({ email: email }, "date -_id")
    .sort({ date: -1 })
    .limit(1)
    .catch(function (err) {
      return err;
    });
  user.mostRecentReportDate = reportDate[0].date.slice(0, 10);

  // Find total reports for the fiscal year Oct-Sept
  if (date.getMonth() >= 9) {
    temp = await ReportSchema.find({
      email,
      date: {
        $gte: `${date.getFullYear()}-10-01T00:00:00.000Z`,
        $lte: `${date.getFullYear() + 1}-09-30T00:00:00.000Z`,
      },
    }).catch(function (err) {
      return err;
    });
    temp = JSON.stringify(temp);
    let count = temp?.match(/_id/g)?.length;
    if (count == undefined) {
      user.totalReports = 0;
    } else {
      user.totalReports = count;
    }
  } else if (date.getMonth() <= 8) {
    temp = await ReportSchema.find({
      email,
      date: {
        $gte: `${date.getFullYear() - 1}-10-01T00:00:00.000Z`,
        $lte: `${date.getFullYear()}-09-30T00:00:00.000Z`,
      },
    }).catch(function (err) {
      return err;
    });
    temp = JSON.stringify(temp);
    let count = temp?.match(/_id/g)?.length;
    if (count === undefined) {
      user.totalReports = 0;
    } else {
      user.totalReports = count;
    }
  }

  // Find total reports for the quarter
  var month = date.getMonth() + 1;
  if (month == 10 || month == 11 || month == 12) {
    quarter = 1;
  } else if (month == 1 || month == 2 || month == 3) {
    quarter = 2;
  } else if (month == 4 || month == 5 || month == 6) {
    quarter = 3;
  } else if (month == 7 || month == 8 || month == 9) {
    quarter = 4;
  }
  user.currentQuarter = quarter;

  if (quarter == 1) {
    temp = await ReportSchema.find({
      email,
      quarter,
      date: {
        $gte: `${date.getFullYear()}-10-01T00:00:00.000Z`,
        $lte: `${date.getFullYear() + 1}-09-30T00:00:00.000Z`,
      },
    }).catch(function (err) {
      return err;
    });
  } else {
    temp = await ReportSchema.find({
      email,
      quarter,
      date: {
        $gte: `${date.getFullYear() - 1}-10-01T00:00:00.000Z`,
        $lte: `${date.getFullYear()}-09-30T00:00:00.000Z`,
      },
    }).catch(function (err) {
      return err;
    });
  }
  temp = JSON.stringify(temp);
  let count = temp?.match(/_id/g)?.length;
  if (count === undefined) {
    user.quarterReports = 0;
  } else {
    user.quarterReports = count;
  }

  //Find total reports for each category, for the quarter
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    if (quarter == 1) {
      temp = await ReportSchema.find({
        email,
        quarter,
        category,
        date: {
          $gte: `${date.getFullYear()}-10-01T00:00:00.000Z`,
          $lte: `${date.getFullYear() + 1}-09-30T00:00:00.000Z`,
        },
      }).catch(function (err) {
        return err;
      });
    } else {
      temp = await ReportSchema.find({
        email,
        quarter,
        category,
        date: {
          $gte: `${date.getFullYear() - 1}-10-01T00:00:00.000Z`,
          $lte: `${date.getFullYear()}-09-30T00:00:00.000Z`,
        },
      }).catch(function (err) {
        return err;
      });
    }
    temp = JSON.stringify(temp);
    let count = temp?.match(/_id/g)?.length;
    if (count == undefined) {
      user[category] = 0;
    } else {
      user[category] = count;
    }
  }

  console.log(user);
  await modifyUser(email, user);
}

// Get a users reports, with the parameter value being an index for pagination
export async function getUserReports(email, parameter) {
  await mongoDB();
  const categories = ["Mission", "Leadership", "Resources", "Unit"];
  let reports,
    index,
    i = 0;

  //index = parseInt(parameter);
  //Find # of the users most recent reports, after the given index, pagination; currently not implemented
  reports = await ReportSchema.find({ email })
    .sort({ date: -1 })
    //.skip(index * 20)
    //.limit(20)
    .catch(function (err) {
      return err;
    });

  while (reports[i] != undefined) {
    reports[i].date = reports[i]?.date.slice(0, 10);
    console.log(reports[i].date);
    i++;
  }
  return reports;
}

export async function deleteReport(reportId) {
  await mongoDB();
  let i = 0;
  let length = reportId?.id?.length;
  let reports, userUpdateReport;

  if (length == undefined) {
    return "ERROR";
  } else {
    userUpdateReport = await ReportSchema?.findById({ _id: reportId?.id[0] });
    while (i < length) {
      const report = await ReportSchema?.findByIdAndDelete({
        _id: reportId?.id[i],
      }).catch(function (err) {
        reports[i].push(report);
      });
      i++;
    }
  }

  // Update user statistics
  await updateUserReportStatistics(userUpdateReport.email);
  return reports;
}

export async function modifyReport(reportId, reportInfo) {
  await mongoDB();
  const report = await ReportSchema.findByIdAndUpdate(
    reportId,
    reportInfo
  ).catch(function (err) {
    return err;
  });

  // Update user statistics
  await updateUserReportStatistics(report.email);
  return report;
}

export async function pullReports(reportId) {
  await mongoDB();
  let i = 0;
  let length = reportId?.id?.length;
  let reports = [];

  if (length == undefined) {
    return "ERROR";
  } else {
    while (i < length) {
      const report = await ReportSchema?.findById({
        _id: reportId?.id[i],
      }).catch(function (err) {
        return err;
      });
      reports.push(report);
      i++;
    }
  }
  return reports;
}
