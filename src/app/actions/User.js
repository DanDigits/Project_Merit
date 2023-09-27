import urls from "../../../utils/getPath";

export const signUp = async ({
  email,
  rank,
  firstName,
  lastName,
  suffix,
  password,
}) => {
  const response = await fetch(urls.baseUrl + urls.api.user.signUp, {
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
