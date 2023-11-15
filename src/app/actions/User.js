import getPath from "../../../utils/getPath";

export const signUp = async ({
  email,
  rank,
  firstName,
  lastName,
  suffix,
  password,
  role = "user",
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
      role,
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
      request: "2",
    },
  });
  console.log("getUser response: ", response.statusText);

  return response;
};

export const getAllUsers = async () => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      request: "6",
    },
  });
  console.log(response.statusText);

  return response;
};

// send password reset email
export const requestReset = async ({ email }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      forgot: email,
      request: "1",
    },
  });
  console.log(response.statusText);

  return response;
};

// resend password request email
export const resendRequest = async ({ email }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.get, {
    method: "GET",
    mode: "same-origin",
    headers: {
      forgot: email,
      request: "3",
    },
  });
  console.log(response.statusText);

  return response;
};

// Specifically for password resets when users are not already signed in
export const resetPassword = async ({ num, newPassword }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.update, {
    method: "PATCH",
    mode: "same-origin",
    headers: {
      user: num,
    },
    body: JSON.stringify({
      newPassword,
    }),
  });
  console.log("Update Response:", response.statusText);

  return response;
};

export const updateUser = async ({
  email,
  rank,
  firstName,
  lastName,
  suffix,
  role,
  group,
  supervisedGroup,
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
      role,
      group,
      supervisedGroup,
    }),
  });
  console.log("Update Response:", response.statusText);

  return response;
};

// Specifically used to change password when the user is already signed in
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

export const deleteUser = async ({ userId }) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.delete, {
    method: "DELETE",
    mode: "same-origin",
    headers: {
      user: userId,
    },
  });
  console.log(response.statusText);

  return response;
};
