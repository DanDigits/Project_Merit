import getPath from "../../../utils/getPath";

/** Create new report */
export const createReport = async ({
  title,
  email,
  date,
  category,
  report,
}) => {
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
      category,
      report,
    }),
  });

  return response;
};

/** Update report */
export const updateReport = async ({
  reportId,
  title,
  email,
  date,
  category,
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
      category,
      report,
    }),
  });
  console.log("Update Response:", response.statusText);

  return response;
};

/** Get list of reports for user */
export const getUserReports = async ({ email, index }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.reports.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      request: "1",
      user: email,
      index: index,
    },
  });
  console.log(response.statusText);

  return response;
};

/** Get most recent report for user */
export const getLastReport = async ({ email }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.reports.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      request: "2",
      user: email,
    },
  });
  console.log(response.statusText);

  return response;
};

/** Get report totals for fiscal year, quarter, and catetories */
export const getTotals = async ({ email }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.reports.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      request: "3",
      user: email,
    },
  });
  console.log(response.statusText);

  return response;
};

/** Create new report */
export const getReport = async ({ reportId }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.reports.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      request: "4",
      report: reportId,
    },
  });

  console.log(response.statusText);

  return response;
};

export const deleteReport = async ({ reportId }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.reports.delete, {
    method: "DELETE",
    mode: "same-origin",
    body: {
      id: reportId,
    },
  });
  console.log(response.statusText);

  return response;
};
