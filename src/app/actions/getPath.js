function getBaseURL() {
  // Base URL for respective installations (container/local/etc)
  console.log(process.env.NEXTAUTH_URL);
  if (process.env.NEXTAUTH_URL != "localhost") {
    return `http://${process.env.NEXTAUTH_URL}:${process.env.PORT}`;
  } else {
    return `http://${process.env.NEXTAUTH_URL}:3000`;
  }
}

export default {
  baseUrl: getBaseURL(),
  api: {
    reports: {
      create: "/api/Reports/create",
      get: "/api/Reports/get",
      update: "/api/Reports/update",
      delete: "/api/Reports/delete",
    },
    user: {
      signUp: "/auth/signUp",
    },
  },
};
