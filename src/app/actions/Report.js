import getPath from "../../../utils/getPath";

export const createReport = async ({ title, email, date, quarter, report }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.reports.create, {
    method: "POST",
    mode: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      email,
      date,
      quarter,
      report,
    }),
  });

  return response;
};

export const updateReport = async ({
  reportId,
  title,
  email,
  date,
  quarter,
  report,
}) => {
  const response = await fetch(getPath.baseUrl + getPath.api.reports.update, {
    method: "PATCH",
    mode: "same-origin",
    headers: {
      report: reportId,
    },
    body: JSON.stringify({
      title,
      email,
      date,
      quarter,
      report,
    }),
  });
  console.log("Update Response:", response.statusText);

  return response;
};

export const getReport = async ({ reportId }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.reports.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      report: reportId,
    },
  });

  console.log(response.statusText);

  return response;
};

export const getUserReports = async ({ email }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.reports.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      user: email,
    },
  });
  console.log(response.statusText);

  return response;
};
