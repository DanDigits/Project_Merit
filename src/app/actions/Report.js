import getPath from "../../../utils/getPath";

export const createReport = async ({
  title,
  email,
  date_of_creation,
  quarter,
  year,
  data,
}) =>
  fetch(getPath.baseUrl + getPath.api.reports.create, {
    method: "POST",
    mode: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      email,
      date_of_creation,
      quarter,
      year,
      data,
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

/* updateReport needs to be corrected to update a specific 
   report rather than create a new one */
export const updateReport = async ({
  reportId,
  title,
  email,
  date_of_creation,
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
      date_of_creation,
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
    method: "POST",
    mode: "same-origin",
    headers: {
      "Content-Type": "application/text",
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

export const getUserReports = async ({ user }) =>
  fetch(getPath.baseUrl + getPath.api.reports.get, {
    method: "POST",
    mode: "same-origin",
    headers: {
      "Content-Type": "application/text",
    },
    body: user._id,
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
