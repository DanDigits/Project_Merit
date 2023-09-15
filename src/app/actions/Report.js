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

/* updateReport needs to be corrected to update a specific 
   report rather than create a new one */
export const updateReport = async ({
  reportId,
  title,
  email,
  date,
  quarter,
  report,
}) =>
  fetch(getPath.baseUrl + getPath.api.reports.update, {
    method: "POST",
    mode: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reportId,
      title,
      email,
      date,
      quarter,
      report,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json == null) {
        throw new Error("Could not connect to API");
      }
      if (!json.success) {
        throw new Error(json.message);
      }
      return json.payload;
    });

export const getReport = async ({ reportId }) =>
  fetch(getPath.baseUrl + getPath.api.reports.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      "Content-Type": "report",
    },
    body: reportId,
  })
    .then((response) => response.json())
    .then((json) => {
      if (json == null) {
        throw new Error("Could not connect to API");
      }
      if (!json.success) {
        throw new Error(json.message);
      }
      return json.payload;
    });

export const getUserReports = async ({ email }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.reports.delete, {
    method: "GET",
    mode: "same-origin",
    headers: {
      "Content-Type": "user",
    },
  });

  return response;
};
