import getPath from "../../../utils/getPath";

export const signUp = async ({
  email,
  rank,
  firstName,
  lastName,
  suffix,
  password,
}) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.signUp, {
    method: "POST",
    mode: "same-origin",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      rank,
      firstName,
      lastName,
      suffix,
      password,
    }),
  });

  console.log(response.statusText);

  return response;
};

export const getUser = async ({ email }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      user: email,
    },
  });
  console.log(response.statusText);

  return response;
};

export const requestReset = async ({ email }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      user: email,
      forgot: "forgotPassword",
    },
  });
  console.log(response.statusText);

  return response;
};

export const updateUser = async ({
  email,
  rank,
  firstName,
  lastName,
  suffix,
}) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.update, {
    method: "PATCH",
    mode: "same-origin",
    headers: {
      user: email,
    },
    body: JSON.stringify({
      email,
      rank,
      firstName,
      lastName,
      suffix,
    }),
  });
  console.log("Update Response:", response.statusText);

  return response;
};

export const updatePassword = async ({ email, password, newPassword }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.update, {
    method: "PATCH",
    mode: "same-origin",
    headers: {
      user: email,
    },
    body: JSON.stringify({
      password,
      newPassword,
    }),
  });
  console.log("Update Response:", response.statusText);

  return response;
};

export const deleteUser = async ({ email }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.delete, {
    method: "DELETE",
    mode: "same-origin",
    headers: {
      user: email,
    },
  });
  console.log(response.statusText);

  return response;
};
