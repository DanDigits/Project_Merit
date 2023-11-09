import getPath from "../../../utils/getPath";
import saveAs from "file-saver";

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
      request: "1",
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
  console.log("getLastReport response: ", response.statusText);

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
  console.log("getTotals response: ", response.statusText);

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

export const deleteReport = async ({ reportArray }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.reports.delete, {
    method: "DELETE",
    mode: "same-origin",
    body: JSON.stringify({ id: reportArray }),
  });
  console.log(response.statusText);

  return response;
};

export const exportReports = async ({ reportArray }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.reports.create, {
    method: "POST",
    mode: "same-origin",
    headers: {
      request: "2",
    },
    body: JSON.stringify({ id: reportArray }),
  });

  // Extract filename from header
  const filename = response.headers
    .get("content-disposition")
    .split(";")
    .find((n) => n.includes("filename="))
    .replace("filename=", "")
    .replace('"', "")
    .replace('"', "")
    .trim();
  const blob = await response.blob();

  // Download the file
  saveAs(blob, filename);

  console.log(response.statusText);

  return response;
};
