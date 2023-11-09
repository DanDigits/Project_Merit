import getPath from "../../../utils/getPath";

/** These functions are only meant to be used by admins */

/** Creates an account for a user. Triggers an email to verify their account. */
export const createUser = async ({
  email,
  rank,
  firstName,
  lastName,
  suffix,
  password,
  role,
  group,
  supervisedGroup,
}) => {
  const response = await fetch(getPath.baseUrl + getPath.api.user.signUp, {
    method: "POST",
    mode: "same-origin",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      admin: "id",
    },
    body: JSON.stringify({
      email,
      rank,
      firstName,
      lastName,
      suffix,
      password,
      role,
      group,
      supervisedGroup,
    }),
  });

  console.log(response.statusText);

  return response;
};
