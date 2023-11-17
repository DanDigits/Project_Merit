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

export const getAllGroups = async () => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      request: "8",
    },
  });
  console.log("getUser response: ", response.statusText);

  return response;
};

export const getSupervisor = async ({ group }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      group,
      request: "9",
    },
  });
  console.log("getUser response: ", response.statusText);

  return response;
};

/** Not yet implemented. Needs endpoint that will clear the
 *  group field for all users in the array.
 */

export const removeFromGroup = async ({ userArray }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.update, {
    method: "PATCH",
    mode: "same-origin",
    body: JSON.stringify({
      email: userArray,
    }),
  });
  console.log("Update Response:", response.statusText);

  return response;
};

export const leaveGroup = async ({ email }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.update, {
    method: "PATCH",
    mode: "same-origin",
    headers: {
      user: email,
    },
    body: JSON.stringify({
      email,
      group: "",
    }),
  });
  console.log("Update Response:", response.statusText);

  return response;
};

export const renameGroup = async ({ groupName, newName }) => {
  console.log("82", groupName);
  const response = await fetch(getPath.baseUrl + getPath.api.user.update, {
    method: "PATCH",
    mode: "same-origin",
    headers: {
      group: groupName,
    },
    body: JSON.stringify({
      newGroup: newName,
    }),
  });
  console.log("Update Response:", response.statusText);

  return response;
};

export const deleteGroup = async ({ groupName }) => {
  console.log(groupName);
  const response = await fetch(getPath.baseUrl + getPath.api.user.delete, {
    method: "DELETE",
    mode: "same-origin",
    headers: {
      group: groupName,
    },
    body: JSON.stringify({}),
  });
  console.log("Update Response:", response.statusText);

  return response;
};
