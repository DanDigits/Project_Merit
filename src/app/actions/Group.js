import getPath from "../../../utils/getPath";

export const getGroup = async ({ groupName }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      group: groupName,
      request: "4",
    },
  });
  console.log("getUser response: ", response.statusText);

  return response;
};

export const getSupervisor = async ({ groupName }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      group: groupName,
      request: "8",
    },
  });
  console.log("getUser response: ", response.statusText);

  return response;
};
