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

/** Not yet implemented. Needs endpoint that will clear the
 *  group field for all users in the array.
 */

export const removeFromGroup = async ({ userArray }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.update, {
    method: "PATCH",
    mode: "same-origin",
    headers: {
      user: email,
    },
    body: JSON.stringify({
      userArray,
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

export const renameGroup = async ({ group, newName }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.update, {
    method: "PATCH",
    mode: "same-origin",
    headers: {
      group,
    },
    body: JSON.stringify({
      newGroup: newName,
    }),
  });
  console.log("Update Response:", response.statusText);

  return response;
};

export const deleteGroup = async ({ groupName }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.delete, {
    method: "DELETE",
    mode: "same-origin",
    body: JSON.stringify({
      group: groupName,
    }),
  });
  console.log("Update Response:", response.statusText);

  return response;
};
